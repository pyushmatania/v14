import * as Sentry from '@sentry/react';

// REMOVED: Unused exports (initSentry, SentryErrorBoundary, SentryProfiler)

// Custom error reporting
export function reportError(error: Error, context?: Record<string, unknown>) {
  if (import.meta.env.PROD && import.meta.env['VITE_SENTRY_DSN']) {
    try {
      Sentry.captureException(error, {
        extra: context || {},
      });
    } catch (sentryError) {
      console.error('Failed to report error to Sentry:', sentryError);
      console.error('Original error:', error, context);
    }
  } else {
    console.error('Error reported to Sentry:', error, context);
  }
}

// REMOVED: Unused exports (setUserContext, clearUserContext) 