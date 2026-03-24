import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors } from "../_shared/api-cors.ts";
import { generateApiKey } from "../_shared/api-auth.ts";
import { successResponse, errorResponse, createdResponse } from "../_shared/api-response.ts";
import { CommonErrors } from "../_shared/api-errors.ts";
import { parseRequestBody, validateAndParse } from "../_shared/api-validation.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw CommonErrors.internal("Supabase configuration missing");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw CommonErrors.unauthorized("Authorization header required");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw CommonErrors.unauthorized("Invalid authentication token");
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const apiKeyId = pathSegments[pathSegments.length - 1];

    if (req.method === "GET") {
      const { data: apiKeys, error } = await supabase
        .from("crm_api_keys")
        .select("id, name, key_preview, permissions, rate_limit_per_minute, rate_limit_per_day, is_active, last_used_at, expires_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw CommonErrors.internal("Failed to fetch API keys");
      }

      return successResponse(apiKeys || []);
    }

    if (req.method === "POST") {
      const body = await parseRequestBody(req);

      const validated = validateAndParse(body, [
        { field: "name", type: "string", required: true, min: 3, max: 100 },
        { field: "permissions", type: "object", required: false },
        { field: "rate_limit_per_minute", type: "number", required: false, min: 1, max: 1000 },
        { field: "rate_limit_per_day", type: "number", required: false, min: 1, max: 100000 },
        { field: "expires_at", type: "string", required: false },
      ]);

      const { key, hash, preview } = await generateApiKey();

      const { data: newKey, error } = await supabase
        .from("crm_api_keys")
        .insert({
          user_id: user.id,
          name: validated.name,
          key_hash: hash,
          key_preview: preview,
          permissions: validated.permissions || {
            read: ["*"],
            write: [],
            delete: [],
          },
          rate_limit_per_minute: validated.rate_limit_per_minute || 60,
          rate_limit_per_day: validated.rate_limit_per_day || 10000,
          expires_at: validated.expires_at || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating API key:", error);
        throw CommonErrors.internal("Failed to create API key");
      }

      return createdResponse({
        ...newKey,
        key,
        warning: "Save this key securely. It will not be shown again!",
      });
    }

    if (req.method === "DELETE") {
      if (!apiKeyId || apiKeyId === "api-keys") {
        throw CommonErrors.badRequest("API key ID is required");
      }

      const { error } = await supabase
        .from("crm_api_keys")
        .delete()
        .eq("id", apiKeyId)
        .eq("user_id", user.id);

      if (error) {
        throw CommonErrors.internal("Failed to delete API key");
      }

      return successResponse({ message: "API key deleted successfully" });
    }

    if (req.method === "PATCH") {
      if (!apiKeyId || apiKeyId === "api-keys") {
        throw CommonErrors.badRequest("API key ID is required");
      }

      const body = await parseRequestBody(req);

      const validated = validateAndParse(body, [
        { field: "name", type: "string", required: false, min: 3, max: 100 },
        { field: "is_active", type: "boolean", required: false },
        { field: "permissions", type: "object", required: false },
        { field: "rate_limit_per_minute", type: "number", required: false, min: 1, max: 1000 },
        { field: "rate_limit_per_day", type: "number", required: false, min: 1, max: 100000 },
      ]);

      const updates: any = {};
      if (validated.name !== undefined) updates.name = validated.name;
      if (validated.is_active !== undefined) updates.is_active = validated.is_active;
      if (validated.permissions !== undefined) updates.permissions = validated.permissions;
      if (validated.rate_limit_per_minute !== undefined)
        updates.rate_limit_per_minute = validated.rate_limit_per_minute;
      if (validated.rate_limit_per_day !== undefined)
        updates.rate_limit_per_day = validated.rate_limit_per_day;

      const { data: updatedKey, error } = await supabase
        .from("crm_api_keys")
        .update(updates)
        .eq("id", apiKeyId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw CommonErrors.internal("Failed to update API key");
      }

      return successResponse(updatedKey);
    }

    throw CommonErrors.badRequest(`Method ${req.method} not allowed`);
  } catch (error) {
    return errorResponse(error);
  }
});
