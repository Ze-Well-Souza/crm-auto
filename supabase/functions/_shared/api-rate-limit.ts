import { createClient } from "npm:@supabase/supabase-js@2";
import { CommonErrors } from "./api-errors.ts";
import type { AuthContext } from "./api-auth.ts";

interface RateLimitInfo {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  context: AuthContext,
  endpoint: string
): Promise<RateLimitInfo> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    throw CommonErrors.internal("Supabase configuration missing");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const minuteCheck = await checkWindowLimit(
    supabase,
    context.apiKey.id,
    endpoint,
    "minute",
    context.apiKey.rate_limit_per_minute
  );

  if (!minuteCheck.allowed) {
    throw CommonErrors.rateLimit(minuteCheck.resetAt);
  }

  const dayCheck = await checkWindowLimit(
    supabase,
    context.apiKey.id,
    endpoint,
    "day",
    context.apiKey.rate_limit_per_day
  );

  if (!dayCheck.allowed) {
    throw CommonErrors.rateLimit(dayCheck.resetAt);
  }

  return minuteCheck;
}

async function checkWindowLimit(
  supabase: any,
  apiKeyId: string,
  endpoint: string,
  windowType: "minute" | "day",
  limit: number
): Promise<RateLimitInfo> {
  const now = new Date();
  const windowStart = getWindowStart(now, windowType);
  const resetAt = getWindowEnd(now, windowType);

  const { data: existingRecord, error: fetchError } = await supabase
    .from("crm_api_rate_limits")
    .select("request_count")
    .eq("api_key_id", apiKeyId)
    .eq("endpoint", endpoint)
    .eq("window_start", windowStart.toISOString())
    .eq("window_type", windowType)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Rate limit check error:", fetchError);
    throw CommonErrors.internal("Failed to check rate limit");
  }

  const currentCount = existingRecord?.request_count || 0;
  const remaining = Math.max(0, limit - currentCount - 1);
  const allowed = currentCount < limit;

  if (allowed) {
    if (existingRecord) {
      await supabase
        .from("crm_api_rate_limits")
        .update({
          request_count: currentCount + 1,
        })
        .eq("api_key_id", apiKeyId)
        .eq("endpoint", endpoint)
        .eq("window_start", windowStart.toISOString())
        .eq("window_type", windowType);
    } else {
      await supabase.from("crm_api_rate_limits").insert({
        api_key_id: apiKeyId,
        endpoint,
        window_start: windowStart.toISOString(),
        window_type: windowType,
        request_count: 1,
      });
    }
  }

  return {
    allowed,
    limit,
    remaining,
    resetAt,
  };
}

function getWindowStart(date: Date, windowType: "minute" | "day"): Date {
  const windowStart = new Date(date);

  if (windowType === "minute") {
    windowStart.setSeconds(0, 0);
  } else if (windowType === "day") {
    windowStart.setHours(0, 0, 0, 0);
  }

  return windowStart;
}

function getWindowEnd(date: Date, windowType: "minute" | "day"): Date {
  const windowEnd = new Date(date);

  if (windowType === "minute") {
    windowEnd.setSeconds(59, 999);
  } else if (windowType === "day") {
    windowEnd.setHours(23, 59, 59, 999);
  }

  return windowEnd;
}

export function addRateLimitHeaders(
  response: Response,
  rateLimitInfo: RateLimitInfo
): Response {
  const headers = new Headers(response.headers);
  headers.set("X-RateLimit-Limit", rateLimitInfo.limit.toString());
  headers.set("X-RateLimit-Remaining", rateLimitInfo.remaining.toString());
  headers.set(
    "X-RateLimit-Reset",
    Math.floor(rateLimitInfo.resetAt.getTime() / 1000).toString()
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
