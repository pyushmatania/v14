// 🚀 Google Analytics Service - Enhanced data integration
// Merges GA data with Supabase waitlist data for comprehensive analytics

import { supabase } from '../config/supabase';

// Google Analytics API types
interface GoogleTokenClient {
  requestAccessToken: (_callback?: (_token: { access_token?: string }) => void) => void;
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient: (_config: {
      client_id: string;
      scope: string;
      callback: (_token: { access_token?: string }) => void;
    }) => GoogleTokenClient;
  };
}

interface WindowWithGoogle extends Window {
  google?: {
    accounts?: GoogleAccounts;
  };
}

interface GAMetrics {
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  goalCompletions: number;
}

interface GAEnhancedAnalytics {
  // Basic GA metrics
  totalSessions: number;
  totalUsers: number;
  totalPageViews: number;
  avgBounceRate: number;
  avgSessionDuration: number;
  
  // Traffic sources from GA
  trafficSources: Record<string, number>;
  
  // Page performance from GA
  topPages: Array<{ page: string; views: number; bounceRate: number }>;
  
  // Device data from GA
  deviceBreakdown: Record<string, number>;
  
  // Geographic data from GA
  countryBreakdown: Record<string, number>;
  cityBreakdown: Array<{ country: string; region: string; city: string; sessions: number }>;
  
  // Time-based data from GA
  hourlyData: Record<string, number>;
  dailyData: Record<string, number>;
  
  // Conversion funnel from GA
  conversionFunnel: {
    sessions: number;
    pageViews: number;
    waitlistSignups: number;
    conversionRate: number;
  };
  
  // Enhanced metrics combining GA + Supabase
  enhancedMetrics: {
    gaToWaitlistRatio: number; // How many GA sessions lead to waitlist signups
    waitlistConversionFromGA: number; // Waitlist signups from GA traffic
    avgTimeToSignup: number; // Average time from first visit to signup
    returningUserSignupRate: number; // Signup rate for returning users
  };
}

class GoogleAnalyticsService {
  private measurementId: string;
  private accessToken: string | null = null;
  private propertyId: string | null = null;
  private clientId: string | null = null;
  private tokenClient: GoogleTokenClient | null = null;
  private tokenExpiresAtMs: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    this.measurementId = import.meta.env['VITE_GA_MEASUREMENT_ID'] || '';
    this.propertyId = import.meta.env['VITE_GA_PROPERTY_ID'] || null;
    this.clientId = import.meta.env['VITE_GA_CLIENT_ID'] || null;
    
    // Debug logs removed for cleaner console
    
    // Validate property ID format
    if (this.propertyId) {
      // GA4 property IDs should be numeric (e.g., "123456789")
      if (!/^\d+$/.test(this.propertyId)) {
        console.warn('⚠️ GA Property ID format warning:', this.propertyId);
        console.warn('⚠️ Expected numeric format (e.g., "123456789")');
      } else {
        // Property ID format is valid
      }
    }
  }

  // Load Google Identity Services script
  private async loadGIS(): Promise<void> {
    if (typeof window === 'undefined') return;
    if ((window as WindowWithGoogle).google?.accounts?.oauth2) return; // already loaded
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  // Initialize GA API access with OAuth2 (client-side) for admin
  async initialize(): Promise<boolean> {
    try {
      // Reset initialization status at the start
      this.isInitialized = false;
      
      if (!this.propertyId) {
        console.warn('GA_PROPERTY_ID not set - Google Analytics not configured');
        return false;
      }
      if (!this.clientId) {
        console.warn('VITE_GA_CLIENT_ID not set - cannot authenticate to Google Analytics Data API');
        return false;
      }

      if (typeof window === 'undefined') {
        console.warn('Window not available - cannot initialize GA in server environment');
        return false;
      }
      
      // Load Google Identity Services
      await this.loadGIS();

      // Initialize token client (but don't trigger authentication)
      if (!this.tokenClient) {
        const googleObj = (window as WindowWithGoogle).google;
        if (!googleObj?.accounts?.oauth2) {
          throw new Error('Google Identity Services not loaded properly');
        }

        this.tokenClient = googleObj.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/analytics.readonly',
          callback: (response: { access_token?: string; expires_in?: number; error?: string }) => {
            if (response?.access_token) {
              this.accessToken = response.access_token;
              const expiresInSec = Number(response.expires_in || 0);
              this.tokenExpiresAtMs = Date.now() + Math.max(0, expiresInSec - 30) * 1000; // renew slightly early
              console.log('✅ Google Analytics access token obtained');
            } else if (response?.error) {
              console.error('❌ Google Analytics OAuth error:', response.error);
              if (response.error === 'invalid_client') {
                console.error('❌ OAuth client not found. Please check your VITE_GA_CLIENT_ID in .env file and Google Cloud Console configuration.');
              }
            } else {
              console.warn('❌ Google Analytics authentication failed - no access token received');
            }
          }
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
      this.isInitialized = false; // Ensure it's set to false on error
      return false;
    }
  }

  // Request Google OAuth2 authentication (triggers popup)
  async requestAuthentication(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.tokenClient) {
      console.error('❌ Token client not available');
      return false;
    }

    // Validate client ID format
    if (!this.clientId || !this.clientId.includes('.apps.googleusercontent.com')) {
      console.error('❌ Invalid OAuth client ID format. Should end with .apps.googleusercontent.com');
      throw new Error('Invalid OAuth client ID format. Please check your VITE_GA_CLIENT_ID in .env file.');
    }
    
    return new Promise<boolean>((resolve) => {
      try {
        // This will trigger the Google OAuth2 consent popup
        this.tokenClient!.requestAccessToken((token) => {
          if (token?.access_token) {
            console.log('✅ Access token received from OAuth2 popup');
            this.accessToken = token.access_token;
            this.tokenExpiresAtMs = Date.now() + (3600 * 1000); // 1 hour
            resolve(true);
          } else {
            console.log('❌ No access token received from OAuth2 popup');
            resolve(false);
          }
        });
      } catch (error) {
        console.error('❌ Error during OAuth2 authentication:', error);
        resolve(false);
      }
    });
  }

  // Ensure we have a valid access token
  async ensureAccessToken(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.tokenClient) {
      return false;
    }

    const needsNewToken = !this.accessToken || Date.now() >= this.tokenExpiresAtMs;
    if (needsNewToken) {
      return false; // Don't auto-trigger popup
    }
    
    return !!this.accessToken;
  }

  // Get real GA data from Google Analytics Data API (core metrics)
  private async getRealGAData(): Promise<GAMetrics> {
    try {
      const hasToken = await this.ensureAccessToken();
      
      if (!this.propertyId || !hasToken) {
        console.warn('❌ Google Analytics not fully configured (missing propertyId or access token)');
        return {
          sessions: 0,
          users: 0,
          pageViews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          conversionRate: 0,
          goalCompletions: 0
        };
      }
      
      const result = await this.getCoreMetrics();
      return result;
    } catch (error) {
      console.error('❌ Error fetching real GA4 data:', error);
      return {
        sessions: 0,
        users: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
        goalCompletions: 0
      };
    }
  }

  // Run a core metrics report
  private async getCoreMetrics(): Promise<GAMetrics> {
    if (!this.accessToken || !this.propertyId) {
      throw new Error('Missing access token or property ID');
    }

    // Try different date ranges and metrics to diagnose issues
    const dateRanges = [
      { startDate: '30daysAgo', endDate: 'today' },
      { startDate: '7daysAgo', endDate: 'today' },
      { startDate: 'yesterday', endDate: 'today' }
    ];

    const metricsSets = [
      // Standard metrics
      [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'conversions' }
      ],
      // Simplified metrics
      [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' }
      ],
      // Basic metrics
      [
        { name: 'sessions' },
        { name: 'totalUsers' }
      ]
    ];

    let lastError: Error | null = null;

    for (const dateRange of dateRanges) {
      for (const metricsSet of metricsSets) {
        try {
          const requestBody = {
            dateRanges: [dateRange],
            metrics: metricsSet
          };

          const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });



          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ GA API error response:', errorText);
            lastError = new Error(`GA API error: ${response.status} - ${errorText}`);
            continue; // Try next combination
          }

              const data = await response.json();
          
          const rows = data?.rows || [];
          
          if (rows.length === 0) {
            console.warn('⚠️ No data rows returned, trying next combination...');
            continue;
          }
          
          const metricValues = rows[0]?.metricValues || [];

          
          // Map metrics based on what we requested
          const result = {
            sessions: parseInt(metricValues[0]?.value || '0'),
            users: parseInt(metricValues[1]?.value || '0'),
            pageViews: parseInt(metricValues[2]?.value || '0'),
            bounceRate: parseFloat(metricValues[3]?.value || '0'),
            avgSessionDuration: parseFloat(metricValues[4]?.value || '0'),
            conversionRate: 0,
            goalCompletions: parseInt(metricValues[5]?.value || '0')
          };
          
          console.log('✅ Successfully got GA data with combination:', { dateRange, metrics: metricsSet.map((m: { name: string }) => m.name) });
          return result;
          
        } catch (error) {
          console.warn('⚠️ Failed with combination:', { dateRange, metrics: metricsSet.map((m: { name: string }) => m.name) }, error);
          lastError = error as Error;
          continue;
        }
      }
    }

    // If we get here, all combinations failed
    console.error('❌ All GA API combinations failed. Last error:', lastError);
    throw lastError || new Error('Failed to fetch GA data with any combination');
  }

  // Get traffic sources from GA API
  private async getTrafficSources(): Promise<Record<string, number>> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      return {};
    }

    try {
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'sessions' }]
        })
      });

      if (!response.ok) {
        console.warn('Failed to fetch traffic sources:', response.status);
        return {};
      }

      const data = await response.json();
      const sources: Record<string, number> = {};
      const rows = data?.rows || [];
      rows.forEach((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
        const source = row?.dimensionValues?.[0]?.value || 'unknown';
        const sessions = parseInt(row?.metricValues?.[0]?.value || '0');
        sources[source] = sessions;
      });

      return sources;
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      return {};
    }
  }

  // Get geographic data from GA
  private async getGeographicData(): Promise<{ countryBreakdown: Record<string, number>; cityBreakdown: Array<{ country: string; region: string; city: string; sessions: number }> }> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      console.warn('❌ Cannot fetch geographic data: No token or property ID');
      return { countryBreakdown: {}, cityBreakdown: [] };
    }

    try {
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'country' }, { name: 'region' }, { name: 'city' }],
          metrics: [{ name: 'sessions' }]
        })
      });

      if (!response.ok) {
        console.warn('❌ Failed to fetch geographic data:', response.status, response.statusText);
        const errorText = await response.text();
        console.warn('❌ Error response:', errorText);
        return { countryBreakdown: {}, cityBreakdown: [] };
      }

      const data = await response.json();
      
      const countryBreakdown: Record<string, number> = {};
      const cityBreakdown: Array<{ country: string; region: string; city: string; sessions: number }> = [];
      
      const rows = data?.rows || [];
      
      rows.forEach((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
        const country = row?.dimensionValues?.[0]?.value || 'Unknown';
        const region = row?.dimensionValues?.[1]?.value || 'Unknown';
        const city = row?.dimensionValues?.[2]?.value || 'Unknown';
        const sessions = parseInt(row?.metricValues?.[0]?.value || '0');
        
        if (country !== '(not set)') {
          countryBreakdown[country] = (countryBreakdown[country] || 0) + sessions;
        }
        
        if (city !== '(not set)' && city !== 'Unknown') {
          cityBreakdown.push({ country, region, city, sessions });
        }
      });

      return { countryBreakdown, cityBreakdown: cityBreakdown.slice(0, 20) }; // Top 20 cities
    } catch (error) {
      console.error('❌ Error fetching geographic data:', error);
      return { countryBreakdown: {}, cityBreakdown: [] };
    }
  }

  // Get device breakdown from GA
  private async getDeviceBreakdown(): Promise<Record<string, number>> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      return {};
    }

    try {
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'sessions' }]
        })
      });

      if (!response.ok) {
        console.warn('Failed to fetch device breakdown:', response.status);
        return {};
      }

      const data = await response.json();
      const deviceBreakdown: Record<string, number> = {};
      const rows = data?.rows || [];
      rows.forEach((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
        const device = row?.dimensionValues?.[0]?.value || 'unknown';
        const sessions = parseInt(row?.metricValues?.[0]?.value || '0');
        deviceBreakdown[device] = sessions;
      });

      return deviceBreakdown;
    } catch (error) {
      console.error('Error fetching device breakdown:', error);
      return {};
    }
  }

  // Get top pages from GA
  private async getTopPages(): Promise<Array<{ page: string; views: number; bounceRate: number }>> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      return [];
    }

    try {
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }]
        })
      });

      if (!response.ok) {
        console.warn('Failed to fetch top pages:', response.status);
        return [];
      }

      const data = await response.json();
      const topPages: Array<{ page: string; views: number; bounceRate: number }> = [];
      const rows = data?.rows || [];
      rows.forEach((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
        const page = row?.dimensionValues?.[0]?.value || 'unknown';
        const views = parseInt(row?.metricValues?.[0]?.value || '0');
        const bounceRate = parseFloat(row?.metricValues?.[1]?.value || '0');
        
        if (page !== '(not set)' && page !== '/') {
          topPages.push({ page, views, bounceRate });
        }
      });

      return topPages.sort((a, b) => b.views - a.views).slice(0, 10); // Top 10 pages
    } catch (error) {
      console.error('Error fetching top pages:', error);
      return [];
    }
  }

  // Get time-based data from GA
  private async getTimeBasedData(): Promise<{ hourlyData: Record<string, number>; dailyData: Record<string, number> }> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      return { hourlyData: {}, dailyData: {} };
    }

    try {
      // Get daily data for last 30 days
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'sessions' }]
        })
      });

      if (!response.ok) {
        console.warn('Failed to fetch daily data:', response.status);
        return { hourlyData: {}, dailyData: {} };
      }

      const data = await response.json();
      const dailyBreakdown: Record<string, number> = {};
      const dailyRows = data?.rows || [];
      dailyRows.forEach((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
        const date = row?.dimensionValues?.[0]?.value || 'unknown';
        const sessions = parseInt(row?.metricValues?.[0]?.value || '0');
        if (date !== '(not set)') {
          dailyBreakdown[date] = sessions;
        }
      });

      return { hourlyData: {}, dailyData: dailyBreakdown };
    } catch (error) {
      console.error('Error fetching time-based data:', error);
      return { hourlyData: {}, dailyData: {} };
    }
  }

  // Get enhanced analytics combining GA and Supabase data
  async getEnhancedAnalytics(): Promise<GAEnhancedAnalytics> {
    try {
      // Get real GA data
      const gaData = await this.getRealGAData();
      
      // Get traffic sources
      const trafficSources = await this.getTrafficSources();
      
      // Get Supabase waitlist data
      const waitlistData = (
        (await supabase
          .from('waitlist_signups')
          .select('*')
          .order('created_at', { ascending: false })).data || []
      );
      const totalSignups = waitlistData.length;

      // Calculate enhanced metrics
      const gaToWaitlistRatio = gaData.sessions > 0 ? (totalSignups / gaData.sessions) * 100 : 0;
      const waitlistConversionFromGA = gaData.sessions > 0 ? (totalSignups / gaData.sessions) * 100 : 0;
      
      // Calculate returning user signup rate
      const uniqueUsers = new Set(waitlistData.map(entry => entry.email)).size;
      const returningUserSignupRate = gaData.users > 0 ? (uniqueUsers / gaData.users) * 100 : 0;

      // Get comprehensive real data from GA
      const [geographicData, deviceBreakdown, topPages, timeBasedData] = await Promise.all([
        this.getGeographicData(),
        this.getDeviceBreakdown(),
        this.getTopPages(),
        this.getTimeBasedData()
      ]);

      // Try to get real-time data, but don't fail if it doesn't work
      let realTimeData: {
        activeUsers: number;
        pageViews: number;
        topPages: Array<{ page: string; views: number; bounceRate: number }>;
        realTimeTraffic: Record<string, number>;
        realTimeDevices: Record<string, number>;
      } = { activeUsers: 0, pageViews: 0, topPages: [], realTimeTraffic: {}, realTimeDevices: {} };
      try {
        realTimeData = await this.getRealTimeData();
      } catch (error) {
        console.warn('⚠️ Real-time data failed, using fallback:', error);
        // Use basic GA data as fallback for real-time
        realTimeData = {
          activeUsers: gaData.users || 0,
          pageViews: gaData.pageViews || 0,
          topPages: topPages || [],
          realTimeTraffic: trafficSources || {},
          realTimeDevices: deviceBreakdown || {}
        };
      }

      const result = {
        totalSessions: gaData.sessions,
        totalUsers: gaData.users,
        totalPageViews: gaData.pageViews,
        avgBounceRate: gaData.bounceRate,
        avgSessionDuration: gaData.avgSessionDuration,
        trafficSources: trafficSources || {},
        topPages: topPages || [],
        deviceBreakdown: deviceBreakdown || {},
        countryBreakdown: geographicData?.countryBreakdown || {},
        cityBreakdown: geographicData?.cityBreakdown || [],
        hourlyData: timeBasedData?.hourlyData || {},
        dailyData: timeBasedData?.dailyData || {},
        realTimeData: realTimeData, // Add real-time data to the result
        conversionFunnel: {
          sessions: gaData.sessions,
          pageViews: gaData.pageViews,
          waitlistSignups: totalSignups,
          conversionRate: gaData.conversionRate
        },
        enhancedMetrics: {
          gaToWaitlistRatio,
          waitlistConversionFromGA,
          avgTimeToSignup: 0, // Will be calculated from real data
          returningUserSignupRate
        }
      };
      
      return result;
    } catch (error) {
      console.error('❌ Error getting enhanced analytics:', error);
      throw error;
    }
  }

  // Get real-time GA data
  async getRealTimeData(): Promise<{
    activeUsers: number;
    pageViews: number;
    topPages: Array<{ page: string; views: number; bounceRate: number }>;
    realTimeTraffic: Record<string, number>;
    realTimeDevices: Record<string, number>;
  }> {
    const hasToken = await this.ensureAccessToken();
    if (!this.propertyId || !hasToken) {
      return {
        activeUsers: 0,
        pageViews: 0,
        topPages: [],
        realTimeTraffic: {},
        realTimeDevices: {}
      };
    }

    try {
      // Simplified real-time request - just get active users
      const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runRealtimeReport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }]
        })
      });

      if (!response.ok) {
        console.warn('❌ Failed to fetch real-time data:', response.status, response.statusText);
        const errorText = await response.text();
        console.warn('❌ Real-time error response:', errorText);
        
        // Fallback to basic data if real-time fails
        return {
          activeUsers: 0,
          pageViews: 0,
          topPages: [],
          realTimeTraffic: {},
          realTimeDevices: {}
        };
      }

      const data = await response.json();
      const activeUsers = parseInt(data?.totals?.[0]?.metricValues?.[0]?.value || '0');
      
      // For now, return simplified data since real-time API is complex
      return {
        activeUsers,
        pageViews: activeUsers, // Use active users as proxy for page views
        topPages: [], // Real-time top pages require more complex setup
        realTimeTraffic: {}, // Real-time traffic requires more complex setup
        realTimeDevices: {} // Real-time devices require more complex setup
      };
    } catch (error) {
      console.error('❌ Error fetching real-time data:', error);
      return {
        activeUsers: 0,
        pageViews: 0,
        topPages: [],
        realTimeTraffic: {},
        realTimeDevices: {}
      };
    }
  }

  // Track custom events to GA
  async trackCustomEvent(eventName: string, parameters: Record<string, unknown>) {
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag) {
              (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag!('event', eventName, {
        ...parameters,
        custom_parameter_1: parameters['source'],
        custom_parameter_2: parameters['deviceType'],
        custom_parameter_3: parameters['scrollDepth']
      });
    }
  }

  // Track waitlist signup to GA
  async trackWaitlistSignup(email: string, source: string, deviceType: string) {
    await this.trackCustomEvent('waitlist_signup', {
      email,
      source,
      deviceType,
      event_category: 'engagement',
      event_label: source,
      value: 1
    });
  }

  // Track page views to GA
  async trackPageView(page: string) {
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag) {
              (window as Window & { gtag?: (..._args: unknown[]) => void }).gtag!('config', this.measurementId, {
        page_title: page,
        page_location: window.location.href
      });
    }
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return !!(this.propertyId && this.clientId && this.measurementId);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!(this.accessToken && Date.now() < this.tokenExpiresAtMs);
  }

  // Debug method to check what data is available
  async debugDataAvailability(): Promise<{
    hasToken: boolean;
    hasPropertyId: boolean;
    canFetchBasic: boolean;
    canFetchAdvanced: boolean;
    basicDataSample: any;
    realTimeTest: any;
  }> {
    const hasToken = await this.ensureAccessToken();
    const hasPropertyId = !!this.propertyId;
    
    let basicDataSample = null;
    let canFetchBasic = false;
    let canFetchAdvanced = false;
    let realTimeTest = null;
    
    try {
      if (hasToken && hasPropertyId) {
        // Try to fetch basic data
        const basicData = await this.getRealGAData();
        basicDataSample = basicData;
        canFetchBasic = true;
        
        // Try to fetch one advanced metric
        try {
          const trafficSources = await this.getTrafficSources();
          canFetchAdvanced = Object.keys(trafficSources).length > 0;
        } catch (error) {
          console.warn('Advanced data fetch failed:', error);
        }
        
        // Try real-time data
        try {
          realTimeTest = await this.getRealTimeData();
        } catch (error) {
          console.warn('Real-time data fetch failed:', error);
          realTimeTest = { error: (error as Error).message || 'Unknown error' };
        }
      }
    } catch (error) {
      console.error('Basic data fetch failed:', error);
    }
    
    return {
      hasToken,
      hasPropertyId,
      canFetchBasic,
      canFetchAdvanced,
      basicDataSample,
      realTimeTest
    };
  }

  // Get authentication status
  getAuthStatus(): { configured: boolean; authenticated: boolean; initialized: boolean } {
    const status = {
      configured: this.isConfigured(),
      authenticated: this.isAuthenticated(),
      initialized: this.isInitialized
    };
    
    return status;
  }

  // Setup instructions for real GA integration
  getSetupInstructions(): string {
    return `
🚀 Google Analytics Setup Instructions:

1. Create Google Cloud Project:
   - Go to https://console.cloud.google.com
   - Create new project or select existing
   - Enable Google Analytics Data API

2. Set up OAuth2 credentials:
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Download credentials JSON

3. Get your GA4 Property ID:
   - Go to Google Analytics
   - Admin > Property Settings
   - Copy Property ID (format: 123456789)

4. Set environment variables:
   VITE_GA_PROPERTY_ID=your_property_id
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_GA_CLIENT_ID=your_oauth_client_id

5. Configure Google Analytics:
   - Set up GA4 property
   - Configure OAuth2 authentication
   - Add environment variables

Current Status: Using real GA API calls with OAuth2 authentication
    `;
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService();
export type { GAEnhancedAnalytics, GAMetrics }; 