export interface LogData {
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  requestId?: string
  userId?: string
  timestamp: string
  service: string
  environment: string
  [key: string]: unknown
}

export class Logger {
  private service: string
  private requestId: string
  private userId?: string

  constructor(service: string, requestId: string, userId?: string) {
    this.service = service
    this.requestId = requestId
    this.userId = userId
  }

  private log(level: LogData['level'], message: string, data?: Record<string, unknown>) {
    const logEntry: LogData = {
      level,
      message,
      requestId: this.requestId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      service: this.service,
      environment: Deno.env.get('ENVIRONMENT') || 'production',
      ...data
    }

    // In production, you might want to send this to a logging service
    console.log(JSON.stringify(logEntry))
  }

  error(message: string, data?: Record<string, unknown>) {
    this.log('error', message, data)
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data)
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data)
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', message, data)
  }
}

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}