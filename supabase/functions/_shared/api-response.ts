import { corsHeaders } from "./api-cors.ts";
import { ApiError, isApiError } from "./api-errors.ts";

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data: T,
  meta?: ApiSuccessResponse["meta"],
  statusCode = 200
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(
  error: ApiError | Error | unknown,
  statusCode?: number
): Response {
  let finalStatusCode = statusCode || 500;
  let code = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: any = undefined;

  if (isApiError(error)) {
    finalStatusCode = error.statusCode;
    code = error.code || "UNKNOWN_ERROR";
    message = error.message;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status: finalStatusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode = 200
): Response {
  return successResponse(
    data,
    {
      page,
      limit,
      total,
    },
    statusCode
  );
}

export function createdResponse<T>(data: T): Response {
  return successResponse(data, undefined, 201);
}

export function noContentResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
