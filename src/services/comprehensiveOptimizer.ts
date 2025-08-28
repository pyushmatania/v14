/**
 * 🚀 Comprehensive Performance Optimization Service
 * Combines all advanced optimizations for maximum performance
 */

import { microOptimizations } from '../utils/microOptimizations';
import { animationOptimizations } from '../utils/animationOptimizations';
import performanceMonitor from './performanceMonitor';
import { webVitalsOptimizer } from './webVitalsOptimizer';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export class ComprehensiveOptimizer {
  private isInitialized = false;
  private performanceMetrics: Map<string, number> = new Map();
  private optimizationCache = new Map<string, unknown>();

  // 🚀 Initialize comprehensive optimization
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.initializeMemoryOptimization();
    this.initializeAnimationOptimization();
    this.initializeWebVitalsOptimization();
    this.initializeMicroOptimizations();
    this.initializePerformanceMonitoring();

    this.isInitialized = true;
  }

  // 🚀 Initialize memory optimization
  private initializeMemoryOptimization(): void {
    try {
      // Monitor memory usage
      if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
        setInterval(() => {
          try {
            const memory = (performance as ExtendedPerformance).memory;
            if (memory) {
              const usage = memory.usedJSHeapSize / 1024 / 1024; // MB
              this.performanceMetrics.set('memory-usage', usage);
              
              // Trigger cleanup if memory usage is high
              if (usage > 50) { // 50MB threshold
                this.triggerMemoryCleanup();
              }
            }
          } catch (error) {
            console.warn('Error monitoring memory:', error);
          }
        }, 10000); // Check every 10 seconds
      }
    } catch (error) {
      console.warn('Error initializing memory optimization:', error);
    }
  }

  // 🚀 Initialize animation optimization
  private initializeAnimationOptimization(): void {
    try {
      // Preload critical animations
      const criticalAnimations = [
        'fade-in',
        'slide-up',
        'scale-in',
        'rotate-in'
      ];

      const preloader = new animationOptimizations.AnimationPreloader();
      preloader.preloadCritical(criticalAnimations);

      // Setup animation performance monitoring
      const animationMonitor = new animationOptimizations.AnimationPerformanceMonitor();
      animationMonitor.start();

      // Monitor animation performance
      setInterval(() => {
        try {
          const fps = animationMonitor.getFPS();
          this.performanceMetrics.set('animation-fps', fps);
          
          if (fps < 55) {
            this.optimizeAnimations();
          }
        } catch (error) {
          console.warn('Error monitoring animation performance:', error);
        }
      }, 5000); // Check every 5 seconds
    } catch (error) {
      console.warn('Error initializing animation optimization:', error);
    }
  }

  // 🚀 Initialize Web Vitals optimization
  private initializeWebVitalsOptimization(): void {
    // Web Vitals optimizer is automatically initialized when imported
    // Monitor Web Vitals scores
    setInterval(() => {
      const scores = webVitalsOptimizer.getWebVitalsScores();
      this.performanceMetrics.set('lcp', scores.lcp || 0);
      this.performanceMetrics.set('fid', scores.fid || 0);
      this.performanceMetrics.set('cls', scores.cls || 0);
      
      if (!webVitalsOptimizer.areWebVitalsGood()) {
        this.optimizeWebVitals();
      }
    }, 10000); // Check every 10 seconds
  }

  // 🚀 Initialize micro optimizations
  private initializeMicroOptimizations(): void {
    // Pre-warm commonly used functions
    // const memoizedFunctions = new Map();
    
    // Cache frequently used operations
    const cache = microOptimizations.cache.createLRUCache(100);
    this.optimizationCache.set('lru-cache', cache);
  }

  // 🚀 Initialize performance monitoring
  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    performanceMonitor.init();
    
    // Monitor custom metrics
    this.monitorCustomMetrics();
  }

  // 🚀 Monitor custom performance metrics
  private monitorCustomMetrics(): void {
    // Monitor DOM operations
    let domOperationCount = 0;
    const originalCreateElement = document.createElement;
    
    document.createElement = function(tagName: string) {
      domOperationCount++;
      return originalCreateElement.call(document, tagName);
    };

    setInterval(() => {
      this.performanceMetrics.set('dom-operations', domOperationCount);
      domOperationCount = 0;
    }, 5000);

    // Monitor event listener count
    setInterval(() => {
      const eventListenerCount = this.countEventListeners();
      this.performanceMetrics.set('event-listeners', eventListenerCount);
      
      if (eventListenerCount > 1000) {
        this.cleanupEventListeners();
      }
    }, 10000);
  }

  // 🚀 Count active event listeners
  private countEventListeners(): number {
    // This is a simplified count - in a real implementation,
    // you'd track event listeners more precisely
    return document.querySelectorAll('*').length * 2; // Rough estimate
  }

  // 🚀 Trigger memory cleanup
  private triggerMemoryCleanup(): void {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as { gc?: () => void }).gc?.();
    }

    // Clear caches
    this.optimizationCache.clear();
    
    // Clear performance metrics
    this.performanceMetrics.clear();
  }

  // 🚀 Optimize animations
  private optimizeAnimations(): void {
    // Reduce animation complexity
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.willChange = 'auto';
      el.style.transform = 'translateZ(0)';
    });
  }

  // 🚀 Optimize Web Vitals
  private optimizeWebVitals(): void {
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const element = img as HTMLImageElement;
      if (!element.loading) {
        element.loading = 'lazy';
      }
    });

    // Optimize fonts
    const fonts = document.querySelectorAll('link[rel="preload"][as="font"]');
    fonts.forEach(font => {
      font.setAttribute('crossorigin', 'anonymous');
    });
  }

  // 🚀 Cleanup event listeners
  private cleanupEventListeners(): void {
    // This would be implemented based on your event listener tracking system
    console.warn('High event listener count detected');
  }

  // 🚀 Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.performanceMetrics);
  }

  // 🚀 Get optimization recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics['memory-usage'] > 50) {
      recommendations.push('High memory usage detected. Consider implementing object pooling.');
    }

    if (metrics['animation-fps'] < 55) {
      recommendations.push('Low animation FPS. Consider reducing animation complexity.');
    }

    if (metrics['lcp'] > 2500) {
      recommendations.push('Slow Largest Contentful Paint. Optimize critical resources.');
    }

    if (metrics['fid'] > 100) {
      recommendations.push('High First Input Delay. Optimize JavaScript execution.');
    }

    if (metrics['cls'] > 0.1) {
      recommendations.push('High Cumulative Layout Shift. Add size attributes to images.');
    }

    return recommendations;
  }

  // 🚀 Optimize component rendering
  optimizeComponent(componentName: string): void {
    const cache = this.optimizationCache.get('lru-cache') as Map<string, { optimized: boolean; timestamp: number }> | undefined;
    if (cache) {
      // Cache component-specific optimizations
      cache.set(componentName, {
        optimized: true,
        timestamp: Date.now()
      });
    }
  }

  // 🚀 Get component optimization status
  getComponentOptimization(componentName: string): boolean {
    const cache = this.optimizationCache.get('lru-cache') as Map<string, { optimized: boolean; timestamp: number }> | undefined;
    if (cache) {
      const optimization = cache.get(componentName);
      return optimization?.optimized || false;
    }
    return false;
  }

  // 🚀 Dispose of optimizer
  dispose(): void {
    this.isInitialized = false;
    this.performanceMetrics.clear();
    this.optimizationCache.clear();
  }
}

// 🚀 Create singleton instance
export const comprehensiveOptimizer = new ComprehensiveOptimizer();

// 🚀 Auto-initialize on import
if (typeof window !== 'undefined') {
  comprehensiveOptimizer.init();
}

export default comprehensiveOptimizer; 