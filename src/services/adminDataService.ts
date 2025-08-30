import { supabase } from '../config/supabase';

import { googleAnalyticsService, GAEnhancedAnalytics } from './googleAnalyticsService';

// Enhanced interfaces for comprehensive tracking
export interface EnhancedWaitlistEntry {
  id: string;
  name: string;
  email: string;
  mobile_number?: string;
  consent: boolean;
  marketing_consent: boolean;
  referral_code?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  user_agent?: string;
  screen_resolution?: string;
  language?: string;
  timezone?: string;
  browser?: string;
  os?: string;
  device_type?: string;
  is_mobile?: boolean;
  is_tablet?: boolean;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  scroll_depth?: number;
  time_on_page?: number;
  referrer?: string;
  ip_address?: string;
  session_id?: string;
  page_views?: number;
  conversion_funnel_step?: string;
  lead_score?: number;
  engagement_level?: 'low' | 'medium' | 'high';
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface WaitlistAnalytics {
  total: number;
  pending: number;
  contacted: number;
  converted: number;
  declined: number;
  conversionRate: string;
  weeklyData: Array<{
    week: string;
    signups: number;
    conversions: number;
  }>;
  sourceBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
  engagementBreakdown: Record<string, number>;
  timeOfDayBreakdown: Record<string, number>;
  dayOfWeekBreakdown: Record<string, number>;
  recentEntries: EnhancedWaitlistEntry[];
  topReferrers: Array<{ referrer: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
  averageEngagement: number;
  averageTimeOnPage: number;
  averageScrollDepth: number;
}

// Enhanced analytics combining GA and Supabase data
export interface ComprehensiveAnalytics extends WaitlistAnalytics {
  // Google Analytics data
  gaData: {
    totalSessions: number;
    totalUsers: number;
    totalPageViews: number;
    avgBounceRate: number;
    avgSessionDuration: number;
    trafficSources: Record<string, number>;
    topPages: Array<{ page: string; views: number; bounceRate: number }>;
    deviceBreakdown: Record<string, number>;
    countryBreakdown: Record<string, number>;
    cityBreakdown: Array<{ country: string; region: string; city: string; sessions: number }>;
    hourlyData: Record<string, number>;
    dailyData: Record<string, number>;
    conversionFunnel: {
      sessions: number;
      pageViews: number;
      waitlistSignups: number;
      conversionRate: number;
    };
  };
  
  // Enhanced metrics combining GA + Supabase
  enhancedMetrics: {
    gaToWaitlistRatio: number; // How many GA sessions lead to waitlist signups
    waitlistConversionFromGA: number; // Waitlist signups from GA traffic
    avgTimeToSignup: number; // Average time from first visit to signup
    returningUserSignupRate: number; // Signup rate for returning users
    funnelEfficiency: number; // How efficient the conversion funnel is
    trafficQuality: number; // Quality score of incoming traffic
  };
  
  // Real-time data
  realTime: {
    activeUsers: number;
    currentPageViews: number;
    topActivePages: Array<{ page: string; views: number }>;
  };
}

// Admin Data Service - Real CRUD Operations
import { Project } from '../types';

export interface MerchandiseItem {
  id: string;
  title: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'digital';
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
  image: string;
  description: string;
  tags: string[];
  projectId?: string;
  size?: string;
  color?: string;
  material?: string;
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'experience' | 'merchandise' | 'access' | 'digital';
  status: 'available' | 'limited' | 'sold_out';
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  maxQuantity?: number;
  currentQuantity?: number;
  expiryDate?: string;
  requirements?: string[];
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  status: 'active' | 'archived' | 'processing';
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  description?: string;
  tags?: string[];
  duration?: number;
  resolution?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'premium' | 'vip' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phone?: string;
  location?: string;
  totalInvested?: number;
  projectsBacked?: number;
  lastLogin?: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: string;
  status: 'pending' | 'contacted' | 'converted' | 'declined';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
  location?: string;
  device?: string;
  referrer?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

// Mock Data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Pathaan 2',
    type: 'film',
    category: 'Bollywood',
    language: 'Hindi',
    status: 'active',
    fundedPercentage: 85,
    targetAmount: 15000000,
    raisedAmount: 12750000,
    createdAt: '2023-12-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    poster: 'https://m.media-amazon.com/images/M/MV5BOGY4NWNlM2QtMzVjYy00OGY1LWI4N2UtZDNlYWE2ZThjYmRmXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_FMjpg_UX1000_.jpg',
    tags: ['action', 'thriller', 'bollywood'],
    description: 'The sequel to the blockbuster Pathaan',
    genre: 'Action',
    perks: ['Meet & Greet', 'VIP Screening', 'Merchandise'],
    director: 'Siddharth Anand',
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham'],
    rating: 8.5,
    trailer: 'https://www.youtube.com/watch?v=pathaan2',
    keyPeople: [],
    disabled: false
  },
  {
    id: '2',
    title: 'A.R. Rahman: Symphony of India',
    type: 'music',
    category: 'Bollywood',
    language: 'Hindi',
    status: 'active',
    fundedPercentage: 95,
    targetAmount: 5000000,
    raisedAmount: 4750000,
    createdAt: '2023-11-10T08:15:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    poster: 'https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7403ac',
    tags: ['music', 'classical', 'bollywood'],
    description: 'A.R. Rahman\'s latest musical masterpiece',
    genre: 'Classical',
    perks: ['Concert Tickets', 'Signed Album', 'Backstage Pass'],
    rating: 8.8,
    trailer: 'https://www.youtube.com/watch?v=rahman-symphony',
    keyPeople: [],
    disabled: false
  },
  {
    id: '3',
    title: 'Sacred Games 3',
    type: 'webseries',
    category: 'Indian',
    language: 'Hindi',
    status: 'pending',
    fundedPercentage: 45,
    targetAmount: 12000000,
    raisedAmount: 5400000,
    createdAt: '2024-01-05T09:45:00Z',
    updatedAt: '2024-01-25T16:30:00Z',
    poster: 'https://m.media-amazon.com/images/M/MV5BMzRjZWVmMzItNTdmYS00OWEzLTgyOGUtNThiNTU2ZThlYjY0XkEyXkFqcGdeQXVyOTAzMTc2MjA@._V1_FMjpg_UX1000_.jpg',
    tags: ['crime', 'drama', 'thriller'],
    description: 'The final season of the critically acclaimed series',
    genre: 'Crime Drama',
    perks: ['Exclusive Screening', 'Meet Cast', 'Behind the Scenes'],
    director: 'Vikramaditya Motwane',
    cast: ['Saif Ali Khan', 'Nawazuddin Siddiqui'],
    rating: 8.9,
    trailer: 'https://www.youtube.com/watch?v=sacred-games-3',
    keyPeople: [],
    disabled: false
  }
];

const mockMerchandise: MerchandiseItem[] = [
  {
    id: '1',
    title: 'Pathaan 2 Limited Edition T-Shirt',
    category: 'apparel',
    price: 1299,
    stock: 150,
    status: 'in_stock',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    image: '/images/merch/pathaan-tshirt.jpg',
    description: 'Exclusive limited edition t-shirt featuring Pathaan 2 artwork',
    tags: ['limited', 'exclusive', 'apparel'],
    projectId: '1',
    size: 'M, L, XL',
    color: 'Black, Red',
    material: '100% Cotton'
  },
  {
    id: '2',
    title: 'A.R. Rahman Vinyl Record',
    category: 'collectibles',
    price: 2499,
    stock: 50,
    status: 'in_stock',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    image: '/images/merch/rahman-vinyl.jpg',
    description: 'Collector\'s edition vinyl record of Symphony of India',
    tags: ['collector', 'vinyl', 'limited'],
    projectId: '2',
    material: 'Vinyl'
  },
  {
    id: '3',
    title: 'Sacred Games Poster Set',
    category: 'collectibles',
    price: 599,
    stock: 8,
    status: 'low_stock',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    image: '/images/merch/sacred-games-poster.jpg',
    description: 'Exclusive poster set from Sacred Games Season 3',
    tags: ['poster', 'exclusive', 'art'],
    projectId: '3',
    material: 'Premium Paper'
  }
];

const mockPerks: Perk[] = [
  {
    id: '1',
    title: 'Meet & Greet with Shah Rukh Khan',
    description: 'Exclusive meet and greet session with the superstar',
    price: 5000,
    category: 'experience',
    status: 'available',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    projectId: '1',
    maxQuantity: 20,
    currentQuantity: 15,
    expiryDate: '2024-12-31',
    requirements: ['Valid ID', 'Dress Code: Smart Casual']
  },
  {
    id: '2',
    title: 'A.R. Rahman Concert VIP Pass',
    description: 'VIP access to the Symphony of India concert',
    price: 3500,
    category: 'experience',
    status: 'limited',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    projectId: '2',
    maxQuantity: 100,
    currentQuantity: 85,
    expiryDate: '2024-06-30',
    requirements: ['Concert Venue Entry', 'Age: 18+']
  },
  {
    id: '3',
    title: 'Signed Sacred Games Script',
    description: 'Authentic signed script from Sacred Games Season 3',
    price: 1999,
    category: 'merchandise',
    status: 'available',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    projectId: '3',
    maxQuantity: 50,
    currentQuantity: 30,
    expiryDate: '2024-09-30'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'premium',
    status: 'active',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    avatar: '/images/avatars/john-doe.jpg',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    totalInvested: 25000,
    projectsBacked: 5,
    lastLogin: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-08-20T11:15:00Z',
    updatedAt: '2024-01-18T09:30:00Z',
    avatar: '/images/avatars/jane-smith.jpg',
    phone: '+91 98765 43211',
    location: 'Delhi, India',
    totalInvested: 15000,
    projectsBacked: 3,
    lastLogin: '2024-01-18T09:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    role: 'vip',
    status: 'active',
    createdAt: '2023-04-10T08:45:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
    avatar: '/images/avatars/mike-johnson.jpg',
    phone: '+91 98765 43212',
    location: 'Bangalore, India',
    totalInvested: 50000,
    projectsBacked: 8,
    lastLogin: '2024-01-19T16:20:00Z'
  }
];

const mockWaitlistEntries: WaitlistEntry[] = [
  {
    id: '1',
    email: 'alex.smith@email.com',
    name: 'Alex Smith',
    phone: '+91 98765 43213',
    source: 'website',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    location: 'Mumbai, India',
    device: 'Desktop',
    referrer: 'Google Search'
  },
  {
    id: '2',
    email: 'mike.johnson@email.com',
    name: 'Mike Johnson',
    phone: '+91 98765 43214',
    source: 'social_media',
    status: 'contacted',
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    location: 'Delhi, India',
    device: 'Mobile',
    referrer: 'Instagram'
  },
  {
    id: '3',
    email: 'sarah.davis@email.com',
    name: 'Sarah Davis',
    phone: '+91 98765 43215',
    source: 'referral',
    status: 'converted',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    location: 'Bangalore, India',
    device: 'Tablet',
    referrer: 'Friend Referral'
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'CREATE',
    entity: 'project',
    entityId: '4',
    userId: 'admin',
    timestamp: '2024-01-20T14:30:00Z',
    details: { title: 'RRR 2', type: 'film' },
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    action: 'REGISTER',
    entity: 'user',
    entityId: '4',
    userId: 'system',
    timestamp: '2024-01-20T12:15:00Z',
    details: { email: 'john.doe@email.com', name: 'John Doe' },
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    id: '3',
    action: 'UPDATE',
    entity: 'project',
    entityId: '1',
    userId: 'admin',
    timestamp: '2024-01-20T10:45:00Z',
    details: { fundedPercentage: 85, raisedAmount: 12750000 },
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

// Data Service Class
class AdminDataService {
  private projects: Project[] = [...mockProjects];
  private merchandise: MerchandiseItem[] = [...mockMerchandise];
  private perks: Perk[] = [...mockPerks];
  private users: User[] = [...mockUsers];
  private waitlistEntries: WaitlistEntry[] = [...mockWaitlistEntries];
  private activityLogs: ActivityLog[] = [...mockActivityLogs];

  // Enhanced comprehensive analytics with GA integration
  async getComprehensiveAnalytics(): Promise<ComprehensiveAnalytics> {
    try {
      console.log('🔍 getComprehensiveAnalytics called');
      
      // Ensure GA client is initialized (idempotent)
      console.log('🔍 Initializing GA service...');
      await googleAnalyticsService.initialize();
      console.log('🔍 GA service initialized');

      // Get waitlist analytics from Supabase
      console.log('🔍 Getting waitlist analytics...');
      const waitlistAnalytics = await this.getWaitlistAnalytics();
      console.log('🔍 Waitlist analytics received:', { total: waitlistAnalytics.total });
      
      // Get Google Analytics data
      console.log('🔍 Getting GA enhanced analytics...');
      const gaData = await googleAnalyticsService.getEnhancedAnalytics();
      console.log('🔍 GA enhanced analytics received:', { 
        totalSessions: gaData.totalSessions, 
        totalUsers: gaData.totalUsers 
      });
      
      // Get real-time data
      console.log('🔍 Getting real-time data...');
      const realTimeData = await googleAnalyticsService.getRealTimeData();
      console.log('🔍 Real-time data received:', { 
        activeUsers: realTimeData.activeUsers, 
        pageViews: realTimeData.pageViews 
      });
      
      // Calculate enhanced metrics
      const enhancedMetrics = {
        ...gaData.enhancedMetrics,
        funnelEfficiency: this.calculateFunnelEfficiency(waitlistAnalytics, gaData),
        trafficQuality: this.calculateTrafficQuality(waitlistAnalytics, gaData)
      };

      const result = {
        ...waitlistAnalytics,
        gaData: {
          totalSessions: gaData.totalSessions,
          totalUsers: gaData.totalUsers,
          totalPageViews: gaData.totalPageViews,
          avgBounceRate: gaData.avgBounceRate,
          avgSessionDuration: gaData.avgSessionDuration,
          trafficSources: gaData.trafficSources,
          topPages: gaData.topPages,
          deviceBreakdown: gaData.deviceBreakdown,
          countryBreakdown: gaData.countryBreakdown,
          cityBreakdown: gaData.cityBreakdown,
          hourlyData: gaData.hourlyData,
          dailyData: gaData.dailyData,
          conversionFunnel: gaData.conversionFunnel
        },
        enhancedMetrics,
        realTime: {
          activeUsers: realTimeData.activeUsers,
          currentPageViews: realTimeData.pageViews,
          topActivePages: realTimeData.topPages
        }
      };
      
      console.log('🔍 Final comprehensive analytics result:', {
        waitlistTotal: result.total,
        gaSessions: result.gaData.totalSessions,
        gaUsers: result.gaData.totalUsers
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error getting comprehensive analytics:', error);
      throw error;
    }
  }

  // Calculate funnel efficiency
  private calculateFunnelEfficiency(waitlistData: WaitlistAnalytics, gaData: GAEnhancedAnalytics): number {
    const sessions = gaData.totalSessions;
    const signups = waitlistData.total;
    const conversions = waitlistData.converted;
    
    if (sessions === 0) return 0;
    
    // Calculate efficiency based on conversion rates
    const signupRate = (signups / sessions) * 100;
    const conversionRate = (conversions / signups) * 100;
    
    return Math.round((signupRate + conversionRate) / 2);
  }

  // Calculate traffic quality score
  private calculateTrafficQuality(waitlistData: WaitlistAnalytics, gaData: GAEnhancedAnalytics): number {
    const bounceRate = gaData.avgBounceRate;
    const sessionDuration = gaData.avgSessionDuration;
    const engagement = waitlistData.averageEngagement;
    
    // Quality score based on low bounce rate, high session duration, and high engagement
    const bounceScore = Math.max(0, 100 - (bounceRate * 100));
    const durationScore = Math.min(100, (sessionDuration / 300) * 100);
    const engagementScore = Math.min(100, (engagement / 100) * 100);
    
    return Math.round((bounceScore + durationScore + engagementScore) / 3);
  }

  // Enhanced waitlist analytics with real Supabase data
  async getWaitlistAnalytics(): Promise<WaitlistAnalytics> {
    try {
      console.log('🔍 getWaitlistAnalytics called');

      console.log('🔍 Querying Supabase for waitlist data...');
      
      // Get all waitlist entries from Supabase
      const { data: entries, error } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching waitlist data from Supabase:', error);
        throw error;
      }

      console.log('✅ Supabase query successful, entries found:', entries?.length || 0);
      console.log('📊 Sample entry:', entries?.[0]);

      const waitlistEntries = entries || [];
      const total = waitlistEntries.length;

      // Calculate basic metrics
      const contacted = waitlistEntries.filter(entry => entry.source === 'contacted').length;
      const converted = waitlistEntries.filter(entry => entry.source === 'converted').length;
      const declined = waitlistEntries.filter(entry => entry.source === 'declined').length;
      const pending = total - contacted - converted - declined;

      // Calculate conversion rate
      const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0';

      // Weekly data calculation
      const weeklyData = this.calculateWeeklyData(waitlistEntries);

      // Source breakdown
      const sourceBreakdown = this.calculateBreakdown(waitlistEntries, 'source');

      // Device breakdown
      const deviceBreakdown = this.calculateBreakdown(waitlistEntries, 'device_type');

      // Country breakdown
      const countryBreakdown = this.calculateBreakdown(waitlistEntries, 'country');

      // Browser breakdown
      const browserBreakdown = this.calculateBreakdown(waitlistEntries, 'browser');

      // OS breakdown
      const osBreakdown = this.calculateBreakdown(waitlistEntries, 'os');

      // Engagement breakdown
      const engagementBreakdown = this.calculateEngagementBreakdown(waitlistEntries);

      // Time of day breakdown
      const timeOfDayBreakdown = this.calculateTimeOfDayBreakdown(waitlistEntries);

      // Day of week breakdown
      const dayOfWeekBreakdown = this.calculateDayOfWeekBreakdown(waitlistEntries);

      // Top referrers
      const topReferrers = this.calculateTopReferrers(waitlistEntries);

      // Top cities
      const topCities = this.calculateTopCities(waitlistEntries);

      // Average metrics
      const averageEngagement = this.calculateAverageEngagement(waitlistEntries);
      const averageTimeOnPage = this.calculateAverageTimeOnPage(waitlistEntries);
      const averageScrollDepth = this.calculateAverageScrollDepth(waitlistEntries);

      const result = {
        total,
        pending,
        contacted,
        converted,
        declined,
        conversionRate,
        weeklyData,
        sourceBreakdown,
        deviceBreakdown,
        countryBreakdown,
        browserBreakdown,
        osBreakdown,
        engagementBreakdown,
        timeOfDayBreakdown,
        dayOfWeekBreakdown,
        recentEntries: waitlistEntries.slice(0, 50) as EnhancedWaitlistEntry[],
        topReferrers,
        topCities,
        averageEngagement,
        averageTimeOnPage,
        averageScrollDepth
      };

      console.log('📊 Analytics result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error getting waitlist analytics:', error);
      throw error;
    }
  }

  // Helper methods for analytics calculations
  private calculateWeeklyData(entries: EnhancedWaitlistEntry[]): Array<{ week: string; signups: number; conversions: number }> {
    const weeklyData: Record<string, { signups: number; conversions: number }> = {};
    
    entries.forEach(entry => {
      const createdAt = entry.created_at;
      if (!createdAt) return;
      
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return;
      
      const year = date.getFullYear();
      const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { signups: 0, conversions: 0 };
      }
      
      weeklyData[weekKey].signups++;
      
      if (entry.source === 'converted') {
        weeklyData[weekKey].conversions++;
      }
    });

    return Object.entries(weeklyData)
      .map(([week, data]) => ({ week, ...data }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12); // Last 12 weeks
  }

  private calculateBreakdown(entries: EnhancedWaitlistEntry[], field: keyof EnhancedWaitlistEntry): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    entries.forEach(entry => {
      const value = String(entry[field] || 'Unknown');
      breakdown[value] = (breakdown[value] || 0) + 1;
    });

    return breakdown;
  }

  private calculateEngagementBreakdown(entries: EnhancedWaitlistEntry[]): Record<string, number> {
    const breakdown: Record<string, number> = { 'Low': 0, 'Medium': 0, 'High': 0 };
    
    entries.forEach(entry => {
      const timeOnPage = Number(entry.time_on_page) || 0;
      const scrollDepth = Number(entry.scroll_depth) || 0;
      
      let engagement = 'Low';
      if (timeOnPage > 120 && scrollDepth > 50) engagement = 'High';
      else if (timeOnPage > 60 || scrollDepth > 25) engagement = 'Medium';
      
      breakdown[engagement] = (breakdown[engagement] || 0) + 1;
    });

    return breakdown;
  }

  private calculateTimeOfDayBreakdown(entries: EnhancedWaitlistEntry[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    entries.forEach(entry => {
      const createdAt = entry.created_at;
      if (!createdAt) return;
      
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return;
      
      const hour = date.getHours();
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      breakdown[timeSlot] = (breakdown[timeSlot] || 0) + 1;
    });

    return breakdown;
  }

  private calculateDayOfWeekBreakdown(entries: EnhancedWaitlistEntry[]): Record<string, number> {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const breakdown: Record<string, number> = {};
    
    days.forEach(day => breakdown[day] = 0);
    
    entries.forEach(entry => {
      const createdAt = entry.created_at;
      if (!createdAt) return;
      
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return;
      
      const dayIndex = date.getDay();
      const day = days[dayIndex];
      if (day) {
        breakdown[day] = (breakdown[day] || 0) + 1;
      }
    });

    return breakdown;
  }

  private calculateTopReferrers(entries: EnhancedWaitlistEntry[]): Array<{ referrer: string; count: number }> {
    const referrers: Record<string, number> = {};
    
    entries.forEach(entry => {
      const referrer = entry.referrer || 'Direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    return Object.entries(referrers)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateTopCities(entries: EnhancedWaitlistEntry[]): Array<{ city: string; count: number }> {
    const cities: Record<string, number> = {};
    
    entries.forEach(entry => {
      const city = entry.city || 'Unknown';
      cities[city] = (cities[city] || 0) + 1;
    });

    return Object.entries(cities)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateAverageEngagement(entries: EnhancedWaitlistEntry[]): number {
    const total = entries.reduce((sum, entry) => {
      const timeOnPage = Number(entry.time_on_page) || 0;
      const scrollDepth = Number(entry.scroll_depth) || 0;
      return sum + (timeOnPage * 0.5 + scrollDepth * 0.5);
    }, 0);
    
    return entries.length > 0 ? Math.round(total / entries.length) : 0;
  }

  private calculateAverageTimeOnPage(entries: EnhancedWaitlistEntry[]): number {
    const total = entries.reduce((sum, entry) => sum + (Number(entry.time_on_page) || 0), 0);
    return entries.length > 0 ? Math.round(total / entries.length) : 0;
  }

  private calculateAverageScrollDepth(entries: EnhancedWaitlistEntry[]): number {
    const total = entries.reduce((sum, entry) => sum + (Number(entry.scroll_depth) || 0), 0);
    return entries.length > 0 ? Math.round(total / entries.length) : 0;
  }

  // Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    await this.simulateDelay();
    return [...this.activityLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Utility Methods
  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  }

  // Export Data
  async exportData(type: string): Promise<string> {
    await this.simulateDelay();
    let data;
    switch (type) {
      case 'projects':
        data = this.projects;
        break;
      case 'merchandise':
        data = this.merchandise;
        break;
      case 'perks':
        data = this.perks;
        break;
      case 'users':
        data = this.users;
        break;
      case 'waitlist':
        data = this.waitlistEntries;
        break;
      case 'activity':
        data = this.activityLogs;
        break;
      default:
        throw new Error('Invalid export type');
    }
    
    return JSON.stringify(data, null, 2);
  }

  // Mock data for other entities (keeping existing functionality)
  async getProjects(): Promise<Project[]> {
    return mockProjects;
  }

  async getMerchandise(): Promise<MerchandiseItem[]> {
    return mockMerchandise;
  }

  async getPerks(): Promise<Perk[]> {
    return mockPerks;
  }

  async getUsers(): Promise<User[]> {
    return mockUsers;
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProject: Project = {
        ...mockProjects[index]!,
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      mockProjects[index] = updatedProject;
      return updatedProject;
    }
    return null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const adminDataService = new AdminDataService(); 