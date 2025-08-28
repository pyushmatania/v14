// 🚀 Advanced Dynamic Import Utilities for Performance Optimization

/**
 * Dynamic import with retry logic and performance monitoring
 */
export const dynamicImport = <T>(
  importFn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount: number) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          if (retryCount > 0) {
            console.warn(`Dynamic import failed, retrying... (${retryCount} attempts left)`);
            setTimeout(() => attempt(retryCount - 1), delay);
          } else {
            reject(error);
          }
        });
    };
    attempt(retries);
  });
};

/**
 * Preload component with priority
 */
export const preloadComponent = <T>(
  importFn: () => Promise<T>,
  priority: 'high' | 'medium' | 'low' = 'medium'
): void => {
  if (priority === 'high') {
    // Immediate preload
    importFn().catch(() => {});
  } else if (priority === 'medium') {
    // Preload on next tick
    setTimeout(() => importFn().catch(() => {}), 0);
  } else {
    // Preload when idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => importFn().catch(() => {}));
    } else {
      setTimeout(() => importFn().catch(() => {}), 1000);
    }
  }
};

/**
 * Batch preload multiple components
 */
export const preloadComponents = <T>(
  components: Array<() => Promise<T>>,
  batchSize = 3
): void => {
  const processBatch = (startIndex: number) => {
    const batch = components.slice(startIndex, startIndex + batchSize);
    batch.forEach(component => component().catch(() => {}));
    
    if (startIndex + batchSize < components.length) {
      setTimeout(() => processBatch(startIndex + batchSize), 100);
    }
  };
  
  processBatch(0);
};

/**
 * Conditional dynamic import based on user interaction
 */
export const conditionalImport = <T>(
  importFn: () => Promise<T>,
  condition: () => boolean,
  fallback?: T
): Promise<T> => {
  if (condition()) {
    return importFn();
  }
  return Promise.resolve(fallback as T);
};

/**
 * Dynamic import with loading state management
 */
export const createLazyComponent = <T>(
  importFn: () => Promise<T>,
  LoadingComponent?: React.ComponentType
) => {
  return React.lazy(() => 
    dynamicImport(importFn).then(module => {
      // Add performance mark for monitoring
      if (typeof performance !== 'undefined') {
        performance.mark('component-loaded');
      }
      return module;
    })
  );
};

/**
 * Preload critical components for better perceived performance
 */
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed
  const criticalComponents = [
    () => import('../components/Navigation'),
    () => import('../components/ThemeProvider'),
    () => import('../components/ErrorBoundary'),
  ];
  
  preloadComponents(criticalComponents, 2);
};

/**
 * Dynamic import with error boundary fallback
 */
export const safeDynamicImport = <T>(
  importFn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  return dynamicImport(importFn, 1).catch(() => {
    console.warn('Dynamic import failed, using fallback');
    return fallback;
  });
};



