import * as Sentry from '@sentry/react';

// Initialize Sentry
export function initSentry() {
  // Only initialize Sentry in production and if DSN is configured
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        // Performance Monitoring
        tracesSampleRate: 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // Environment
        environment: import.meta.env.MODE,
        // Release tracking
        release: import.meta.env.VITE_APP_VERSION || '1.0.0',
        // Debug mode in development
        debug: import.meta.env.DEV,
      });
    } catch (error) {
      console.warn('Failed to initialize Sentry:', error);
    }
  }
}

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Performance monitoring
export const SentryProfiler = Sentry.Profiler;

// Custom error reporting
export function reportError(error: Error, context?: Record<string, unknown>) {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.captureException(error, {
        extra: context,
      });
    } catch (sentryError) {
      console.error('Failed to report error to Sentry:', sentryError);
      console.error('Original error:', error, context);
    }
  } else {
    console.error('Error reported to Sentry:', error, context);
  }
}

// User context
export function setUserContext(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

// Clear user context
export function clearUserContext() {
  Sentry.setUser(null);
} 