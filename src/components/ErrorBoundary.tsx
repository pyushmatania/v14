import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  maxRetries: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void; // eslint-disable-line no-unused-vars
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  showErrorDetails?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      maxRetries: props.maxRetries || 3,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 🚀 Generate unique error ID for tracking
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 🚀 Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true,
      retryCount: this.state.retryCount + 1
    });

    // 🚀 Call custom error handler
    this.props.onError?.(error, errorInfo);

    // 🚀 Report to error monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // 🚀 Reset error state when props change (if enabled)
    if (this.props.resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError();
    }
  }

  // 🚀 Report error to monitoring service
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 🚀 Send to analytics/monitoring service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: true,
          error_id: this.state.errorId
        });
      }

      // 🚀 Send to console for debugging
      console.group(`🚨 Error Report - ${this.state.errorId}`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', this.state.errorId);
      console.error('Retry Count:', this.state.retryCount);
      console.groupEnd();
    } catch (reportingError) {
      console.warn('Failed to report error:', reportingError);
    }
  };

  // 🚀 Reset error state
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    });
  };

  // 🚀 Retry rendering
  private handleRetry = () => {
    if (this.state.retryCount < (this.props.maxRetries || 3)) {
      this.resetError();
    } else {
      // 🚀 Force page reload after max retries
      window.location.reload();
    }
  };

  // 🚀 Generate accessible error message
  private getAccessibleErrorMessage = (): string => {
    const { error, retryCount, maxRetries = 3 } = this.state;
    
    if (!error) return 'An unknown error occurred';
    
    let message = `Error: ${error.message}`;
    
    if (retryCount > 0) {
      message += `. This is attempt ${retryCount + 1} of ${maxRetries + 1}`;
    }
    
    if (retryCount >= maxRetries) {
      message += '. Maximum retry attempts reached. Page will reload.';
    }
    
    return message;
  };

  override render() {
    if (this.state.hasError) {
      // 🚀 Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 🚀 Default error UI with accessibility
      return (
        <div 
          className="error-boundary-fallback bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 m-4"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start space-x-3">
            {/* 🚀 Error Icon */}
            <div className="flex-shrink-0">
              <svg 
                className="h-6 w-6 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>

            {/* 🚀 Error Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Something went wrong
              </h3>
              
              {/* 🚀 Accessible error message */}
              <p className="text-sm text-red-700 dark:text-red-300 mb-4" id="error-message">
                {this.getAccessibleErrorMessage()}
              </p>

              {/* 🚀 Error Details (collapsible) */}
              {this.props.showErrorDetails && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200">
                    Show error details
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                    <pre className="text-xs text-red-800 dark:text-red-200 overflow-auto">
                      <code>
                        {this.state.error.stack}
                      </code>
                    </pre>
                  </div>
                </details>
              )}

              {/* 🚀 Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/20"
                  aria-describedby="error-message"
                >
                  {this.state.retryCount >= (this.props.maxRetries || 3) ? 'Reload Page' : 'Try Again'}
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900/20"
                >
                  Go Back
                </button>
              </div>

              {/* 🚀 Error ID for support */}
              <div className="mt-4 text-xs text-red-600 dark:text-red-400">
                Error ID: <code className="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">{this.state.errorId}</code>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 