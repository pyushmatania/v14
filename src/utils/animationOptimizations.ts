/**
 * 🚀 Animation Performance Optimization Utilities
 * Provides FLIP technique, hardware acceleration, and performance monitoring
 */

// 🚀 FLIP Animation Technique
export class FLIPAnimation {
  private element: HTMLElement;
  private firstRect: DOMRect | null = null;
  private lastRect: DOMRect | null = null;
  private invertTransform: string = '';

  constructor(element: HTMLElement) {
    this.element = element;
  }

  // 🚀 Capture initial position
  first(): void {
    this.firstRect = this.element.getBoundingClientRect();
  }

  // 🚀 Capture final position
  last(): void {
    this.lastRect = this.element.getBoundingClientRect();
  }

  // 🚀 Calculate transform to invert the change
  invert(): void {
    if (!this.firstRect || !this.lastRect) {
      throw new Error('Must call first() and last() before invert()');
    }

    const deltaX = this.firstRect.left - this.lastRect.left;
    const deltaY = this.firstRect.top - this.lastRect.top;
    const deltaW = this.firstRect.width / this.lastRect.width;
    const deltaH = this.firstRect.height / this.lastRect.height;

    this.invertTransform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
  }

  // 🚀 Animate to final position
  play(): void {
    if (!this.invertTransform) {
      throw new Error('Must call invert() before play()');
    }

    // Apply the inverted transform
    this.element.style.transform = this.invertTransform;
    this.element.style.transition = 'none';

    // Force a reflow
    void this.element.offsetHeight;

    // Animate to the final position
    this.element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    this.element.style.transform = 'none';
  }

  // 🚀 Complete FLIP animation
  animate(): void {
    this.first();
    // DOM changes happen here
    this.last();
    this.invert();
    this.play();
  }
}

// 🚀 Hardware Acceleration Utilities
export const hardwareAcceleration = {
  // Enable GPU acceleration
  enable: (element: HTMLElement): void => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  },

  // Disable GPU acceleration
  disable: (element: HTMLElement): void => {
    element.style.transform = '';
    element.style.willChange = 'auto';
  },

  // Check if hardware acceleration is supported
  isSupported: (): boolean => {
    return 'transform' in document.documentElement.style;
  },

  // Optimize for animations
  optimizeForAnimation: (element: HTMLElement): void => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }
};

// 🚀 RequestAnimationFrame Wrapper
export class AnimationFrameManager {
  private animationId: number | null = null;
  private isRunning = false;

  start(callback: (timestamp: number) => void): void {
    if (this.isRunning) return;

    this.isRunning = true;
    const animate = (timestamp: number) => {
      if (!this.isRunning) return;

      callback(timestamp);
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

// 🚀 Animation Performance Monitor
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private frameTimes: number[] = [];
  private maxFrameTimes = 60;

  start(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frameTimes = [];
  }

  update(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    this.frameTimes.push(deltaTime);
    
    if (this.frameTimes.length > this.maxFrameTimes) {
      this.frameTimes.shift();
    }
    
    this.lastTime = currentTime;
    
    // Calculate FPS
    if (this.frameTimes.length > 0) {
      const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.fps = 1000 / averageFrameTime;
    }
  }

  getFPS(): number {
    return Math.round(this.fps);
  }

  isSmooth(): boolean {
    return this.fps >= 55;
  }

  getFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes[this.frameTimes.length - 1];
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }
}

// 🚀 CSS Animation Optimization
export const cssAnimationOptimization = {
  // Convert JS animation to CSS
  toCSS: (element: HTMLElement, properties: Record<string, string>, duration: number = 300): void => {
    const style = element.style;
    const transition = Object.keys(properties)
      .map(prop => `${prop} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`)
      .join(', ');
    
    style.transition = transition;
    
    // Apply properties
    Object.entries(properties).forEach(([prop, value]) => {
      (style as CSSStyleDeclaration & Record<string, string>)[prop] = value;
    });
  },

  // Optimize CSS animations
  optimize: (element: HTMLElement): void => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
  },

  // Create keyframe animation
  createKeyframes: (name: string, keyframes: Record<string, Record<string, string>>): string => {
    const keyframeString = Object.entries(keyframes)
      .map(([percentage, properties]) => {
        const propertyString = Object.entries(properties)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
        return `${percentage} { ${propertyString}; }`;
      })
      .join(' ');

    return `@keyframes ${name} { ${keyframeString} }`;
  }
};

// 🚀 SVG Animation Optimization
export const svgAnimationOptimization = {
  // Optimize SVG for animation
  optimize: (svg: SVGElement): void => {
    svg.style.transform = 'translateZ(0)';
    svg.style.willChange = 'transform';
  },

  // Animate SVG path
  animatePath: (path: SVGPathElement, _from: string, _to: string, duration: number = 1000): void => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length.toString();
    path.style.strokeDashoffset = length.toString();
    
    path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
    path.style.strokeDashoffset = '0';
  },

  // Animate SVG transform
  animateTransform: (element: SVGElement, transform: string, duration: number = 300): void => {
    element.style.transition = `transform ${duration}ms ease-in-out`;
    element.style.transform = transform;
  }
};

// 🚀 Animation Throttling
export class AnimationThrottler {
  private lastCall = 0;
  private throttleDelay: number;

  constructor(throttleDelay: number = 16) { // 60fps = ~16ms
    this.throttleDelay = throttleDelay;
  }

  throttle(callback: () => void): void {
    try {
      const now = Date.now();
      if (now - this.lastCall >= this.throttleDelay) {
        callback();
        this.lastCall = now;
      }
    } catch (error) {
      console.warn('Error in animation throttler:', error);
    }
  }

  setThrottleDelay(delay: number): void {
    this.throttleDelay = delay;
  }
}

// 🚀 Animation Support Detection
export const animationSupport = {
  // Check if CSS animations are supported
  cssAnimations: (): boolean => {
    return 'animation' in document.documentElement.style;
  },

  // Check if CSS transitions are supported
  cssTransitions: (): boolean => {
    return 'transition' in document.documentElement.style;
  },

  // Check if requestAnimationFrame is supported
  requestAnimationFrame: (): boolean => {
    return 'requestAnimationFrame' in window;
  },

  // Check if IntersectionObserver is supported
  intersectionObserver: (): boolean => {
    return 'IntersectionObserver' in window;
  },

  // Check if ResizeObserver is supported
  resizeObserver: (): boolean => {
    return 'ResizeObserver' in window;
  }
};

// 🚀 Animation Preloading
export class AnimationPreloader {
  private preloadedAnimations = new Set<string>();

  // Preload critical animations
  preloadCritical(animations: string[]): void {
    animations.forEach(animation => {
      if (!this.preloadedAnimations.has(animation)) {
        this.preloadedAnimations.add(animation);
        this.loadAnimation();
      }
    });
  }

  private loadAnimation(): void {
    // Implementation depends on animation type
    // For CSS animations, ensure styles are loaded
    // For JS animations, preload any required assets
  }

  isPreloaded(animation: string): boolean {
    return this.preloadedAnimations.has(animation);
  }
}

// 🚀 Export all animation optimizations
export const animationOptimizations = {
  FLIPAnimation,
  hardwareAcceleration,
  AnimationFrameManager,
  AnimationPerformanceMonitor,
  cssAnimationOptimization,
  svgAnimationOptimization,
  AnimationThrottler,
  animationSupport,
  AnimationPreloader
}; 