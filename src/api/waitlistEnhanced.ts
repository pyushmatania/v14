// 🚀 Enhanced Waitlist API - Comprehensive data collection and analytics integration
// @description Handles waitlist signups with analytics, email integration, and data storage

import analytics from '../services/analytics';

// 🛡️ Type definitions
interface WaitlistSignup {
  id?: string;
  name: string;
  email: string;
  consent: boolean;
  referralCode?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceInfo?: Record<string, unknown>;
  location?: Record<string, unknown>;
  timestamp?: number;
}

interface AnalyticsData {
  totalSignups: number;
  dailySignups: number;
  weeklySignups: number;
  monthlySignups: number;
  topSources: Array<{ source: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  averageScrollDepth: number;
  averageTimeOnPage: number;
  conversionRate: number;
  utmPerformance: Array<{ utm: string; signups: number; conversionRate: number }>;
}



// 🚀 In-memory storage (replace with real database in production)
const waitlistData: WaitlistSignup[] = [];
const analyticsEvents: Record<string, unknown>[] = [];

// 🚀 Email Service Integration (SendGrid/Mailchimp)
class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SENDGRID_API_KEY || '';
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@circles.com';
    this.fromName = import.meta.env.VITE_FROM_NAME || 'Circles Team';
  }

  async sendWelcomeEmail(signup: WaitlistSignup): Promise<boolean> {
    try {
      // const template = this.getWelcomeEmailTemplate(signup);
      
      // SendGrid API call
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: signup.email, name: signup.name }],
            dynamic_template_data: {
              name: signup.name,
              position: waitlistData.length,
              totalMembers: waitlistData.length,
              estimatedAccess: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              referralLink: `https://circles.com/waitlist?ref=${signup.id}`
            }
          }],
          from: { email: this.fromEmail, name: this.fromName },
          template_id: import.meta.env.VITE_WELCOME_EMAIL_TEMPLATE_ID || 'd-welcome-template-id'
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  async sendAdminNotification(signup: WaitlistSignup): Promise<boolean> {
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@circles.com';
      
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: adminEmail }],
            dynamic_template_data: {
              newSignup: signup,
              totalSignups: waitlistData.length,
              source: signup.source || 'direct',
              timestamp: new Date().toISOString()
            }
          }],
          from: { email: this.fromEmail, name: this.fromName },
          template_id: import.meta.env.VITE_ADMIN_NOTIFICATION_TEMPLATE_ID || 'd-admin-template-id'
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Admin notification error:', error);
      return false;
    }
  }


}

// 🚀 Data Validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100;
};

const validateConsent = (consent: boolean): boolean => {
  return consent === true;
};

// 🚀 Analytics Integration
const trackWaitlistEvent = (event: string, properties: Record<string, unknown>) => {
  analytics.trackEvent({
    event,
    properties: {
      ...properties,
      timestamp: Date.now()
    }
  });
};

// 🚀 Enhanced Waitlist Handler
export const handleWaitlistSignup = async (data: WaitlistSignup) => {
  try {
    // 🛡️ Validation
    if (!validateName(data.name)) {
      throw new Error('Invalid name. Must be between 2 and 100 characters.');
    }
    
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email address.');
    }
    
    if (!validateConsent(data.consent)) {
      throw new Error('Consent is required to join the waitlist.');
    }

    // 🚀 Check for duplicate email
    const existingSignup = waitlistData.find(signup => signup.email.toLowerCase() === data.email.toLowerCase());
    if (existingSignup) {
      trackWaitlistEvent('waitlist_duplicate_signup', {
        email: data.email,
        existingId: existingSignup.id
      });
      throw new Error('Email already registered. Check your inbox for confirmation.');
    }

    // 🚀 Create signup record
    const signupId = crypto.randomUUID();
    const timestamp = Date.now();
    
    const signupRecord: WaitlistSignup = {
      id: signupId,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      consent: data.consent,
      referralCode: data.referralCode,
      source: data.source || 'direct',
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      deviceInfo: data.deviceInfo,
      location: data.location,
      timestamp
    };

    // 🚀 Save to storage
    waitlistData.push(signupRecord);

    // 🚀 Track analytics
    const analyticsData = analytics.trackWaitlistSignup(
      signupRecord.email,
      signupRecord.name,
      signupRecord.source || 'direct'
    );

    // 🚀 Track custom event
    trackWaitlistEvent('waitlist_signup_success', {
      signupId,
      email: signupRecord.email,
      name: signupRecord.name,
      source: signupRecord.source,
      position: waitlistData.length,
      totalMembers: waitlistData.length,
      referralCode: signupRecord.referralCode,
      utmSource: signupRecord.utmSource,
      utmMedium: signupRecord.utmMedium,
      utmCampaign: signupRecord.utmCampaign
    });

    // 🚀 Send emails
    const emailService = new EmailService();
    const welcomeEmailSent = await emailService.sendWelcomeEmail(signupRecord);
    const adminNotificationSent = await emailService.sendAdminNotification(signupRecord);

    // 🚀 Track email events
    if (welcomeEmailSent) {
      trackWaitlistEvent('welcome_email_sent', { signupId, email: signupRecord.email });
    }
    if (adminNotificationSent) {
      trackWaitlistEvent('admin_notification_sent', { signupId });
    }

    // 🚀 Return success response
    return {
      success: true,
      message: 'Successfully joined the founding member waitlist!',
      data: {
        id: signupId,
        name: signupRecord.name,
        email: signupRecord.email,
        position: waitlistData.length,
        totalMembers: waitlistData.length,
        estimatedAccess: new Date(timestamp + 30 * 24 * 60 * 60 * 1000).toISOString(),
        referralLink: `https://circles.com/waitlist?ref=${signupId}`,
        analyticsData
      }
    };

  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    // Track error
    trackWaitlistEvent('waitlist_signup_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: data.email,
      source: data.source
    });

    throw error;
  }
};

// 🚀 Analytics Data Retrieval
export const getWaitlistAnalytics = (): AnalyticsData => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  // Calculate time-based metrics
  const dailySignups = waitlistData.filter(s => s.timestamp && (now - s.timestamp) <= oneDay).length;
  const weeklySignups = waitlistData.filter(s => s.timestamp && (now - s.timestamp) <= oneWeek).length;
  const monthlySignups = waitlistData.filter(s => s.timestamp && (now - s.timestamp) <= oneMonth).length;

  // Calculate source breakdown
  const sourceCounts: Record<string, number> = {};
  waitlistData.forEach(signup => {
    const source = signup.source || 'direct';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate device breakdown
  const deviceCounts = new Map<string, number>();
  waitlistData.forEach(signup => {
    const device = (signup.deviceInfo?.deviceType || 'unknown') as string;
    deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
  });
  const deviceBreakdown = Array.from(deviceCounts.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate browser breakdown
  const browserCounts = new Map<string, number>();
  waitlistData.forEach(signup => {
    const browser = (signup.deviceInfo?.browser || 'unknown') as string;
    browserCounts.set(browser, (browserCounts.get(browser) || 0) + 1);
  });
  const browserBreakdown = Array.from(browserCounts.entries())
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate location breakdown
  const countryCounts = new Map<string, number>();
  waitlistData.forEach(signup => {
    const country = (signup.location?.country || 'unknown') as string;
    countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
  });
  const topCountries = Array.from(countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate UTM performance
  const utmPerformance: Array<{ utm: string; signups: number; conversionRate: number }> = [];
  const utmSources = [...new Set(waitlistData.map(s => s.utmSource).filter(Boolean))];
  
  utmSources.forEach(utmSource => {
    if (!utmSource) return;
    const signups = waitlistData.filter(s => s.utmSource === utmSource).length;
    const totalVisits = analyticsEvents.filter(e => (e as any).properties?.utmSource === utmSource).length;
    const conversionRate = totalVisits > 0 ? (signups / totalVisits) * 100 : 0;
    
    utmPerformance.push({
      utm: utmSource,
      signups,
      conversionRate: Math.round(conversionRate * 100) / 100
    });
  });

  return {
    totalSignups: waitlistData.length,
    dailySignups,
    weeklySignups,
    monthlySignups,
    topSources,
    topCountries,
    deviceBreakdown,
    browserBreakdown,
    averageScrollDepth: 75, // Mock data - replace with real calculation
    averageTimeOnPage: 120, // Mock data - replace with real calculation
    conversionRate: 25, // Mock data - replace with real calculation
    utmPerformance: utmPerformance.sort((a, b) => b.signups - a.signups)
  };
};

// 🚀 Export waitlist data for admin dashboard
export const exportWaitlistData = (): string => {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Source',
    'Referral Code',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Device Type',
    'Browser',
    'Country',
    'Timestamp',
    'Position'
  ];

  const rows = waitlistData.map((signup, index) => [
    signup.id,
    signup.name,
    signup.email,
    signup.source || 'direct',
    signup.referralCode || '',
    signup.utmSource || '',
    signup.utmMedium || '',
    signup.utmCampaign || '',
    signup.deviceInfo?.deviceType || 'unknown',
    signup.deviceInfo?.browser || 'unknown',
    signup.location?.country || 'unknown',
    signup.timestamp ? new Date(signup.timestamp).toISOString() : '',
    index + 1
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

// 🚀 Get waitlist statistics
export const getWaitlistStats = () => {
  return {
    total: waitlistData.length,
    today: waitlistData.filter(s => s.timestamp && (Date.now() - s.timestamp) <= 24 * 60 * 60 * 1000).length,
    thisWeek: waitlistData.filter(s => s.timestamp && (Date.now() - s.timestamp) <= 7 * 24 * 60 * 60 * 1000).length,
    thisMonth: waitlistData.filter(s => s.timestamp && (Date.now() - s.timestamp) <= 30 * 24 * 60 * 60 * 1000).length,
    topSource: waitlistData.reduce((acc, signup) => {
      const source = signup.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}; 