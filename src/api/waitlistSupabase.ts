// 🚀 Supabase-powered Waitlist API
// @description Handles waitlist signups with Supabase database integration

import { supabase } from '../config/supabase';
import type { WaitlistSignup } from '../lib/supabase';

// 🛡️ Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};



// 🚀 Enhanced Waitlist Handler with Supabase
export const handleWaitlistSignup = async (data: {
  name: string;
  email: string;
  phoneNumber?: string;
  consent: boolean;
  marketingConsent: boolean;
  source?: string;
  deviceInfo?: any;
  ipInfo?: any;
}) => {
  try {
    // 🛡️ Validation
    if (!validateName(data.name)) {
      throw new Error('Invalid name. Must be between 2 and 100 characters.');
    }
    
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email address.');
    }

    // 🚀 Check for duplicate email in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_signups')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error('Supabase error checking email:', checkError);
      // Continue without duplicate check due to error
      console.warn('Continuing without duplicate email check due to error:', checkError.message);
    } else if (existingUser) {
      throw new Error('Email already registered. Check your inbox for confirmation.');
    }

    // 🚀 Prepare signup data for Supabase
    const signupData: WaitlistSignup = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone_number: data.phoneNumber?.trim() || null,
      consent: data.consent,
      marketing_consent: data.marketingConsent,
      source: data.source || 'direct',
      status: 'pending',
      priority: 'normal',
      
      // Device information
      device_type: data.deviceInfo?.deviceType || 'desktop',
      device_name: data.deviceInfo?.deviceName,
      device_model: data.deviceInfo?.deviceModel,
      device_manufacturer: data.deviceInfo?.deviceManufacturer,
      is_mobile: data.deviceInfo?.deviceType === 'mobile',
      is_tablet: data.deviceInfo?.deviceType === 'tablet',
      is_desktop: data.deviceInfo?.deviceType === 'desktop',
      
      // Browser and OS information
      browser: data.deviceInfo?.browser,
      browser_version: data.deviceInfo?.browserVersion,
      os: data.deviceInfo?.os,
      os_version: data.deviceInfo?.osVersion,
      user_agent: data.deviceInfo?.userAgent,
      
      // Screen and display information
      screen_resolution: data.deviceInfo?.screenResolution,
      viewport_width: data.deviceInfo?.viewportWidth,
      viewport_height: data.deviceInfo?.viewportHeight,
      color_depth: data.deviceInfo?.colorDepth,
      pixel_ratio: data.deviceInfo?.pixelRatio,
      
      // Device capabilities
      touch_support: data.deviceInfo?.touchSupport,
      webgl_support: data.deviceInfo?.webglSupport,
      cookie_enabled: data.deviceInfo?.cookieEnabled,
      do_not_track: data.deviceInfo?.doNotTrack,
      javascript_enabled: data.deviceInfo?.javascriptEnabled,
      
      // Performance metrics
      page_load_time: data.deviceInfo?.pageLoadTime,
      network_speed: data.deviceInfo?.networkSpeed,
      connection_type: data.deviceInfo?.connectionType,
      
      // Hardware information
      cpu_cores: data.deviceInfo?.cpuCores,
      memory_gb: data.deviceInfo?.memoryGb,
      
      // Location and language
      language: data.deviceInfo?.language,
      timezone: data.deviceInfo?.timezone,
      
      // Session information
      session_id: data.deviceInfo?.sessionId,
      landing_page: data.deviceInfo?.landingPage,
      referrer: data.deviceInfo?.referrer,
      
      // IP and location information
      ip_address: data.ipInfo?.ip,
      country: data.ipInfo?.country,
      city: data.ipInfo?.city,
      state: data.ipInfo?.state,
      latitude: data.ipInfo?.latitude,
      longitude: data.ipInfo?.longitude,
      isp: data.ipInfo?.isp,
      organization: data.ipInfo?.organization,
      as_number: data.ipInfo?.asNumber,
      
      // Security and privacy
      ad_blocker_detected: data.deviceInfo?.adBlockerDetected,
      proxy_detected: data.deviceInfo?.proxyDetected,
      vpn_detected: data.deviceInfo?.vpnDetected,
      tor_detected: data.deviceInfo?.torDetected,
      bot_detected: data.deviceInfo?.botDetected,
      
      // Plugin information
      flash_enabled: data.deviceInfo?.flashEnabled,
      java_enabled: data.deviceInfo?.javaEnabled,
      silverlight_enabled: data.deviceInfo?.silverlightEnabled,
      pdf_viewer: data.deviceInfo?.pdfViewer,
      quicktime_enabled: data.deviceInfo?.quicktimeEnabled,
      realplayer_enabled: data.deviceInfo?.realplayerEnabled,
      windowsmedia_enabled: data.deviceInfo?.windowsmediaEnabled,
      vlc_enabled: data.deviceInfo?.vlcEnabled,
      shockwave_enabled: data.deviceInfo?.shockwaveEnabled,
      activex_enabled: data.deviceInfo?.activexEnabled,
      vbs_enabled: data.deviceInfo?.vbsEnabled,
      vb_enabled: data.deviceInfo?.vbEnabled,
      perl_enabled: data.deviceInfo?.perlEnabled,
      python_enabled: data.deviceInfo?.pythonEnabled,
      ruby_enabled: data.deviceInfo?.rubyEnabled,
      php_enabled: data.deviceInfo?.phpEnabled,
      asp_enabled: data.deviceInfo?.aspEnabled,
      jsp_enabled: data.deviceInfo?.jspEnabled,
      coldfusion_enabled: data.deviceInfo?.coldfusionEnabled,
      cgi_enabled: data.deviceInfo?.cgiEnabled,
      
      // Default values for security
      fraud_score: 0,
      risk_level: 'low'
    };

    // 🚀 Save to Supabase
    const { data: result, error: insertError } = await supabase
      .from('waitlist_signups')
      .insert([signupData])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }





    // 🚀 Return success response
    return {
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: result.id,
        name: signupData.name,
        email: signupData.email,
        position: result.id,
        totalMembers: result.id,
        estimatedAccess: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

  } catch (error) {
    console.error('Waitlist signup error:', error);
    throw error;
  }
};

// 🚀 Analytics Data Retrieval from Supabase
// REMOVED: Unused export (getWaitlistAnalytics)

// REMOVED: Unused export (exportWaitlistData) 