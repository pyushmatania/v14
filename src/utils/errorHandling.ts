

// Simple error handling utility

export interface ErrorHandlerOptions {
  componentName?: string;
  fallbackValue?: any;
  logError?: boolean;
}

export class ErrorHandler {
  /**
   * Safely execute a function with error handling
   */
  static safeExecute<T>(
    fn: () => T,
    options: ErrorHandlerOptions = {}
  ): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.handleError(error, options);
      return options.fallbackValue;
    }
  }

  /**
   * Safely execute an async function with error handling
   */
  static async safeExecuteAsync<T>(
    fn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, options);
      return options.fallbackValue;
    }
  }

  /**
   * Handle errors with logging
   */
  private static handleError(error: any, options: ErrorHandlerOptions): void {
    const componentName = options.componentName || 'Unknown';
    
    if (options.logError !== false) {
      console.warn(`[${componentName}] Error handled:`, error.message);
    }
  }
}

export default ErrorHandler;
