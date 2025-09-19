import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  onMetric?: (_metric: PerformanceMetrics) => void;
}

const getNow = () => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
};

const getMemoryUsage = () => {
  if (typeof performance === 'undefined' || !('memory' in performance)) {
    return 0;
  }

  const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
  if (!memory || typeof memory.usedJSHeapSize !== 'number') {
    return 0;
  }

  return Math.round(memory.usedJSHeapSize / 1024 / 1024);
};

export const usePerformanceMonitor = ({
  componentName,
  enabled = import.meta.env.DEV,
  onMetric,
}: UsePerformanceMonitorOptions) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  const measureRender = useCallback(() => {
    if (!enabled) return;

    const renderTime = getNow() - renderStartTime.current;
    const memoryUsage = getMemoryUsage();

    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage,
      componentName,
      timestamp: Date.now(),
    };

    onMetric?.(metric);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.debug(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: `${metric.memoryUsage}MB`,
        renderCount: renderCount.current,
      });
    }
  }, [componentName, enabled, onMetric]);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = getNow();
    renderCount.current += 1;

    // Measure after render
    const timeoutId = setTimeout(measureRender, 0);

    return () => clearTimeout(timeoutId);
  });

  return {
    measureRender,
    renderCount: renderCount.current,
  };
};
