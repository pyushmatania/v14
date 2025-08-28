/**
 * 🚀 Micro-Optimizations for Critical Performance Paths
 * Provides utilities for fine-grained performance optimizations
 */

// 🚀 Optimized array operations
export const arrayOptimizations = {
  // Use Set.has instead of array.includes for large arrays
  fastIncludes: <T>(array: T[], item: T): boolean => {
    if (array.length > 100) {
      const set = new Set(array);
      return set.has(item);
    }
    return array.includes(item);
  },

  // Cache array length in loops
  optimizedLoop: <T>(array: T[], callback: (item: T, index: number) => void) => {
    const len = array.length;
    for (let i = 0; i < len; i++) {
      callback(array[i], i);
    }
  },

  // Binary search for sorted arrays
  binarySearch: <T>(array: T[], target: T, compare: (a: T, b: T) => number): number => {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compare(array[mid], target);

      if (comparison === 0) return mid;
      if (comparison < 0) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  },

  // Object pooling for temporary arrays
  createArrayPool: <T>(maxSize: number = 10) => {
    const pool: T[][] = [];
    const inUse = new Set<T[]>();

    return {
      acquire: (): T[] => {
        if (pool.length > 0) {
          const arr = pool.pop()!;
          inUse.add(arr);
          return arr;
        }
        const arr: T[] = [];
        inUse.add(arr);
        return arr;
      },
      release: (arr: T[]) => {
        if (inUse.has(arr)) {
          arr.length = 0; // Clear array
          inUse.delete(arr);
          if (pool.length < maxSize) {
            pool.push(arr);
          }
        }
      }
    };
  }
};

// 🚀 Optimized object operations
export const objectOptimizations = {
  // Use Map/Set instead of objects for large datasets
  createOptimizedMap: <K, V>(entries?: [K, V][]) => {
    return new Map(entries);
  },

  // Fast object property access
  fastPropertyAccess: <T extends object>(obj: T, key: keyof T): T[keyof T] => {
    return obj[key];
  },

  // Object pooling for temporary objects
  createObjectPool: <T>(createFn: () => T, resetFn: (obj: T) => void, maxSize: number = 10) => {
    const pool: T[] = [];
    const inUse = new Set<T>();

    return {
      acquire: (): T => {
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
      }
    };
  }
};

// 🚀 Bitwise operations for performance
export const bitwiseOptimizations = {
  // Fast integer division by 2
  fastDivideBy2: (n: number): number => n >> 1,

  // Fast multiplication by 2
  fastMultiplyBy2: (n: number): number => n << 1,

  // Check if number is even
  isEven: (n: number): boolean => (n & 1) === 0,

  // Check if number is power of 2
  isPowerOf2: (n: number): boolean => n > 0 && (n & (n - 1)) === 0,

  // Fast absolute value
  fastAbs: (n: number): number => (n ^ (n >> 31)) - (n >> 31),

  // Fast min/max
  fastMin: (a: number, b: number): number => a ^ ((a ^ b) & -(a < b)),
  fastMax: (a: number, b: number): number => a ^ ((a ^ b) & -(a > b))
};

// 🚀 Optimized function patterns
// Type definitions for function optimizations
type AnyFunction = (...args: unknown[]) => unknown;

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export const functionOptimizations = {
  // Memoization with Map
  memoize: <T extends AnyFunction>(fn: T): T => {
    const cache = new Map<string, unknown>();
    return ((...args: unknown[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },

  // Debounced function
  debounce: <T extends AnyFunction>(fn: T, delay: number): T => {
    let timeoutId: number;
    return ((...args: unknown[]) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn(...args), delay);
    }) as T;
  },

  // Throttled function
  throttle: <T extends AnyFunction>(fn: T, delay: number): T => {
    let lastCall = 0;
    return ((...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn(...args);
      }
    }) as T;
  },

  // Once function (executes only once)
  once: <T extends AnyFunction>(fn: T): T => {
    let called = false;
    let result: unknown;
    return ((...args: unknown[]) => {
      if (!called) {
        called = true;
        result = fn(...args);
      }
      return result;
    }) as T;
  }
};

// 🚀 Optimized DOM operations
export const domOptimizations = {
  // Batch DOM updates
  batchUpdates: (updates: (() => void)[]) => {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  },

  // Passive event listeners
  addPassiveListener: (element: EventTarget, type: string, handler: EventListener) => {
    element.addEventListener(type, handler, { passive: true });
  },

  // Optimized element creation
  createElement: <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Record<string, string> = {}
  ): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },

  // Fragment for batch DOM insertion
  createFragment: (elements: HTMLElement[]): DocumentFragment => {
    const fragment = document.createDocumentFragment();
    elements.forEach(element => fragment.appendChild(element));
    return fragment;
  }
};

// 🚀 Optimized string operations
export const stringOptimizations = {
  // Fast string concatenation for large strings
  fastConcat: (strings: string[]): string => {
    return strings.join('');
  },

  // Template literal optimization
  createTemplate: (strings: TemplateStringsArray, ...values: unknown[]): string => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
      result += values[i] + strings[i + 1];
    }
    return result;
  },

  // Fast string replacement
  fastReplace: (str: string, search: string, replace: string): string => {
    return str.split(search).join(replace);
  }
};

// 🚀 Optimized number operations
export const numberOptimizations = {
  // Fast integer parsing
  fastParseInt: (str: string): number => {
    return +str;
  },

  // Fast float parsing
  fastParseFloat: (str: string): number => {
    return +str;
  },

  // Fast rounding
  fastRound: (n: number): number => {
    return (n + 0.5) | 0;
  },

  // Fast floor
  fastFloor: (n: number): number => {
    return n | 0;
  }
};

// 🚀 Performance monitoring utilities
export const performanceOptimizations = {
  // Measure execution time
  measureTime: <T>(fn: () => T): { result: T; time: number } => {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  },

  // Async performance measurement
  measureAsyncTime: async <T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const time = performance.now() - start;
    return { result, time };
  },

  // Memory usage measurement
  measureMemory: (): number => {
    if ('memory' in performance) {
      return (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0;
    }
    return 0;
  }
};

// 🚀 Cache optimization utilities
export const cacheOptimizations = {
  // LRU Cache implementation
  createLRUCache: <K, V>(maxSize: number = 100) => {
    const cache = new Map<K, V>();
    const keys: K[] = [];

    return {
      get: (key: K): V | undefined => {
        if (cache.has(key)) {
          // Move to end (most recently used)
          const index = keys.indexOf(key);
          keys.splice(index, 1);
          keys.push(key);
          return cache.get(key);
        }
        return undefined;
      },
      set: (key: K, value: V): void => {
        if (cache.has(key)) {
          // Update existing
          const index = keys.indexOf(key);
          keys.splice(index, 1);
        } else if (keys.length >= maxSize) {
          // Remove least recently used
          const oldestKey = keys.shift()!;
          cache.delete(oldestKey);
        }
        keys.push(key);
        cache.set(key, value);
      },
      clear: (): void => {
        cache.clear();
        keys.length = 0;
      }
    };
  },

  // WeakMap for object-based caching
  createWeakCache: <K extends object, V>() => {
    return new WeakMap<K, V>();
  }
};

// 🚀 Export all optimizations
export const microOptimizations = {
  array: arrayOptimizations,
  object: objectOptimizations,
  bitwise: bitwiseOptimizations,
  function: functionOptimizations,
  dom: domOptimizations,
  string: stringOptimizations,
  number: numberOptimizations,
  performance: performanceOptimizations,
  cache: cacheOptimizations
}; 