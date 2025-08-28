/**
 * 🚀 Web Vitals Optimization Service
 * Optimizes Core Web Vitals (LCP, FID, CLS) for better performance scores
 */

import performanceMonitor from './performanceMonitor';

export class WebVitalsOptimizer {
  private lcpObserver: PerformanceObserver | null = null;
  private fidObserver: PerformanceObserver | null = null;
  private clsObserver: PerformanceObserver | null = null;
  private layoutShiftObserver: PerformanceObserver | null = null;

  constructor() {
    this.initializeObservers();
    this.optimizeLCP();
    this.optimizeFID();
    this.optimizeCLS();
  }

  // 🚀 Initialize Performance Observers
  private initializeObservers() {
    if ('PerformanceObserver' in window) {
      // LCP Observer
      this.lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          performanceMonitor.recordMetric('lcp', lastEntry.startTime);
        }
      });
      this.lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      this.fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if ('processingStart' in entry) {
            performanceMonitor.recordMetric('fid', (entry as any).processingStart - entry.startTime);
          }
        });
      });
      this.fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS Observer
      this.clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
                  if (entry.entryType === 'layout-shift' && 'hadRecentInput' in entry && 'value' in entry) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        });
        performanceMonitor.recordMetric('cls', clsValue);
      });
      this.clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // 🚀 LCP (Largest Contentful Paint) Optimization
  private optimizeLCP() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize hero images
    this.optimizeHeroImages();
    
    // Remove render-blocking resources
    this.removeRenderBlockingResources();
    
    // Inline critical CSS
    this.inlineCriticalCSS();
  }

  // 🚀 Preload critical resources
  private preloadCriticalResources() {
    // Avoid noisy preloads in development to prevent console warnings
    if (import.meta.env.DEV) return;
    const criticalResources = ['/assets/images/circles-logo-main.png', '/assets/css/index.css'];
    for (const resource of criticalResources) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = this.getResourceType(resource);
      link.href = resource;
      document.head.appendChild(link);
    }
  }

  // 🚀 Get resource type for preloading
  private getResourceType(url: string): string {
    if (url.endsWith('.css')) return 'style';
    if (url.endsWith('.js')) return 'script';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.endsWith('.woff2') || url.endsWith('.woff')) return 'font';
    return 'fetch';
  }

  // 🚀 Optimize hero images
  private optimizeHeroImages() {
    const heroImages = document.querySelectorAll('img[data-hero]');
    heroImages.forEach(img => {
      const element = img as HTMLImageElement;
      
      // Add loading="eager" for hero images
      element.loading = 'eager';
      
      // Add fetchpriority="high"
      element.setAttribute('fetchpriority', 'high');
      
      // Preload if not already loaded
      if (!element.complete) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = element.src;
        document.head.appendChild(link);
      }
    });
  }

  // 🚀 Remove render-blocking resources
  private removeRenderBlockingResources() {
    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-non-critical]');
    nonCriticalCSS.forEach(link => {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'");
    });

    // Defer non-critical JavaScript
    const nonCriticalJS = document.querySelectorAll('script[data-non-critical]');
    nonCriticalJS.forEach(script => {
      script.setAttribute('defer', '');
    });
  }

  // 🚀 Inline critical CSS
  private inlineCriticalCSS() {
    // This would typically be done at build time
    // For runtime, we can add critical styles inline
    const criticalStyles = `
      /* Critical CSS for above-the-fold content */
      .hero-section { display: block; }
      .main-navigation { position: fixed; }
      .loading-spinner { display: none; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalStyles;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // 🚀 FID (First Input Delay) Optimization
  private optimizeFID() {
    // Break up long JavaScript tasks
    this.breakUpLongTasks();
    
    // Defer non-critical JavaScript
    this.deferNonCriticalJavaScript();
    
    // Optimize event handlers
    this.optimizeEventHandlers();
  }

  // 🚀 Break up long JavaScript tasks
  private breakUpLongTasks() {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      const nonCriticalTasks = [
        () => this.initializeAnalytics(),
        () => this.loadNonCriticalImages(),
        () => this.setupBackgroundFeatures()
      ];

      nonCriticalTasks.forEach(task => {
        requestIdleCallback(task, { timeout: 2000 });
      });
    }
  }

  // 🚀 Defer non-critical JavaScript
  private deferNonCriticalJavaScript() {
    // Move non-critical scripts to end of body
    const nonCriticalScripts = document.querySelectorAll('script[data-non-critical]');
    nonCriticalScripts.forEach(script => {
      if (document.body) {
        document.body.appendChild(script);
      }
    });
  }

  // 🚀 Optimize event handlers
  private optimizeEventHandlers() {
    // Use passive event listeners for scroll events
    const scrollElements = document.querySelectorAll('[data-scroll-optimized]');
    scrollElements.forEach(element => {
      element.addEventListener('scroll', () => {}, { passive: true });
    });

    // Debounce input events
    const inputElements = document.querySelectorAll('input, textarea');
    inputElements.forEach(element => {
      let timeout: number;
      element.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          // Handle input
        }, 100);
      });
    });
  }

  // 🚀 CLS (Cumulative Layout Shift) Optimization
  private optimizeCLS() {
    // Add size attributes to images
    this.addSizeAttributes();
    
    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent();
    
    // Avoid inserting content above existing content
    this.preventLayoutShifts();
  }

  // 🚀 Add size attributes to images
  private addSizeAttributes() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      const element = img as HTMLImageElement;
      
      // Set default dimensions if not specified
      if (!element.width && !element.height) {
        element.width = 300;
        element.height = 200;
        element.style.aspectRatio = '3/2';
      }
      
      // Add loading="lazy" for images below the fold
      if (!element.hasAttribute('loading')) {
        element.loading = 'lazy';
      }
    });
  }

  // 🚀 Reserve space for dynamic content
  private reserveSpaceForDynamicContent() {
    // Reserve space for ads, embeds, etc.
    const dynamicContent = document.querySelectorAll('[data-dynamic-content]');
    dynamicContent.forEach(element => {
      const el = element as HTMLElement;
      el.style.minHeight = '200px';
      el.style.minWidth = '300px';
    });
  }

  // 🚀 Prevent layout shifts
  private preventLayoutShifts() {
    // Use transform instead of changing position properties
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.transform = 'translateZ(0)';
      el.style.willChange = 'transform';
    });
  }

  // 🚀 Initialize non-critical features
  private initializeAnalytics() {
    // Initialize analytics after page load
    if (window.gtag) {
      window.gtag('config', 'G-SBWLVKVMCN', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  // 🚀 Load non-critical images
  private loadNonCriticalImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // 🚀 Setup background features
  private setupBackgroundFeatures() {
    // Initialize background features like service workers, etc.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }

  // 🚀 Get current Web Vitals scores
  public getWebVitalsScores() {
    const metrics = performanceMonitor.getMetrics();
    return {
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      fcp: metrics.fcp,
      ttfb: metrics.ttfb
    };
  }

  // 🚀 Check if Web Vitals are good
  public areWebVitalsGood(): boolean {
    const scores = this.getWebVitalsScores();
    
    return (
      (scores.lcp || 0) < 2500 && // LCP < 2.5s
      (scores.fid || 0) < 100 &&  // FID < 100ms
      (scores.cls || 0) < 0.1     // CLS < 0.1
    );
  }

  // 🚀 Cleanup observers
  public destroy() {
    if (this.lcpObserver) {
      this.lcpObserver.disconnect();
    }
    if (this.fidObserver) {
      this.fidObserver.disconnect();
    }
    if (this.clsObserver) {
      this.clsObserver.disconnect();
    }
    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect();
    }
  }
}

// 🚀 Initialize Web Vitals Optimizer
export const webVitalsOptimizer = new WebVitalsOptimizer();

// 🚀 Export for use in components
export default webVitalsOptimizer; 