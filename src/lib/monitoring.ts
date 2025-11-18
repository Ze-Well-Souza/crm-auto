import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.MODE;

export const initMonitoring = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error monitoring disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors
      const error = hint.originalException;
      
      if (error instanceof Error) {
        // Ignore network errors that are expected
        if (error.message.includes('Failed to fetch')) {
          return null;
        }
        
        // Ignore expected auth errors
        if (error.message.includes('not authenticated')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Set user context
    beforeSendTransaction(event) {
      return event;
    },
  });
};

// Custom error logging
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, context);
  
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

// Custom event tracking
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  console.log('Event:', eventName, data);
  
  if (SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: eventName,
      data,
      level: 'info',
    });
  }
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  
  try {
    fn();
  } finally {
    const duration = performance.now() - start;
    
    if (SENTRY_DSN) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${name} took ${duration.toFixed(2)}ms`,
        level: 'info',
      });
    }
  }
};
