import { createClient } from "npm:@supabase/supabase-js@2";
import { CommonErrors } from "./api-errors.ts";

export interface ApiKeyData {
  id: string;
  user_id: string;
  name: string;
  permissions: {
    read: string[];
    write: string[];
    delete: string[];
  };
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  is_active: boolean;
  expires_at: string | null;
}

export interface AuthContext {
  apiKey: ApiKeyData;
  userId: string;
}

export async function authenticateApiKey(req: Request): Promise<AuthContext> {
  const apiKey = extractApiKey(req);

  if (!apiKey) {
    throw CommonErrors.unauthorized("API key is required");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    throw CommonErrors.internal("Supabase configuration missing");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: apiKeyData, error } = await supabase
    .from("crm_api_keys")
    .select("*")
    .eq("key_hash", await hashApiKey(apiKey))
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching API key:", error);
    throw CommonErrors.internal("Failed to authenticate");
  }

  if (!apiKeyData) {
    throw CommonErrors.invalidKey();
  }

  if (apiKeyData.expires_at) {
    const expiresAt = new Date(apiKeyData.expires_at);
    if (expiresAt < new Date()) {
      throw CommonErrors.expiredKey();
    }
  }

  await supabase
    .from("crm_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", apiKeyData.id);

  return {
    apiKey: apiKeyData as ApiKeyData,
    userId: apiKeyData.user_id,
  };
}

function extractApiKey(req: Request): string | null {
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const apiKeyHeader = req.headers.get("X-API-Key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function checkPermission(
  context: AuthContext,
  resource: string,
  action: "read" | "write" | "delete"
): boolean {
  const permissions = context.apiKey.permissions[action];

  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(resource);
}

export function requirePermission(
  context: AuthContext,
  resource: string,
  action: "read" | "write" | "delete"
): void {
  if (!checkPermission(context, resource, action)) {
    throw CommonErrors.forbidden(
      `You don't have ${action} permission for ${resource}`
    );
  }
}

export async function generateApiKey(): Promise<{
  key: string;
  hash: string;
  preview: string;
}> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const key = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  const hash = await hashApiKey(key);
  const preview = key.slice(-8);

  return { key, hash, preview };
}
