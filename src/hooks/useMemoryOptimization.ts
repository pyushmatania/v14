/**
 * 🚀 Advanced Memory Management Hook
 * Provides comprehensive memory optimization with automatic cleanup
 */

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

interface CleanupFunction {
  (): void;
}

interface EventListenerOptions {
  target?: EventTarget;
  type: string;
  listener: EventListener;
  options?: AddEventListenerOptions;
}

interface TimerOptions {
  callback: () => void;
  delay: number;
  type: 'timeout' | 'interval';
  timerId?: number;
}

interface ObserverOptions {
  type: 'intersection' | 'resize' | 'mutation';
  callback: (entries: IntersectionObserverEntry[] | ResizeObserverEntry[] | MutationRecord[], observer: IntersectionObserver | ResizeObserver | MutationObserver) => void;
  options?: IntersectionObserverInit | undefined;
}

interface ObjectPool<T = unknown> {
  acquire: () => T;
  release: (obj: T) => void;
  clear: () => void;
}

export const useMemoryOptimization = () => {
  const cleanupFunctions = useRef<CleanupFunction[]>([]);
  const eventListeners = useRef<Map<string, EventListenerOptions>>(new Map());
  const timers = useRef<Map<string, TimerOptions>>(new Map());
  const observers = useRef<Map<string, ObserverOptions>>(new Map());
  const objectPools = useRef<Map<string, ObjectPool<unknown>>>(new Map());
  const weakStorage = useRef<Map<string, WeakMap<object, unknown>>>(new Map());

  // 🚀 Register cleanup function
  const registerCleanup = useCallback((cleanup: CleanupFunction) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  // 🚀 Add event listener with automatic cleanup
  const addEventListener = useCallback((options: EventListenerOptions) => {
    const { target = window, type, listener, options: listenerOptions } = options;
    const key = `${type}-${Date.now()}-${Math.random()}`;
    
    target.addEventListener(type, listener, listenerOptions);
    eventListeners.current.set(key, options);
    
    registerCleanup(() => {
      target.removeEventListener(type, listener, listenerOptions);
      eventListeners.current.delete(key);
    });
    
    return key;
  }, [registerCleanup]);

  // 🚀 Set timeout with automatic cleanup
  const setTimeout = useCallback((options: TimerOptions) => {
    const { callback, delay, type } = options;
    const key = `${type}-${Date.now()}-${Math.random()}`;
    
    const timerId = type === 'timeout' 
      ? window.setTimeout(callback, delay)
      : window.setInterval(callback, delay);
    
    timers.current.set(key, { ...options, timerId });
    
    registerCleanup(() => {
      if (type === 'timeout') {
        window.clearTimeout(timerId);
      } else {
        window.clearInterval(timerId);
      }
      timers.current.delete(key);
    });
    
    return key;
  }, [registerCleanup]);

  // 🚀 Set interval with automatic cleanup
  const setInterval = useCallback((callback: () => void, delay: number) => {
    return setTimeout({ callback, delay, type: 'interval' });
  }, [setTimeout]);

  // 🚀 Add observer with automatic cleanup
  const addObserver = useCallback((options: ObserverOptions) => {
    const { type, callback, options: observerOptions } = options;
    const key = `${type}-${Date.now()}-${Math.random()}`;
    
    let observer: IntersectionObserver | ResizeObserver | MutationObserver;
    
    switch (type) {
      case 'intersection':
        observer = new IntersectionObserver(callback, observerOptions);
        break;
      case 'resize':
        observer = new ResizeObserver(callback);
        break;
      case 'mutation':
        observer = new MutationObserver(callback);
        break;
      default:
        throw new Error(`Unknown observer type: ${type}`);
    }
    
    observers.current.set(key, options);
    
    registerCleanup(() => {
      observer.disconnect();
      observers.current.delete(key);
    });
    
    return { key, observer };
  }, [registerCleanup]);

  // 🚀 Create object pool for frequently created/destroyed objects
  const createObjectPool = useCallback(<T>(
    createFn: () => T,
    resetFn: (obj: T) => void,
    maxSize: number = 10
  ): ObjectPool<T> => {
    const poolKey = `pool-${Date.now()}-${Math.random()}`;
    const pool: T[] = [];
    const inUse = new Set<T>();
    
    const objectPool: ObjectPool<T> = {
      acquire: () => {
        if (pool.length > 0) {
          const obj = pool.pop()!;
          inUse.add(obj);
          return obj;
        }
        const obj = createFn();
        inUse.add(obj);
        return obj;
      },
      release: (obj: T) => {
        if (inUse.has(obj)) {
          resetFn(obj);
          inUse.delete(obj);
          if (pool.length < maxSize) {
            pool.push(obj);
          }
        }
      },
      clear: () => {
        pool.length = 0;
        inUse.clear();
      }
    };
    
    objectPools.current.set(poolKey, objectPool as ObjectPool<unknown>);
    
    registerCleanup(() => {
      objectPool.clear();
      objectPools.current.delete(poolKey);
    });
    
    return objectPool;
  }, [registerCleanup]);

  // 🚀 Create WeakMap storage for object-based metadata
  const createWeakStorage = useCallback(<K extends object, V>() => {
    const storageKey = `weak-${Date.now()}-${Math.random()}`;
    const weakMap = new WeakMap<K, V>();
    
    weakStorage.current.set(storageKey, weakMap);
    
    registerCleanup(() => {
      weakStorage.current.delete(storageKey);
    });
    
    return weakMap;
  }, [registerCleanup]);

  // 🚀 Large object manager for automatic disposal
  const largeObjectManager = useCallback(() => {
    const largeObjects = new Set<object>();
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    let currentSize = 0;
    
    return {
      add: (obj: object, estimatedSize: number = 1024) => {
        if (currentSize + estimatedSize > maxSize) {
          // Remove oldest objects
          const iterator = largeObjects.values();
          const first = iterator.next();
          if (!first.done) {
            largeObjects.delete(first.value);
            currentSize -= estimatedSize;
          }
        }
        
        largeObjects.add(obj);
        currentSize += estimatedSize;
      },
      remove: (obj: object) => {
        if (largeObjects.has(obj)) {
          largeObjects.delete(obj);
          currentSize = Math.max(0, currentSize - 1024);
        }
      },
      clear: () => {
        largeObjects.clear();
        currentSize = 0;
      }
    };
  }, []);

  // 🚀 DOM reference manager
  const domReferenceManager = useCallback(() => {
    const domRefs = new Set<Element>();
    
    return {
      add: (element: Element) => {
        domRefs.add(element);
      },
      remove: (element: Element) => {
        domRefs.delete(element);
      },
      clear: () => {
        domRefs.clear();
      }
    };
  }, []);

  // 🚀 Memory usage monitor
  const memoryMonitor = useCallback(() => {
    try {
      if (typeof performance === 'undefined' || !('memory' in performance)) {
        return {
          getUsage: () => ({ used: 0, total: 0, limit: 0 }),
          isHighUsage: () => false
        };
      }
      
      return {
        getUsage: () => {
          try {
            const memory = (performance as ExtendedPerformance).memory;
            if (!memory) {
              return { used: 0, total: 0, limit: 0 };
            }
            return {
              used: memory.usedJSHeapSize || 0,
              total: memory.totalJSHeapSize || 0,
              limit: memory.jsHeapSizeLimit || 0
            };
          } catch (error) {
            console.warn('Error accessing memory info:', error);
            return { used: 0, total: 0, limit: 0 };
          }
        },
        isHighUsage: () => {
          try {
            const memory = (performance as ExtendedPerformance).memory;
            if (!memory) return false;
            return (memory.usedJSHeapSize || 0) > (memory.jsHeapSizeLimit || 0) * 0.8;
          } catch (error) {
            console.warn('Error checking memory usage:', error);
            return false;
          }
        }
      };
    } catch (error) {
      console.warn('Error initializing memory monitor:', error);
      return {
        getUsage: () => ({ used: 0, total: 0, limit: 0 }),
        isHighUsage: () => false
      };
    }
  }, []);

  // 🚀 Cleanup all resources
  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
  }, []);

  // 🚀 Automatic cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    registerCleanup,
    addEventListener,
    setTimeout,
    setInterval,
    addObserver,
    createObjectPool,
    createWeakStorage,
    largeObjectManager,
    domReferenceManager,
    memoryMonitor,
    cleanup
  };
};

/**
 * 🚀 Hook for managing large objects and arrays
 * Automatically disposes of large objects when no longer needed
 */
export function useLargeObjectManager<T>(
  createObject: () => T,
  disposeObject: (obj: T) => void,
  maxSize: number = 5
) {
  const objects = useRef<T[]>([]);
  const isDisposed = useRef(false);

  const acquire = useCallback((): T => {
    if (isDisposed.current) {
      throw new Error('Object manager has been disposed');
    }

    if (objects.current.length >= maxSize) {
      // Dispose oldest object
      const oldest = objects.current.shift()!;
      disposeObject(oldest);
    }

    const obj = createObject();
    objects.current.push(obj);
    return obj;
  }, [createObject, disposeObject, maxSize]);

  const release = useCallback((obj: T) => {
    const index = objects.current.indexOf(obj);
    if (index > -1) {
      objects.current.splice(index, 1);
      disposeObject(obj);
    }
  }, [disposeObject]);

  // Cleanup on unmount
  useEffect(() => {
    const currentDisposeObject = disposeObject;
    const currentObjects = objects.current;
    return () => {
      isDisposed.current = true;
      currentObjects.forEach(currentDisposeObject);
      currentObjects.length = 0;
    };
  }, [disposeObject]);

  return { acquire, release, count: () => objects.current.length };
}

/**
 * 🚀 Hook for managing DOM element references
 * Automatically cleans up DOM references on unmount
 */
export function useDOMReference<T extends Element>() {
  const ref = useRef<T | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setRef = useCallback((element: T | null) => {
    // Clean up previous element
    if (ref.current && cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    ref.current = element;

    // Set up cleanup for new element
    if (element) {
      cleanupRef.current = () => {
        // Remove event listeners, observers, etc.
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      ref.current = null;
    };
  }, []);

  return { ref, setRef };
} 