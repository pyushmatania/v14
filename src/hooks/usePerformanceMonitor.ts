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
  onMetric?: (metric: PerformanceMetrics) => void;
}

export const usePerformanceMonitor = ({
  componentName,
  enabled = import.meta.env.DEV,
  onMetric,
}: UsePerformanceMonitorOptions) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  const measureRender = useCallback(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;
    const memoryUsage = 'memory' in performance 
      ? (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      : 0;

    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage: Math.round(memoryUsage / 1024 / 1024), // Convert to MB
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

    renderStartTime.current = performance.now();
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
