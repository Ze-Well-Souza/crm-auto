// Lightweight monitoring utilities (Sentry removed for bundle optimization)
// Re-add Sentry when needed by uncommenting and configuring VITE_SENTRY_DSN

import { logger } from './logger';

export const initMonitoring = () => {
  // Monitoring initialization placeholder
  // Sentry can be re-enabled here when needed
  logger.info('Monitoring initialized (lightweight mode)');
};

// Custom error logging
export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error('Error:', error, context);
  
  // In production, you could send to an external service here
  // Example: sendToErrorService(error, context);
};

// Custom event tracking
export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  logger.info('Event:', eventName, data);
  
  // In production, you could send to analytics here
  // Example: sendToAnalytics(eventName, data);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  
  try {
    fn();
  } finally {
    const duration = performance.now() - start;
    logger.debug(`${name} took ${duration.toFixed(2)}ms`);
  }
};

// Async performance monitoring
export const measurePerformanceAsync = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    logger.debug(`${name} took ${duration.toFixed(2)}ms`);
  }
};
