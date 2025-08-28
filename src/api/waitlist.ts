// 🚀 AI Waitlist API Endpoint
// Handles waitlist signups with comprehensive data collection and analytics

// 🛡️ Type definitions
interface WaitlistSignup {
  id?: string;
  name: string;
  email: string;
  referralCode?: string;
  consent: boolean;
  marketingConsent: boolean;
  metadata: {
    timestamp: string;
    userAgent: string;
    screenResolution: string;
    language: string;
    timezone: string;
    referrer: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    isMobile: boolean;
    isTablet: boolean;
    browser: string;
    os: string;
    location?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
  submissionTime: string;
}

interface AnalyticsData {
  totalSignups: number;
  dailySignups: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
  referralSources: Array<{ source: string; count: number; percentage: number }>;
  scrollDepthData: Array<{ depth: string; count: number; percentage: number }>;
  timeOnPageData: Array<{ duration: string; count: number; percentage: number }>;
  utmCampaigns: Array<{ campaign: string; count: number; conversionRate: number }>;
  recentSignups: Array<{
    id: string;
    name: string;
    email: string;
    timestamp: string;
    source: string;
    location: string;
    device: string;
  }>;
}

// 🚀 In-memory storage (replace with actual database in production)
const waitlistData: WaitlistSignup[] = [];

// 🚀 Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

const validateConsent = (consent: boolean): boolean => {
  return consent === true;
};

// 🚀 Analytics tracking functions
const trackGoogleAnalytics = (data: WaitlistSignup) => {
  // Google Analytics 4 event tracking
  if (typeof window !== 'undefined' && (window as Window & { gtag?: (command: string, eventName: string, params: Record<string, unknown>) => void }).gtag) {
    (window as Window & { gtag?: (command: string, eventName: string, params: Record<string, unknown>) => void }).gtag!('event', 'waitlist_signup', {
      event_category: 'engagement',
      event_label: 'waitlist_form',
      value: 1,
      custom_parameters: {
        user_type: 'founding_member',
        referral_source: data.metadata.utmSource || 'direct',
        campaign: data.metadata.utmCampaign || 'none',
        device_type: data.metadata.isMobile ? 'mobile' : 'desktop',
        browser: data.metadata.browser,
        os: data.metadata.os
      }
    });
  }
};

const trackMixpanel = (data: WaitlistSignup) => {
  // Mixpanel event tracking
  if (typeof window !== 'undefined' && (window as any).mixpanel) {
    (window as any).mixpanel.track('Waitlist Signup', {
      email: data.email,
      name: data.name,
      referralCode: data.referralCode,
      source: data.metadata.utmSource || 'direct',
      medium: data.metadata.utmMedium || 'none',
      campaign: data.metadata.utmCampaign || 'none',
      device: data.metadata.isMobile ? 'mobile' : 'desktop',
      browser: data.metadata.browser,
      os: data.metadata.os,
      location: data.metadata.location ? `${data.metadata.location.latitude},${data.metadata.location.longitude}` : null,
      timestamp: data.submissionTime
    });
  }
};

// 🚀 Email notification functions
const sendWelcomeEmail = async (_data: WaitlistSignup) => {
  try {
    // SendGrid or similar email service integration
    // const emailData = {
    //   to: data.email,
    //   from: 'noreply@circles.ai',
    //   subject: 'Welcome to the AI Entertainment Revolution! 🚀',
    //   template: 'waitlist-welcome',
    //   dynamic_template_data: {
    //     name: data.name,
    //     signup_date: new Date(data.submissionTime).toLocaleDateString(),
    //     referral_code: data.referralCode || null,
    //     total_members: waitlistData.length,
    //     position: waitlistData.length
    //   }
    // };

    // Example SendGrid API call
    // await sgMail.send(emailData);
    
    // Welcome email sent to: ${data.email}
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

const sendAdminNotification = async (_data: WaitlistSignup) => {
  try {
    // const adminEmailData = {
    //   to: 'admin@circles.ai',
    //   from: 'noreply@circles.ai',
    //   subject: `New Waitlist Signup: ${data.name}`,
    //   template: 'admin-notification',
    //   dynamic_template_data: {
    //     name: data.name,
    //     email: data.email,
    //     referral_code: data.referralCode || 'None',
    //     source: data.metadata.utmSource || 'Direct',
    //     campaign: data.metadata.utmCampaign || 'None',
    //     device: data.metadata.isMobile ? 'Mobile' : 'Desktop',
    //     location: data.metadata.location ? `${data.metadata.location.latitude},${data.metadata.location.longitude}` : 'Unknown',
    //     total_signups: waitlistData.length
    //   }
    // };

    // Example SendGrid API call
    // await sgMail.send(adminEmailData);
    
    // Admin notification sent
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
};

// 🚀 Database operations (replace with actual database calls)
const saveToDatabase = async (data: WaitlistSignup): Promise<string> => {
  try {
    // Example database operations
    // const result = await db.collection('waitlist').insertOne({
    //   ...data,
    //   createdAt: new Date(),
    //   status: 'active'
    // });
    
    // For now, use in-memory storage
    const id = `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    waitlistData.push({
      ...data,
      id
    });
    
    return id;
  } catch (error) {
    console.error('Database save error:', error);
    throw new Error('Failed to save signup data');
  }
};

const getAnalyticsData = (): AnalyticsData => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate daily signups
  const dailySignups = waitlistData.filter(
    signup => new Date(signup.submissionTime) > oneDayAgo
  ).length;

  // Calculate growth rates
  const weeklySignups = waitlistData.filter(
    signup => new Date(signup.submissionTime) > oneWeekAgo
  ).length;
  
  const monthlySignups = waitlistData.filter(
    signup => new Date(signup.submissionTime) > oneMonthAgo
  ).length;

  const weeklyGrowth = weeklySignups > 0 ? ((dailySignups / weeklySignups) * 100) : 0;
  const monthlyGrowth = monthlySignups > 0 ? ((dailySignups / monthlySignups) * 100) : 0;

  // Calculate geographic distribution
  const countryCounts: { [key: string]: number } = {};
  waitlistData.forEach(() => {
    // This would normally use a geolocation service
    const country = 'Unknown'; // Replace with actual geolocation
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({
      country,
      count,
      percentage: (count / waitlistData.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate device breakdown
  const deviceCounts: { [key: string]: number } = {};
  waitlistData.forEach(signup => {
    const device = signup.metadata.isMobile ? 'Mobile' : 
                   signup.metadata.isTablet ? 'Tablet' : 'Desktop';
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  const deviceBreakdown = Object.entries(deviceCounts)
    .map(([device, count]) => ({
      device,
      count,
      percentage: (count / waitlistData.length) * 100
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate browser breakdown
  const browserCounts: { [key: string]: number } = {};
  waitlistData.forEach(signup => {
    const browser = signup.metadata.browser;
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });

  const browserBreakdown = Object.entries(browserCounts)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: (count / waitlistData.length) * 100
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate referral sources
  const sourceCounts: { [key: string]: number } = {};
  waitlistData.forEach(signup => {
    const source = signup.metadata.utmSource || 'Direct';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  const referralSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source,
      count,
      percentage: (count / waitlistData.length) * 100
    }))
    .sort((a, b) => b.count - a.count);

  // Get recent signups
  const recentSignups = waitlistData
    .sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime())
    .slice(0, 10)
    .map(signup => ({
      id: signup.id || 'unknown',
      name: signup.name,
      email: signup.email,
      timestamp: signup.submissionTime,
      source: signup.metadata.utmSource || 'Direct',
      location: signup.metadata.location ? `${signup.metadata.location.latitude},${signup.metadata.location.longitude}` : 'Unknown',
      device: signup.metadata.isMobile ? 'Mobile' : 'Desktop'
    }));

  return {
    totalSignups: waitlistData.length,
    dailySignups,
    weeklyGrowth,
    monthlyGrowth,
    topCountries,
    deviceBreakdown,
    browserBreakdown,
    referralSources,
    scrollDepthData: [], // Would be calculated from actual scroll tracking
    timeOnPageData: [], // Would be calculated from actual time tracking
    utmCampaigns: [], // Would be calculated from UTM parameters
    recentSignups
  };
};

// 🚀 Main API handler - This would be implemented in your backend
// For now, this serves as a reference for the API structure
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

    // Check for duplicate email
    const existingSignup = waitlistData.find(
      signup => signup.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existingSignup) {
      throw new Error('Email already registered on the waitlist.');
    }

    // 🚀 Save to database
    const signupId = await saveToDatabase(data);

    // 🚀 Track analytics
    trackGoogleAnalytics(data);
    trackMixpanel(data);

    // 🚀 Send notifications
    await sendWelcomeEmail(data);
    await sendAdminNotification(data);

    // 🚀 Success response
    return {
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: signupId,
        name: data.name,
        email: data.email,
        position: waitlistData.length,
        totalMembers: waitlistData.length,
        estimatedAccess: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }
    };

  } catch (error) {
    console.error('Waitlist signup error:', error);
    throw error;
  }
};

export const getWaitlistAnalytics = () => {
  try {
    // Return analytics data
    const analyticsData = getAnalyticsData();
    return analyticsData;
  } catch (error) {
    console.error('Analytics fetch error:', error);
    throw new Error('Failed to fetch analytics data.');
  }
};

// 🚀 Export types for use in frontend
export type { WaitlistSignup, AnalyticsData }; 