// 🚀 Analytics Service - Comprehensive tracking for waitlist and user behavior
// @description Handles Google Analytics, Mixpanel, and custom event tracking

// 🛡️ Global type declarations
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    mixpanel: Record<string, unknown>;
  }
}

// 🛡️ Type definitions
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp?: number;
}

interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  deviceInfo?: DeviceInfo;
  location?: LocationInfo;
  utmParams?: UTMParams;
}

interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
  platform: string;
  browser: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

interface LocationInfo {
  country?: string;
  city?: string;
  region?: string;
  ip?: string;
}

interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface WaitlistData {
  id: string;
  email: string;
  name: string;
  timestamp: number;
  source: string;
  deviceInfo: DeviceInfo;
  location?: LocationInfo;
  utmParams?: UTMParams;
  referrer?: string;
  scrollDepth?: number;
  timeOnPage?: number;
  interactions: string[];
}

// 🚀 Analytics Configuration
const ANALYTICS_CONFIG = {
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-SBWLVKVMCN',
    enabled: true
  },
  mixpanel: {
    token: import.meta.env.VITE_MIXPANEL_TOKEN || 'your-mixpanel-token',
    enabled: true
  },
  custom: {
    endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics',
    enabled: false  // Disabled for now to prevent 404 errors
  }
};

// 🚀 Device Detection
const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const platform = navigator.platform;
  
  // Browser detection
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  // Device type detection
  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent) ? 'tablet' : 'mobile';
  }
  
  return {
    userAgent,
    screenResolution,
    language,
    timezone,
    platform,
    browser,
    deviceType
  };
};

// 🚀 UTM Parameter Extraction
const getUTMParams = (): UTMParams => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    term: urlParams.get('utm_term') || undefined,
    content: urlParams.get('utm_content') || undefined
  };
};

// 🚀 Google Analytics Integration
class GoogleAnalytics {
  private initialized = false;

  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    
    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalytics.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args as any);
      }
      gtag('js', new Date());
      gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'waitlist_source',
          'custom_parameter_2': 'device_type',
          'custom_parameter_3': 'scroll_depth'
        },
        // Add cookie settings to work with blocked third-party cookies
        cookie_flags: 'SameSite=None;Secure',
        anonymize_ip: true
      });

      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtag;
      this.initialized = true;
      // Google Analytics initialized successfully
    } catch {
      // Silently continue without GA
      // Continue without GA if it fails
      this.initialized = true;
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized || !ANALYTICS_CONFIG.googleAnalytics.enabled) return;

    try {
      const { gtag } = window as Window & { gtag?: (...args: unknown[]) => void };
      if (gtag) {
        gtag('event', event.event, {
          event_category: 'waitlist',
          event_label: event.properties?.source || 'direct',
          custom_parameter_1: event.properties?.source,
          custom_parameter_2: event.properties?.deviceType,
          custom_parameter_3: event.properties?.scrollDepth,
          value: event.properties?.value || 1
        });
      }
    } catch {
      // Silently continue without GA tracking
      // Continue without GA tracking if it fails
    }
  }

  trackPageView(page: string) {
    if (!this.initialized || !ANALYTICS_CONFIG.googleAnalytics.enabled) return;

    const { gtag } = window as Window & { gtag?: (...args: unknown[]) => void };
    if (gtag) {
      gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
        page_title: page,
        page_location: window.location.href
      });
    }
  }
}

// 🚀 Mixpanel Integration
class MixpanelAnalytics {
  private initialized = false;

  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    
    try {
      // Load Mixpanel script with error handling
      const script = document.createElement('script');
      script.async = true;
      // Use a working Mixpanel CDN URL
      script.src = 'https://cdn.jsdelivr.net/npm/mixpanel-browser@latest/dist/mixpanel.min.js';
      document.head.appendChild(script);

      script.onload = () => {
        try {
          const { mixpanel } = window as Window & { mixpanel?: Record<string, unknown> };
          if (mixpanel && typeof mixpanel.init === 'function') {
            mixpanel.init(ANALYTICS_CONFIG.mixpanel.token, {
              debug: import.meta.env.DEV,
              track_pageview: true,
              persistence: 'localStorage'
            });
            this.initialized = true;
            // Mixpanel initialized successfully
          }
        } catch {
          // Silently continue without Mixpanel
          this.initialized = true; // Mark as initialized to prevent retries
        }
      };

      script.onerror = () => {
        // Silently continue without Mixpanel CDN
        this.initialized = true; // Mark as initialized to prevent retries
      };
    } catch {
      // Silently continue without Mixpanel setup
      this.initialized = true; // Mark as initialized to prevent retries
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized || !ANALYTICS_CONFIG.mixpanel.enabled) return;

    try {
      const { mixpanel } = window as Window & { mixpanel?: Record<string, unknown> };
      if (mixpanel && typeof mixpanel.track === 'function') {
        mixpanel.track(event.event, {
          ...event.properties,
          timestamp: event.timestamp || Date.now(),
          distinct_id: event.userId || 'anonymous'
        });
      }
    } catch {
      // Silently disable Mixpanel tracking if it keeps failing - no console spam
      ANALYTICS_CONFIG.mixpanel.enabled = false;
    }
  }

  setUserProperties(properties: UserProperties) {
    if (!this.initialized || !ANALYTICS_CONFIG.mixpanel.enabled) return;

    try {
      const { mixpanel } = window as Window & { mixpanel?: any };
      if (mixpanel && mixpanel.people && typeof mixpanel.people.set === 'function') {
        (mixpanel.people as any).set({
          $email: properties.email,
          $name: properties.name,
          $created: new Date().toISOString(),
          device_info: properties.deviceInfo,
          location: properties.location,
          utm_params: properties.utmParams
        });
      }
    } catch {
      // Silently disable Mixpanel user properties
      // Disable further Mixpanel tracking if it keeps failing
      ANALYTICS_CONFIG.mixpanel.enabled = false;
    }
  }
}

// 🚀 Custom Analytics Service
class CustomAnalytics {
  async trackEvent(event: AnalyticsEvent) {
    if (!ANALYTICS_CONFIG.custom.enabled) return;

    try {
      // Only send to custom endpoint if it's configured and not localhost
      if (ANALYTICS_CONFIG.custom.endpoint && !window.location.hostname.includes('localhost')) {
        await fetch(ANALYTICS_CONFIG.custom.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...event,
            timestamp: event.timestamp || Date.now(),
            url: window.location.href,
            referrer: document.referrer
          })
        });
      } else {
        // Just log the event for local development
        // Analytics event (local): ${event}
      }
    } catch {
      // Silently handle custom analytics errors
    }
  }

  async trackWaitlistSignup(data: WaitlistData) {
    return this.trackEvent({
      event: 'waitlist_signup',
      properties: {
        email: data.email,
        name: data.name,
        source: data.source,
        deviceInfo: data.deviceInfo,
        location: data.location,
        utmParams: data.utmParams,
        referrer: data.referrer,
        scrollDepth: data.scrollDepth,
        timeOnPage: data.timeOnPage,
        interactions: data.interactions
      }
    });
  }
}

// 🚀 Scroll Depth Tracking
class ScrollTracker {
  private maxScrollDepth = 0;
  private scrollEvents = [25, 50, 75, 100];
  private trackedEvents = new Set<number>();

  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  private handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);

    // Track scroll depth milestones
    this.scrollEvents.forEach(depth => {
      if (scrollPercent >= depth && !this.trackedEvents.has(depth)) {
        this.trackedEvents.add(depth);
        analytics.trackEvent({
          event: 'scroll_depth',
          properties: {
            depth: depth,
            page: window.location.pathname
          }
        });
      }
    });
  }

  getMaxScrollDepth(): number {
    return this.maxScrollDepth;
  }
}

// 🚀 Time on Page Tracking
class TimeTracker {
  private startTime = Date.now();


  init() {
    if (typeof window === 'undefined') return;

    // Track when user becomes inactive
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      // this.isActive = false;
    } else {
              // this.isActive = true;
    }
  }

  private handleBeforeUnload() {
    const timeOnPage = Date.now() - this.startTime;
    analytics.trackEvent({
      event: 'page_exit',
      properties: {
        timeOnPage: Math.round(timeOnPage / 1000), // Convert to seconds
        page: window.location.pathname
      }
    });
  }

  getTimeOnPage(): number {
    return Date.now() - this.startTime;
  }
}

// 🚀 Main Analytics Class
class Analytics {
  private ga: GoogleAnalytics;
  private mixpanel: MixpanelAnalytics;
  private custom: CustomAnalytics;
  private scrollTracker: ScrollTracker;
  private timeTracker: TimeTracker;
  private userInteractions: string[] = [];

  constructor() {
    this.ga = new GoogleAnalytics();
    this.mixpanel = new MixpanelAnalytics();
    this.custom = new CustomAnalytics();
    this.scrollTracker = new ScrollTracker();
    this.timeTracker = new TimeTracker();
  }

  init() {
    this.ga.init();
    this.mixpanel.init();
    this.scrollTracker.init();
    this.timeTracker.init();
  }

  trackEvent(event: AnalyticsEvent) {
    this.ga.trackEvent(event);
    this.mixpanel.trackEvent(event);
    // Only call custom analytics if enabled
    if (ANALYTICS_CONFIG.custom.enabled) {
      this.custom.trackEvent(event);
    }
  }

  trackPageView(page: string) {
    this.ga.trackPageView(page);
    this.trackEvent({
      event: 'page_view',
      properties: {
        page,
        url: window.location.href,
        referrer: document.referrer
      }
    });
  }

  trackWaitlistSignup(email: string, name: string, source: string = 'direct') {
    const deviceInfo = getDeviceInfo();
    const utmParams = getUTMParams();
    
    const waitlistData: WaitlistData = {
      id: crypto.randomUUID(),
      email,
      name,
      timestamp: Date.now(),
      source,
      deviceInfo,
      utmParams,
      referrer: document.referrer,
      scrollDepth: this.scrollTracker.getMaxScrollDepth(),
      timeOnPage: this.timeTracker.getTimeOnPage(),
      interactions: this.userInteractions
    };

    // Track across all platforms
    this.trackEvent({
      event: 'waitlist_signup',
      properties: {
        email,
        name,
        source,
        deviceInfo,
        utmParams,
        scrollDepth: waitlistData.scrollDepth,
        timeOnPage: waitlistData.timeOnPage,
        interactions: waitlistData.interactions
      }
    });

    // Send to custom endpoint only if enabled
    if (ANALYTICS_CONFIG.custom.enabled) {
      this.custom.trackWaitlistSignup(waitlistData);
    }

    // Set user properties in Mixpanel
    this.mixpanel.setUserProperties({
      email,
      name,
      deviceInfo,
      utmParams
    });

    return waitlistData;
  }

  trackInteraction(interaction: string) {
    this.userInteractions.push(interaction);
    this.trackEvent({
      event: 'user_interaction',
      properties: {
        interaction,
        page: window.location.pathname
      }
    });
  }

  trackButtonClick(buttonName: string, location: string) {
    this.trackInteraction(`button_click_${buttonName}`);
    this.trackEvent({
      event: 'button_click',
      properties: {
        button_name: buttonName,
        location,
        page: window.location.pathname
      }
    });
  }

  trackFormSubmission(formName: string, success: boolean) {
    this.trackEvent({
      event: 'form_submission',
      properties: {
        form_name: formName,
        success,
        page: window.location.pathname
      }
    });
  }
}

// 🚀 Export singleton instance
export const analytics = new Analytics();

// 🚀 Initialize analytics on app load
if (typeof window !== 'undefined') {
  try {
    // Use setTimeout to allow other initialization to complete first
    setTimeout(() => {
      analytics.init();
    }, 1000);
  } catch {
    // Silently handle analytics initialization errors
  }
}

export default analytics; 