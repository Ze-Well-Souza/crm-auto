import { createClient } from "npm:@supabase/supabase-js@2";
import type { AuthContext } from "./api-auth.ts";

export interface LogEntry {
  api_key_id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms?: number;
  ip_address?: string;
  user_agent?: string;
  request_body?: any;
  response_body?: any;
  error_message?: string;
}

export async function logApiRequest(entry: LogEntry): Promise<void> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration missing for logging");
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("crm_api_logs").insert({
      api_key_id: entry.api_key_id || null,
      endpoint: entry.endpoint,
      method: entry.method,
      status_code: entry.status_code,
      response_time_ms: entry.response_time_ms,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      request_body: entry.request_body ? JSON.stringify(entry.request_body) : null,
      response_body: entry.response_body ? JSON.stringify(entry.response_body) : null,
      error_message: entry.error_message,
    });
  } catch (error) {
    console.error("Failed to log API request:", error);
  }
}

export class ApiLogger {
  private startTime: number;
  private endpoint: string;
  private method: string;
  private context?: AuthContext;
  private ipAddress?: string;
  private userAgent?: string;

  constructor(req: Request, context?: AuthContext) {
    this.startTime = Date.now();
    this.endpoint = new URL(req.url).pathname;
    this.method = req.method;
    this.context = context;
    this.ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    this.userAgent = req.headers.get("user-agent") || undefined;
  }

  async logSuccess(statusCode: number, responseBody?: any): Promise<void> {
    const responseTime = Date.now() - this.startTime;

    await logApiRequest({
      api_key_id: this.context?.apiKey.id,
      endpoint: this.endpoint,
      method: this.method,
      status_code: statusCode,
      response_time_ms: responseTime,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      response_body: responseBody,
    });
  }

  async logError(statusCode: number, errorMessage: string, requestBody?: any): Promise<void> {
    const responseTime = Date.now() - this.startTime;

    await logApiRequest({
      api_key_id: this.context?.apiKey.id,
      endpoint: this.endpoint,
      method: this.method,
      status_code: statusCode,
      response_time_ms: responseTime,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      request_body: requestBody,
      error_message: errorMessage,
    });
  }
}
