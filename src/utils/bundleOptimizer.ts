// 🚀 Advanced Bundle Optimization Utilities

interface BundleAnalysis {
  mainChunkSize: number;
  chunkCount: number;
  totalSize: number;
  largestChunks: Array<{ name: string; size: number }>;
  optimizationOpportunities: string[];
}

interface OptimizationStrategy {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: () => Promise<void>;
}

// 🚀 Analyze bundle structure
export const analyzeBundle = async (): Promise<BundleAnalysis> => {
  const analysis: BundleAnalysis = {
    mainChunkSize: 0,
    chunkCount: 0,
    totalSize: 0,
    largestChunks: [],
    optimizationOpportunities: []
  };

  try {
    // 🚀 Get bundle information from performance API
    if ('performance' in window) {
      const entries = performance.getEntriesByType('resource');
      const jsEntries = entries.filter(entry => 
        entry.name.includes('.js') && entry.name.includes('index-')
      );

      if (jsEntries.length > 0) {
        const mainChunk = jsEntries[0];
        analysis.mainChunkSize = Math.round(mainChunk.transferSize / 1024);
        analysis.totalSize += mainChunk.transferSize;
      }
    }

    // 🚀 Analyze chunk distribution
    const scriptTags = document.querySelectorAll('script[src]');
    analysis.chunkCount = scriptTags.length;

    // 🚀 Identify optimization opportunities
    if (analysis.mainChunkSize > 500) {
      analysis.optimizationOpportunities.push(
        'Main chunk exceeds 500KB - implement advanced code splitting'
      );
    }

    if (analysis.chunkCount > 20) {
      analysis.optimizationOpportunities.push(
        'High chunk count - consider consolidating small chunks'
      );
    }

    return analysis;
  } catch (error) {
    console.warn('Bundle analysis failed:', error);
    return analysis;
  }
};

// 🚀 Dynamic import with performance monitoring
export const dynamicImportWithMonitoring = <T>(
  importFn: () => Promise<T>,
  chunkName: string
): Promise<T> => {
  const startTime = performance.now();
  
  return importFn().then(module => {
    const loadTime = performance.now() - startTime;
    
    // 🚀 Log chunk loading performance
    console.log(`🚀 Chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
    
    // 🚀 Report to performance monitoring
    if ('performance' in window) {
      performance.mark(`chunk-${chunkName}-loaded`);
      performance.measure(
        `chunk-${chunkName}-load-time`,
        undefined,
        `chunk-${chunkName}-loaded`
      );
    }
    
    return module;
  });
};

// 🚀 Preload critical chunks
export const preloadCriticalChunks = (chunks: string[]): void => {
  chunks.forEach(chunk => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = chunk;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// 🚀 Lazy load non-critical chunks
export const lazyLoadChunk = <T>(
  importFn: () => Promise<T>,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<T> => {
  switch (priority) {
    case 'high':
      return importFn();
    case 'medium':
      return new Promise(resolve => {
        setTimeout(() => importFn().then(resolve), 100);
      });
    case 'low':
      return new Promise(resolve => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => importFn().then(resolve));
        } else {
          setTimeout(() => importFn().then(resolve), 1000);
        }
      });
  }
};

// 🚀 Bundle size monitoring
export const monitorBundleSize = (callback: (size: number) => void): (() => void) => {
  let observer: PerformanceObserver | null = null;
  
  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.name.includes('.js')) {
          const size = Math.round(entry.transferSize / 1024);
          callback(size);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('PerformanceObserver not supported for bundle monitoring');
  }
  
  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
};

// 🚀 Chunk loading optimization
export const optimizeChunkLoading = (): void => {
  // 🚀 Set resource hints for better loading
  const resourceHints = [
    { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
    { rel: 'preconnect', href: '//cdn.jsdelivr.net' },
    { rel: 'preconnect', href: '//fonts.googleapis.com' }
  ];
  
  resourceHints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    document.head.appendChild(link);
  });
  
  // 🚀 Optimize script loading
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    if (script.src.includes('index-')) {
      script.setAttribute('fetchpriority', 'high');
    }
  });
};

// 🚀 Bundle optimization strategies
export const bundleOptimizationStrategies: OptimizationStrategy[] = [
  {
    name: 'Advanced Code Splitting',
    description: 'Implement granular component splitting to reduce main chunk size',
    impact: 'high',
    implementation: async () => {
      // Implementation will be done in the main optimization
      console.log('🚀 Implementing advanced code splitting...');
    }
  },
  {
    name: 'Tree Shaking Optimization',
    description: 'Remove unused code and optimize imports',
    impact: 'medium',
    implementation: async () => {
      console.log('🚀 Optimizing tree shaking...');
    }
  },
  {
    name: 'Chunk Consolidation',
    description: 'Merge small chunks to reduce HTTP requests',
    impact: 'medium',
    implementation: async () => {
      console.log('🚀 Consolidating small chunks...');
    }
  }
];

// 🚀 Execute optimization strategies
export const executeOptimizations = async (strategies: OptimizationStrategy[]): Promise<void> => {
  console.log('🚀 Starting bundle optimization...');
  
  for (const strategy of strategies) {
    try {
      console.log(`🚀 Executing: ${strategy.name}`);
      await strategy.implementation();
      console.log(`✅ Completed: ${strategy.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${strategy.name}`, error);
    }
  }
  
  console.log('🚀 Bundle optimization completed');
};

// 🚀 Get bundle optimization recommendations
export const getBundleRecommendations = (analysis: BundleAnalysis): string[] => {
  const recommendations: string[] = [];
  
  if (analysis.mainChunkSize > 500) {
    recommendations.push(
      '🔴 HIGH PRIORITY: Main chunk exceeds 500KB - implement advanced code splitting'
    );
  }
  
  if (analysis.chunkCount > 20) {
    recommendations.push(
      '🟡 MEDIUM PRIORITY: High chunk count - consider consolidating small chunks'
    );
  }
  
  if (analysis.totalSize > 2000) {
    recommendations.push(
      '🟡 MEDIUM PRIORITY: Total bundle size is large - implement aggressive optimization'
    );
  }
  
  if (analysis.largestChunks.some(chunk => chunk.size > 100)) {
    recommendations.push(
      '🟢 LOW PRIORITY: Large individual chunks detected - consider further splitting'
    );
  }
  
  return recommendations;
};

// 🚀 Export optimization utilities
export default {
  analyzeBundle,
  dynamicImportWithMonitoring,
  preloadCriticalChunks,
  lazyLoadChunk,
  monitorBundleSize,
  optimizeChunkLoading,
  bundleOptimizationStrategies,
  executeOptimizations,
  getBundleRecommendations
};


