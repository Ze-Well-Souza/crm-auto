export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  EXPIRED_KEY: "EXPIRED_KEY",
  INVALID_KEY: "INVALID_KEY",
} as const;

export function createError(
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): ApiError {
  return new ApiError(statusCode, message, code, details);
}

export const CommonErrors = {
  unauthorized: (message = "Unauthorized access") =>
    createError(401, message, ErrorCodes.UNAUTHORIZED),

  forbidden: (message = "Access forbidden") =>
    createError(403, message, ErrorCodes.FORBIDDEN),

  notFound: (resource = "Resource", id?: string) =>
    createError(
      404,
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      ErrorCodes.NOT_FOUND
    ),

  validation: (message: string, details?: any) =>
    createError(400, message, ErrorCodes.VALIDATION_ERROR, details),

  rateLimit: (resetTime?: Date) =>
    createError(
      429,
      "Rate limit exceeded",
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      resetTime ? { resetAt: resetTime.toISOString() } : undefined
    ),

  internal: (message = "Internal server error") =>
    createError(500, message, ErrorCodes.INTERNAL_ERROR),

  badRequest: (message: string) =>
    createError(400, message, ErrorCodes.BAD_REQUEST),

  conflict: (message: string) =>
    createError(409, message, ErrorCodes.CONFLICT),

  expiredKey: () =>
    createError(401, "API key has expired", ErrorCodes.EXPIRED_KEY),

  invalidKey: () =>
    createError(401, "Invalid API key", ErrorCodes.INVALID_KEY),
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
