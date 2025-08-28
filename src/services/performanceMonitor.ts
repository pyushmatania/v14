// 🛡️ Type definitions for better type safety
interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fmp: number | null;
}

interface PerformanceEvent {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

interface GtagWindow extends Window {
  gtag: (...args: unknown[]) => void;
}

interface SentryWindow extends Window {
  Sentry?: {
    addBreadcrumb: (breadcrumb: {
      category: string;
      message: string;
      data?: Record<string, unknown>;
      level: string;
    }) => void;
  };
}

/**
 * 🎯 PerformanceMonitor - Comprehensive performance monitoring service
 * @description Tracks Core Web Vitals, custom metrics, and provides performance insights
 */
class PerformanceMonitor {
  private events: PerformanceEvent[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isInitialized = false;

  // 🚀 Initialize performance monitoring
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.setupCoreWebVitals();
    this.setupCustomMetrics();
    this.setupErrorTracking();
    this.setupMemoryMonitoring();

    this.isInitialized = true;
  }

  // 🚀 Setup Core Web Vitals tracking
  private setupCoreWebVitals(): void {
    if (!('PerformanceObserver' in window)) return;

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        if (fcp) {
          this.recordMetric('fcp', fcp.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', fcpObserver);
    } catch (error) {
      console.warn('FCP observer setup failed:', error);
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        if (lcp) {
          this.recordMetric('lcp', lcp.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      console.warn('LCP observer setup failed:', error);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if ('processingStart' in entry) {
            this.recordMetric('fid', (entry as any).processingStart - entry.startTime);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      console.warn('FID observer setup failed:', error);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && 'hadRecentInput' in entry && 'value' in entry) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
        });
        this.recordMetric('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      console.warn('CLS observer setup failed:', error);
    }
  }

  // 🚀 Setup custom performance metrics
  private setupCustomMetrics(): void {
    // Time to First Byte (TTFB)
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('ttfb', navigation.responseStart - navigation.requestStart);
      }
    }

    // First Meaningful Paint (FMP) approximation
    this.measureFirstMeaningfulPaint();
  }

  // 🚀 Measure First Meaningful Paint
  private measureFirstMeaningfulPaint(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const paintEntries = entries.filter(entry => entry.name === 'first-paint');
      if (paintEntries.length > 0) {
        this.recordMetric('fmp', paintEntries[0].startTime);
      }
    });
    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('fmp', observer);
  }

  // 🚀 Setup error tracking
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.recordMetric('error', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('unhandled-rejection', 1, {
        reason: event.reason
      });
    });
  }

  // 🚀 Setup memory monitoring
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as ExtendedPerformance).memory;
        if (memory) {
          this.recordMetric('memory-used', memory.usedJSHeapSize / 1024 / 1024);
          this.recordMetric('memory-total', memory.totalJSHeapSize / 1024 / 1024);
          this.recordMetric('memory-limit', memory.jsHeapSizeLimit / 1024 / 1024);
        }
      }, 5000); // Check every 5 seconds
    }
  }

  // 🚀 Record a performance metric
  recordMetric(name: string, value: number, metadata?: Record<string, unknown>): void {
    const event: PerformanceEvent = {
      name,
      value,
      timestamp: performance.now(),
      metadata
    };

    this.events.push(event);

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }

    // Send to analytics if available
    this.sendToAnalytics(event);
  }

  // 🚀 Send performance data to analytics
  private sendToAnalytics(event: PerformanceEvent): void {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as GtagWindow).gtag) {
      (window as GtagWindow).gtag!('event', 'performance_metric', {
        metric_name: event.name,
        metric_value: event.value,
        timestamp: event.timestamp,
        ...event.metadata
      });
    }

    // Send to Sentry if available
    if (typeof window !== 'undefined' && (window as SentryWindow).Sentry) {
      (window as SentryWindow).Sentry!.addBreadcrumb({
        category: 'performance',
        message: `${event.name}: ${event.value}`,
        data: event.metadata,
        level: 'info'
      });
    }
  }

  // 🚀 Get current performance metrics
  getMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null
    };

    this.events.forEach(event => {
      if (event.name in metrics) {
        (metrics as any)[event.name] = event.value;
      }
    });

    return metrics;
  }

  // 🚀 Get performance score based on Core Web Vitals
  getPerformanceScore(): number {
    const metrics = this.getMetrics();
    let score = 100;

    // FCP scoring (0-2s = good, 2-4s = needs improvement, >4s = poor)
    if (metrics.fcp) {
      if (metrics.fcp > 4000) score -= 30;
      else if (metrics.fcp > 2000) score -= 15;
    }

    // LCP scoring (0-2.5s = good, 2.5-4s = needs improvement, >4s = poor)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 30;
      else if (metrics.lcp > 2500) score -= 15;
    }

    // FID scoring (0-100ms = good, 100-300ms = needs improvement, >300ms = poor)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 20;
      else if (metrics.fid > 100) score -= 10;
    }

    // CLS scoring (0-0.1 = good, 0.1-0.25 = needs improvement, >0.25 = poor)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 20;
      else if (metrics.cls > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }

  // 🚀 Get performance insights
  getInsights(): string[] {
    const insights: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.fcp && metrics.fcp > 2000) {
      insights.push('First Contentful Paint is slow. Consider optimizing critical resources.');
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      insights.push('Largest Contentful Paint is slow. Optimize images and reduce render-blocking resources.');
    }

    if (metrics.fid && metrics.fid > 100) {
      insights.push('First Input Delay is high. Consider reducing JavaScript execution time.');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      insights.push('Cumulative Layout Shift is high. Ensure stable layout and proper image dimensions.');
    }

    return insights;
  }

  // 🚀 Measure custom performance mark
  mark(name: string): void {
    if ('performance' in window) {
      performance.mark(name);
    }
  }

  // 🚀 Measure custom performance measure
  measure(name: string, startMark: string, endMark: string): void {
    if ('performance' in window) {
      try {
        const measure = performance.measure(name, startMark, endMark);
        this.recordMetric(name, measure.duration);
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
  }

  // 🚀 Get all performance events
  getEvents(): PerformanceEvent[] {
    return [...this.events];
  }

  // 🚀 Clear all performance data
  clear(): void {
    this.events = [];
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // 🚀 Dispose of performance monitoring
  dispose(): void {
    this.clear();
    this.isInitialized = false;
  }
}

// 🚀 Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor; 