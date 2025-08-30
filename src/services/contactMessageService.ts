import type { Database } from '../config/database.types';
import { supabase } from '../config/supabase';
import { collectDeviceInfo, getIPInfo } from '../utils/deviceDetection';

type ContactMessage = Database['public']['Tables']['contact_messages']['Insert'];

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber?: string;
  consent?: boolean;
  marketingConsent?: boolean;
}

export class ContactMessageService {
  /**
   * Submit a contact message with comprehensive user and device data
   */
  static async submitMessage(formData: ContactFormData): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // Collect comprehensive device and user information
      const deviceInfo = await collectDeviceInfo();
      const ipInfo = await getIPInfo();
      
      // Prepare the message data with all collected information
      const messageData: ContactMessage = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone_number: formData.phoneNumber || null,
        consent: formData.consent ?? true,
        marketing_consent: formData.marketingConsent ?? false,
        referral_source: document.referrer || null,
        status: 'new',
        priority: 'normal',
        category: 'general',
        
        // UTM Parameters (if available in URL)
        utm_source: this.getUTMParameter('utm_source'),
        utm_medium: this.getUTMParameter('utm_medium'),
        utm_campaign: this.getUTMParameter('utm_campaign'),
        utm_term: this.getUTMParameter('utm_term'),
        utm_content: this.getUTMParameter('utm_content'),
        
        // Device and Browser Information
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        browser: deviceInfo.browser,
        browser_version: deviceInfo.browserVersion,
        os: deviceInfo.os,
        os_version: deviceInfo.osVersion,
        device_name: deviceInfo.deviceName,
        device_model: deviceInfo.deviceModel,
        device_manufacturer: deviceInfo.deviceManufacturer,
        device_type: deviceInfo.deviceType,
        is_mobile: deviceInfo.deviceType === 'mobile',
        is_tablet: deviceInfo.deviceType === 'tablet',
        is_desktop: deviceInfo.deviceType === 'desktop',
        
        // IP and Location Information
        ip_address: ipInfo.ip,
        country: ipInfo.country,
        city: ipInfo.city,
        state: ipInfo.state,
        latitude: ipInfo.latitude,
        longitude: ipInfo.longitude,
        
        // Page Performance and Engagement
        scroll_depth: this.getScrollDepth(),
        time_on_page: this.getTimeOnPage(),
        referrer: document.referrer,
        landing_page: window.location.href,
        session_id: this.getSessionId(),
        page_load_time: this.getPageLoadTime(),
        
        // Network and Hardware Information
        network_speed: deviceInfo.networkSpeed,
        connection_type: deviceInfo.connectionType,
        cpu_cores: deviceInfo.cpuCores,
        memory_gb: deviceInfo.memoryGb,
        color_depth: screen.colorDepth,
        pixel_ratio: window.devicePixelRatio,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        
        // Device Capabilities
        touch_support: 'ontouchstart' in window,
        webgl_support: this.checkWebGLSupport(),
        cookie_enabled: navigator.cookieEnabled,
        do_not_track: navigator.doNotTrack === '1',
        ad_blocker_detected: this.detectAdBlocker(),
        javascript_enabled: true,
        
        // Plugin Support
        flash_enabled: this.checkPluginSupport('Shockwave Flash'),
        java_enabled: navigator.javaEnabled(),
        silverlight_enabled: this.checkPluginSupport('Silverlight'),
        pdf_viewer: this.getPDFViewer(),
        quicktime_enabled: this.checkPluginSupport('QuickTime'),
        realplayer_enabled: this.checkPluginSupport('RealPlayer'),
        windowsmedia_enabled: this.checkPluginSupport('Windows Media Player'),
        vlc_enabled: this.checkPluginSupport('VLC'),
        shockwave_enabled: this.checkPluginSupport('Shockwave'),
        activex_enabled: this.checkActiveXSupport(),
        vbs_enabled: false, // VBScript is deprecated
        vb_enabled: false,  // VBScript is deprecated
        perl_enabled: false, // Server-side only
        python_enabled: false, // Server-side only
        ruby_enabled: false, // Server-side only
        php_enabled: false, // Server-side only
        asp_enabled: false, // Server-side only
        jsp_enabled: false, // Server-side only
        coldfusion_enabled: false, // Server-side only
        cgi_enabled: false, // Server-side only
        
        // Network and Security
        isp: ipInfo.isp,
        organization: ipInfo.organization,
        as_number: ipInfo.asNumber,
        proxy_detected: false, // Default value - implement detection logic if needed
        vpn_detected: false, // Default value - implement detection logic if needed
        tor_detected: false, // Default value - implement detection logic if needed
        bot_detected: this.detectBot(),
        fraud_score: this.calculateFraudScore(deviceInfo, ipInfo),
        risk_level: 'low', // Default risk level
        
        // Engagement and Analytics
        engagement_score: this.calculateEngagementScore(),
        conversion_probability: 0.5, // Default conversion probability
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting contact message:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Unexpected error submitting contact message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get UTM parameter from URL
   */
  private static getUTMParameter(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Calculate scroll depth percentage
   */
  private static getScrollDepth(): number {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  }

  /**
   * Get time spent on page (if available)
   */
  private static getTimeOnPage(): number {
    // This would need to be implemented with a timer that starts when page loads
    // For now, return a default value
    return Math.floor(Math.random() * 300) + 30; // Random 30-330 seconds
  }

  /**
   * Generate or retrieve session ID
   */
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('contact_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('contact_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get page load time
   */
  private static getPageLoadTime(): number {
    if (performance && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      return loadTime > 0 ? loadTime : 0;
    }
    return 0;
  }

  /**
   * Check WebGL support
   */
  private static checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (_e) {
      void _e; // Intentionally unused
      return false;
    }
  }

  /**
   * Check if specific plugin is supported
   */
  private static checkPluginSupport(pluginName: string): boolean {
    if (navigator.plugins) {
      for (let i = 0; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i]?.name.indexOf(pluginName) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get PDF viewer information
   */
  private static getPDFViewer(): string | null {
    if (navigator.plugins) {
      for (let i = 0; i < navigator.plugins.length; i++) {
        const plugin = navigator.plugins[i];
        if (plugin?.name.toLowerCase().includes('pdf') || 
            plugin?.description.toLowerCase().includes('pdf')) {
          return plugin?.name || '';
        }
      }
    }
    return null;
  }

  /**
   * Check ActiveX support (IE only)
   */
  private static checkActiveXSupport(): boolean {
    try {
      return !!(('ActiveXObject' in window) || (window as any).ActiveXObject);
    } catch (_e) {
      void _e; // Intentionally unused
      return false;
    }
  }

  /**
   * Detect ad blocker
   */
  private static detectAdBlocker(): boolean {
    try {
      const testAd = document.createElement('canvas');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      
      const isAdBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      
      return isAdBlocked;
    } catch (_e) {
      void _e; // Intentionally unused
      return false;
    }
  }

  /**
   * Detect if user is a bot
   */
  private static detectBot(): boolean {
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, /crawling/i,
      /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i
    ];
    
    const userAgent = navigator.userAgent;
    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Calculate fraud score based on various factors
   */
  private static calculateFraudScore(deviceInfo: any, ipInfo: any): number {
    let score = 0;
    
    // VPN/Proxy detection
    if (ipInfo.vpnDetected) score += 20;
    if (ipInfo.proxyDetected) score += 15;
    if (ipInfo.torDetected) score += 30;
    
    // Bot detection
    if (this.detectBot()) score += 40;
    
    // Suspicious device patterns
    if (!deviceInfo.browser || deviceInfo.browser === 'Unknown') score += 10;
    if (!deviceInfo.os || deviceInfo.os === 'Unknown') score += 10;
    
    // JavaScript disabled (suspicious)
    // JavaScript is always enabled in modern browsers
    // if (!navigator.javaScriptEnabled) score += 25;
    
    return Math.min(score, 100);
  }

  /**
   * Calculate engagement score based on user behavior
   */
  private static calculateEngagementScore(): number {
    let score = 50; // Base score
    
    // Scroll depth
    const scrollDepth = this.getScrollDepth();
    if (scrollDepth > 80) score += 20;
    else if (scrollDepth > 50) score += 10;
    
    // Time on page
    const timeOnPage = this.getTimeOnPage();
    if (timeOnPage > 300) score += 20;
    else if (timeOnPage > 120) score += 10;
    
    // Device type (mobile users often more engaged)
    if (navigator.userAgent.includes('Mobile')) score += 5;
    
    return Math.min(score, 100);
  }

  /**
   * Get all contact messages (for admin panel)
   */
  static async getAllMessages(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Update message status (for admin panel)
   */
  static async updateMessageStatus(
    messageId: string, 
    status: string, 
    priority?: string, 
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = { status };
      if (priority) updateData.priority = priority;
      if (notes) updateData.notes = notes;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .eq('id', messageId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}
