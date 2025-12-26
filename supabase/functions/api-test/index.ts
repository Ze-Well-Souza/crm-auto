import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { handleCors } from "../_shared/api-cors.ts";
import { authenticateApiKey, requirePermission } from "../_shared/api-auth.ts";
import { checkRateLimit, addRateLimitHeaders } from "../_shared/api-rate-limit.ts";
import { successResponse, errorResponse } from "../_shared/api-response.ts";
import { isApiError } from "../_shared/api-errors.ts";
import { ApiLogger } from "../_shared/api-logger.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  let logger: ApiLogger;

  try {
    const context = await authenticateApiKey(req);
    logger = new ApiLogger(req, context);

    requirePermission(context, "test", "read");

    const rateLimitInfo = await checkRateLimit(context, "/api/test");

    const testData = {
      message: "API structure is working correctly!",
      user_id: context.userId,
      api_key_name: context.apiKey.name,
      permissions: context.apiKey.permissions,
      timestamp: new Date().toISOString(),
    };

    const response = successResponse(testData);
    const responseWithRateLimit = addRateLimitHeaders(response, rateLimitInfo);

    await logger.logSuccess(200, testData);

    return responseWithRateLimit;
  } catch (error) {
    const statusCode = isApiError(error) ? error.statusCode : 500;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (!logger!) {
      logger = new ApiLogger(req);
    }

    await logger.logError(statusCode, errorMessage);

    return errorResponse(error);
  }
});
