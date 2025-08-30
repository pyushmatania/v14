// 🚀 Consolidated Common Utilities
// Combines duplicate functions found across the codebase

// ===== MOBILE DETECTION =====
/**
 * Simple mobile detection utility
 * Replaces multiple window.innerWidth < 768 checks across components
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * Get device type based on screen width
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// ===== FORMATTING UTILITIES =====
/**
 * Format numbers with locale support
 * Replaces duplicate formatNumber functions
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString(locale);
};

/**
 * Format currency with locale support
 * Replaces duplicate formatCurrency functions
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage with locale support
 */
export const formatPercentage = (
  value: number, 
  locale: string = 'en-US',
  decimals: number = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// ===== STRING UTILITIES =====
/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convert string to slug (URL-friendly)
 */
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ===== ARRAY UTILITIES =====
/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Group array by key
 */
export const groupBy = <T, K extends keyof T>(
  array: T[], 
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// ===== OBJECT UTILITIES =====
/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

/**
 * Pick specific keys from object
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// ===== VALIDATION UTILITIES =====
/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// ===== PERFORMANCE UTILITIES =====
/**
 * Debounce function execution
 */
export const debounce = <T extends (..._args: any[]) => any>(
  func: T,
  delay: number
): ((..._args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (..._args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(..._args), delay);
  };
};

/**
 * Throttle function execution
 */
export const throttle = <T extends (..._args: any[]) => any>(
  func: T,
  delay: number
): ((..._args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (..._args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(..._args);
    }
  };
};

// ===== DATE UTILITIES =====
/**
 * Format date with locale support
 */
export const formatDate = (
  date: Date | string, 
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return dateObj.toLocaleDateString(locale, defaultOptions);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// ===== STORAGE UTILITIES =====
/**
 * Safe localStorage getter with fallback
 */
export const getLocalStorage = (key: string, fallback: any = null): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safe localStorage setter with error handling
 */
export const setLocalStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Safe localStorage remover with error handling
 */
export const removeLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// ===== URL UTILITIES =====
/**
 * Get URL parameters as object
 */
export const getUrlParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Set URL parameter without page reload
 */
export const setUrlParam = (key: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
};

/**
 * Remove URL parameter without page reload
 */
export const removeUrlParam = (key: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.pushState({}, '', url.toString());
};

// ===== ERROR HANDLING =====
/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Safe function execution with error handling
 */
export const safeExecute = <T>(
  fn: () => T, 
  fallback: T, 
  errorHandler?: (_error: Error) => void
): T => {
  try {
    return fn();
  } catch (_error) {
    if (errorHandler && _error instanceof Error) {
      errorHandler(_error);
    }
    return fallback;
  }
};

// ===== EXPORT ALL UTILITIES =====
export default {
  // Mobile detection
  isMobile,
  getDeviceType,
  
  // Formatting
  formatNumber,
  formatCurrency,
  formatPercentage,
  
  // String utilities
  truncateText,
  capitalizeWords,
  toSlug,
  
  // Array utilities
  shuffleArray,
  removeDuplicates,
  groupBy,
  
  // Object utilities
  deepClone,
  pick,
  omit,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isEmpty,
  
  // Performance
  debounce,
  throttle,
  
  // Date utilities
  formatDate,
  getRelativeTime,
  
  // Storage
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  
  // URL utilities
  getUrlParams,
  setUrlParam,
  removeUrlParam,
  
  // Error handling
  safeJsonParse,
  safeExecute,
};
