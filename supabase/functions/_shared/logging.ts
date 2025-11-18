// Utility functions for structured logging in edge functions

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function logWithRequestId(requestId: string, message: string, data?: Record<string, unknown>): void {
  console.log(JSON.stringify({
    requestId,
    message,
    timestamp: new Date().toISOString(),
    ...data
  }));
}
