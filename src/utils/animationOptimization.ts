/**
 * 🚀 Advanced Animation Performance Optimization
 * Provides utilities for 60fps smooth animations
 */

// 🚀 FLIP (First, Last, Invert, Play) technique for layout animations
export class FLIPAnimation {
  private element: HTMLElement;
  private firstRect: DOMRect | null = null;
  private lastRect: DOMRect | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  // First: Capture the initial position
  first() {
    this.firstRect = this.element.getBoundingClientRect();
  }

  // Last: Capture the final position
  last() {
    this.lastRect = this.element.getBoundingClientRect();
  }

  // Invert: Calculate the transform needed
  invert() {
    if (!this.firstRect || !this.lastRect) return;

    const deltaX = this.firstRect.left - this.lastRect.left;
    const deltaY = this.firstRect.top - this.lastRect.top;
    const deltaW = this.firstRect.width / this.lastRect.width;
    const deltaH = this.firstRect.height / this.lastRect.height;

    this.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
    this.element.style.transition = 'none';
  }

  // Play: Animate to the final position
  play() {
    this.element.style.transform = '';
    this.element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
}

// 🚀 Hardware acceleration utilities
export const hardwareAcceleration = {
  // Enable hardware acceleration for an element
  enable: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
  },

  // Disable hardware acceleration
  disable: (element: HTMLElement) => {
    element.style.transform = '';
    element.style.willChange = 'auto';
  },

  // Optimize for animations
  optimizeForAnimation: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }
};

// 🚀 RequestAnimationFrame wrapper for smooth animations
export class AnimationFrame {
  private rafId: number | null = null;
  private isRunning = false;

  start(callback: (timestamp: number) => void) {
    if (this.isRunning) return;

    this.isRunning = true;
    const animate = (timestamp: number) => {
      if (!this.isRunning) return;

      callback(timestamp);
      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Batch multiple DOM updates
  batch(updates: (() => void)[]) {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }
}

// 🚀 CSS Animation optimization
export const cssAnimationOptimization = {
  // Convert JavaScript animations to CSS
  toCSSAnimation: (element: HTMLElement, properties: Record<string, string>) => {
    const keyframes = Object.entries(properties).map(([prop, value]) => `${prop}: ${value}`).join('; ');
    element.style.cssText += keyframes;
  },

  // Use transform instead of position properties
  useTransform: (element: HTMLElement, x: number, y: number) => {
    element.style.transform = `translate(${x}px, ${y}px)`;
  },

  // Optimize opacity changes
  optimizeOpacity: (element: HTMLElement) => {
    element.style.willChange = 'opacity';
    element.style.transform = 'translateZ(0)';
  },

  // Create optimized keyframes
  createOptimizedKeyframes: (name: string, keyframes: Record<string, Record<string, string>>) => {
    const style = document.createElement('style');
    const keyframeString = Object.entries(keyframes)
      .map(([percentage, properties]) => {
        const props = Object.entries(properties)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
        return `${percentage} { ${props} }`;
      })
      .join(' ');

    style.textContent = `
      @keyframes ${name} {
        ${keyframeString}
      }
    `;
    document.head.appendChild(style);
  }
};

// 🚀 SVG Animation optimization
export const svgAnimationOptimization = {
  // Convert JavaScript SVG animations to CSS
  toCSSAnimation: (svgElement: SVGElement, properties: Record<string, string>) => {
    const keyframes = Object.entries(properties).map(([prop, value]) => `${prop}: ${value}`).join('; ');
    svgElement.setAttribute('style', keyframes);
  },

  // Optimize SVG transforms
  optimizeTransform: (svgElement: SVGElement, x: number, y: number, scale: number = 1) => {
    svgElement.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);
  },

  // Use CSS transforms for SVG elements
  useCSSTransform: (svgElement: SVGElement, x: number, y: number) => {
    svgElement.style.transform = `translate(${x}px, ${y}px)`;
  }
};

// 🚀 Performance monitoring for animations
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];

  start() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
  }

  frame() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.fpsHistory.push(fps);
      
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      return fps;
    }
    
    return null;
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  isPerformanceGood(): boolean {
    return this.getAverageFPS() >= 55; // Allow some tolerance
  }
}

// 🚀 Animation throttling for performance
export class AnimationThrottler {
  private lastCall = 0;
  private timeoutId: number | null = null;

  throttle(callback: () => void, delay: number = 16) { // 60fps = ~16ms
    const now = Date.now();
    
    if (now - this.lastCall >= delay) {
      callback();
      this.lastCall = now;
    } else {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      this.timeoutId = window.setTimeout(() => {
        callback();
        this.lastCall = Date.now();
        this.timeoutId = null;
      }, delay - (now - this.lastCall));
    }
  }

  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// 🚀 Utility for checking if animations are supported
export const animationSupport = {
  // Check if CSS animations are supported
  cssAnimations: () => {
    const style = document.createElement('div').style;
    return 'animation' in style || 'WebkitAnimation' in style;
  },

  // Check if CSS transforms are supported
  cssTransforms: () => {
    const style = document.createElement('div').style;
    return 'transform' in style || 'WebkitTransform' in style;
  },

  // Check if requestAnimationFrame is supported
  requestAnimationFrame: () => {
    return 'requestAnimationFrame' in window;
  },

  // Check if Intersection Observer is supported
  intersectionObserver: () => {
    return 'IntersectionObserver' in window;
  }
};

// 🚀 Preload critical animations
export const preloadAnimations = {
  // Preload animation keyframes
  keyframes: (keyframeName: string) => {
    const style = document.createElement('style');
    style.textContent = `
      .${keyframeName} {
        animation: ${keyframeName} 0.001s;
      }
    `;
    document.head.appendChild(style);
    
    // Remove after a short delay
    setTimeout(() => {
      document.head.removeChild(style);
    }, 100);
  },

  // Preload transform animations
  transforms: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
    
    // Force a reflow
    void element.offsetHeight;
    
    // Reset
    element.style.transform = '';
    element.style.willChange = 'auto';
  }
}; 