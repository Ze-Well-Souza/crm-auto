// Sentry integration temporariamente desabilitada para estabilizar o sistema
export const initSentry = () => {
  console.log('Sentry desabilitado temporariamente')
}

export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const startTransaction = (name: string, op: string = 'default') => {
  return null
}

export const setUserContext = (user: { id: string; email?: string; name?: string }) => {
  console.log('User context:', user)
}

export const clearUserContext = () => {
  console.log('User context cleared')
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Error captured:', error, context)
}

export const captureMessage = (message: string, level: string = 'info') => {
  console.log(`[${level}] ${message}`)
}

export const addBreadcrumb = (breadcrumb: any) => {
  console.log('Breadcrumb:', breadcrumb)
}