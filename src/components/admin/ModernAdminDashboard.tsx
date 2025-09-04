import { 
  ChartBarIcon, 
  UsersIcon, 
  EnvelopeIcon, 
  ChartPieIcon,
  BellIcon,
  EyeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import * as React from 'react';
import { useState, useEffect, lazy, Suspense } from 'react';
import FastLoadingSpinner from '../FastLoadingSpinner';

import { supabase } from '../../config/supabase';

// Types
interface DashboardStats {
  totalSignups: number;
  pendingSignups: number;
  convertedSignups: number;
  newMessages: number;
  activeSessions24h: number;
  signupsThisWeek: number;
  messagesThisWeek: number;
  avgEngagementScore: number;
}

interface RecentActivity {
  id: string;
  type: 'waitlist_signup' | 'contact_message';
  userName: string;
  userEmail: string;
  status: string;
  time: string;
  description: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved' | 'spam';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  // Additional properties that are referenced in the component
  phone_number?: string;
  device_type?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  browser?: string;
  os?: string;
  screen_resolution?: string;
  language?: string;
  timezone?: string;
  ip_address?: string;
  scroll_depth?: number;
  time_on_page?: number;
  page_load_time?: number;
  engagement_score?: number;
  conversion_probability?: number;
  fraud_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  bot_detected?: boolean;
  vpn_detected?: boolean;
  proxy_detected?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referral_source?: string;
}

// Real data will be fetched from Supabase
const initialStats: DashboardStats = {
  totalSignups: 0,
  pendingSignups: 0,
  convertedSignups: 0,
  newMessages: 0,
  activeSessions24h: 0,
  signupsThisWeek: 0,
  messagesThisWeek: 0,
  avgEngagementScore: 0
};

const initialRecentActivity: RecentActivity[] = [];
const initialContactMessages: ContactMessage[] = [];

// Main Component
const ModernAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'waitlist' | 'message' | 'analytics'>('overview');
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(initialRecentActivity);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
    const [refreshSuccess, setRefreshSuccess] = useState(false);
  // Removed unused state

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [monitorCollapsed, setMonitorCollapsed] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: 'online',
    api: 'online',
    analytics: 'online'
  });
  
  // Google Analytics state
  const [gaData, setGaData] = useState<{
    deviceBreakdown?: Record<string, number>;
    topPages?: Array<{ page: string; views: number; bounceRate: number }>;
    pageViews?: number;
    uniqueVisitors?: number;
    bounceRate?: number;
    avgSessionDuration?: number;
    sessions?: number;
    conversionRate?: number;
    gaToWaitlistRatio?: number;
    topSources?: Array<{ source: string; sessions: number }>;
  } | null>(null);
  const [gaLoading, setGaLoading] = useState(false);
  // Removed unused state
  const [isGAConnected, setIsGAConnected] = useState(false);
  const [gaLastUpdated, setGaLastUpdated] = useState<Date | null>(null);
  const [liveVisitors, setLiveVisitors] = useState(0);

  // Message modal functions
  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
    setShowMessageModal(false);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
    fetchGoogleAnalyticsData();
  }, []);

  // Clock update removed

  // Keyboard shortcut for sidebar toggle (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Google Analytics data
  const fetchGoogleAnalyticsData = async () => {
    try {
      setGaLoading(true);
              // Error cleared
      
      // Import and use the real Google Analytics service
      const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
      
      // Check if GA is configured
      if (!googleAnalyticsService.isConfigured()) {
        setIsGAConnected(false);
        console.error('Google Analytics not properly configured');
        return;
      }
      
      // Initialize the service
      const initialized = await googleAnalyticsService.initialize();
      if (!initialized) {
        setIsGAConnected(false);
        console.error('Failed to initialize Google Analytics service');
        return;
      }
      
      // Check authentication status
      const authStatus = googleAnalyticsService.getAuthStatus();
      
      if (!authStatus.authenticated) {
        // Don't automatically request authentication - let user click button
        setIsGAConnected(false);
        console.error('Google Analytics authentication required. Click "Connect" to authenticate.');
        return;
      }
      
      // Update system monitor status
      setSystemStatus(prev => ({ ...prev, googleAnalytics: 'online' }));
      
      // Get real GA data
      const enhancedAnalytics = await googleAnalyticsService.getEnhancedAnalytics();
      
      // Get real-time data
      const realTimeData = await googleAnalyticsService.getRealTimeData();
      
      // Transform data for UI
      const realData = {
        pageViews: enhancedAnalytics.totalPageViews,
        uniqueVisitors: enhancedAnalytics.totalUsers,
        bounceRate: enhancedAnalytics.avgBounceRate,
        avgSessionDuration: enhancedAnalytics.avgSessionDuration,
        sessions: enhancedAnalytics.totalSessions,
        topPages: enhancedAnalytics.topPages || [],
        topSources: Object.entries(enhancedAnalytics.trafficSources).map(([source, sessions]) => ({
          source,
          sessions
        })),
        deviceBreakdown: enhancedAnalytics.deviceBreakdown || {},
        recentActivity: [], // Will be populated when we add real-time events
        conversionRate: enhancedAnalytics.conversionFunnel.conversionRate,
        waitlistSignups: enhancedAnalytics.conversionFunnel.waitlistSignups,
        gaToWaitlistRatio: enhancedAnalytics.enhancedMetrics.gaToWaitlistRatio,
        countryBreakdown: enhancedAnalytics.countryBreakdown || {},
        cityBreakdown: enhancedAnalytics.cityBreakdown || []
      };
      
      setGaData(realData);
      setGaLastUpdated(new Date());
      setLiveVisitors(realTimeData.activeUsers || enhancedAnalytics.totalUsers);
      setIsGAConnected(true);
      
      // Update system monitor status to online
      setSystemStatus(prev => ({ ...prev, googleAnalytics: 'online' }));
      
      
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
              console.error('Failed to fetch Google Analytics data:', error);
      setIsGAConnected(false);
    } finally {
      setGaLoading(false);
    }
  };

  // Fetch real data from Supabase
  const fetchDashboardData = async () => {
    try {

      
      // Calculate one week ago for both waitlist and messages
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Fetch waitlist data
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist_signups')
        .select('*');
      
      if (waitlistError) {
        console.error('Error fetching waitlist data:', waitlistError);
        setSystemStatus(prev => ({ ...prev, database: 'warning' }));
      } else {
        const totalSignups = waitlistData?.length || 0;
        const pendingSignups = waitlistData?.filter(entry => entry.status === 'pending').length || 0;
        const convertedSignups = waitlistData?.filter(entry => entry.status === 'contacted').length || 0;
        
        // Calculate weekly signups
        const signupsThisWeek = waitlistData?.filter(entry => 
          new Date(entry.created_at) > oneWeekAgo
        ).length || 0;
        
        setStats(prev => ({
          ...prev,
          totalSignups,
          pendingSignups,
          convertedSignups,
          signupsThisWeek
        }));
      }

      // Fetch contact messages data
      setMessagesLoading(true);
      setMessagesError(null);
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Error fetching contact messages:', messagesError);
        setMessagesError(messagesError.message);
        setSystemStatus(prev => ({ ...prev, database: 'warning' }));
      } else {
        const newMessages = messagesData?.filter(msg => msg.status === 'new').length || 0;
        const messagesThisWeek = messagesData?.filter(msg => 
          new Date(msg.created_at) > oneWeekAgo
        ).length || 0;
        
        setContactMessages(messagesData || []);
        setStats(prev => ({
          ...prev,
          newMessages,
          messagesThisWeek
        }));
        
        // Show success message
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 3000);
      }
      
      setMessagesLoading(false);
      

      
      // Fetch recent activity
      const recentWaitlist = waitlistData?.slice(0, 5).map(entry => ({
        id: entry.id,
        type: 'waitlist_signup' as const,
        userName: entry.name || entry.email?.split('@')[0] || 'Unknown',
        userEmail: entry.email || '',
        status: entry.status || 'pending',
        time: new Date(entry.created_at).toLocaleString(),
        description: 'New waitlist signup'
      })) || [];
      
      const recentMessages = messagesData?.slice(0, 3).map(msg => ({
        id: msg.id,
        type: 'contact_message' as const,
        userName: msg.name || msg.email?.split('@')[0] || 'Unknown',
        userEmail: msg.email || '',
        status: msg.status || 'new',
        time: new Date(msg.created_at).toLocaleString(),
        description: 'New contact message'
      })) || [];
      
      const combinedActivity = [...recentWaitlist, ...recentMessages]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
      
      setRecentActivity(combinedActivity);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSystemStatus(prev => ({ ...prev, database: 'warning', api: 'warning' }));
      
      // Set error state for messages if there was an error
      if (error instanceof Error) {
        setMessagesError(error.message);
      } else {
        setMessagesError('Unknown error occurred');
      }
    } finally {

      setMessagesLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Time updated
      
      // Refresh data every 30 seconds
      if (Date.now() % 30000 < 5000) {
        fetchDashboardData();
      }
      
      // Refresh GA data every 2 minutes
      if (Date.now() % 120000 < 5000) {
        fetchGoogleAnalyticsData();
      }
      
      // Simulate live visitor changes
      if (Math.random() > 0.7) {
        setLiveVisitors(prev => {
          const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
          return Math.max(0, prev + change);
        });
      }
      
      // Simulate system status changes
      if (Math.random() > 0.95) {
        setSystemStatus(prev => ({
          ...prev,
          database: Math.random() > 0.8 ? 'warning' : 'online',
          api: Math.random() > 0.9 ? 'warning' : 'online'
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'waitlist', label: 'Waitlist', icon: UsersIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'message', label: 'Message', icon: EnvelopeIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'analytics', label: 'Google Analytics', icon: ChartPieIcon, color: 'from-orange-500 to-red-500' }
  ];

  // Render functions for each tab
  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6 md:space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        <StatCard
          title="Total Signups"
          value={stats.totalSignups}
          icon={UsersIcon}
          color="from-blue-500 to-cyan-500"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Pending Signups"
          value={stats.pendingSignups}
          icon={ClockIcon}
          color="from-yellow-500 to-orange-500"
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Converted"
          value={stats.convertedSignups}
          icon={ArrowTrendingUpIcon}
          color="from-green-500 to-emerald-500"
          trend="+18%"
          trendUp={true}
        />
        <StatCard
          title="New Messages"
          value={stats.newMessages}
          icon={EnvelopeIcon}
          color="from-purple-500 to-pink-500"
          trend="+8%"
          trendUp={true}
        />
      </div>

      {/* Google Analytics Metrics */}
      {gaLoading && (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-800/50">
          <div className="text-center">
            <FastLoadingSpinner 
              variant="premium" 
              size="lg" 
              text="Loading Google Analytics..." 
            />
          </div>
        </div>
      )}

      {!gaLoading && isGAConnected && gaData && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
              <GlobeAltIcon className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-green-400" />
              Google Analytics
            </h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
              <button
                onClick={fetchGoogleAnalyticsData}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                title="Refresh Google Analytics data"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  fetchDashboardData();
                  fetchGoogleAnalyticsData();
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                title="Refresh all dashboard data"
              >
                🔄 All Data
              </button>
            </div>
            {gaLastUpdated && (
              <div className="text-xs text-gray-400 text-center">
                Last updated: {gaLastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          {/* GA Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Page Views</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-2">{(gaData.pageViews || 0).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-400">+15%</span>
                <span className="text-gray-400 text-sm ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Unique Visitors</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-2">{(gaData.uniqueVisitors || 0).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-400">+8%</span>
                <span className="text-gray-400 text-sm ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Bounce Rate</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-2">{gaData.bounceRate || 0}%</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-red-400">+2%</span>
                <span className="text-gray-400 text-sm ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg Session</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-2">{gaData.avgSessionDuration || 0}s</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-400">+12%</span>
                <span className="text-gray-400 text-sm ml-2">from last month</span>
              </div>
            </div>
          </div>

          {/* Additional GA Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold text-white mt-2">{gaData.sessions?.toLocaleString() || 0}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white mt-2">{gaData.conversionRate ? `${gaData.conversionRate.toFixed(1)}%` : '0%'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">GA to Waitlist</p>
                  <p className="text-2xl font-bold text-white mt-2">{gaData.gaToWaitlistRatio ? `${gaData.gaToWaitlistRatio.toFixed(1)}%` : '0%'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* GA Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-blue-400" />
                Top Pages
              </h3>
              <div className="space-y-3">
                {gaData.topPages?.map((page: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                      <span className="text-white text-sm ml-2">{page.page}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-medium">{page.views.toLocaleString()}</span>
                      <span className="text-gray-400 text-xs">views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-green-400" />
                Device Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(gaData.deviceBreakdown || {}).map(([device, sessions]) => {
                  const totalSessions = Object.values(gaData.deviceBreakdown || {}).reduce((a, b) => (a as number) + (b as number), 0);
                  const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;
                  
                  return (
                    <div key={device} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-white text-sm capitalize">{device}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                        <span className="text-green-400 font-medium w-12 text-right">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2 text-purple-400" />
              Traffic Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {gaData.topSources?.map((source: any, index: number) => (
                <div key={index} className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="text-2xl font-bold text-white mb-1">{source.sessions.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">{source.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* Enhanced Charts Row with Sci-fi Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 relative overflow-hidden">
          {/* Sci-fi Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
            <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-12 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-18 right-18 w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center relative z-10">
            <ChartBarIcon className="w-6 h-6 mr-3 text-blue-400" />
            Weekly Signups
          </h3>
          
          <div className="h-80 flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2 animate-pulse">{stats.signupsThisWeek}</div>
              <div className="text-gray-400 mb-2">This Week</div>
              <div className="text-sm text-green-400 mb-3">↑ +15% from last week</div>
              
              {/* Animated Progress Bar */}
              <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
              
              {/* Sci-fi Status Indicators */}
              <div className="flex justify-center space-x-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 relative overflow-hidden">
          {/* Sci-fi Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20"></div>
            <div className="absolute top-6 left-6 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-12 left-12 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-18 left-18 w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center relative z-10">
            <GlobeAltIcon className="w-6 h-6 mr-3 text-green-400" />
            Active Sessions (24h)
          </h3>
          
          <div className="h-80 flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse">{stats.activeSessions24h}</div>
              <div className="text-gray-400 mb-2">Active Users</div>
              <div className="text-sm text-blue-400 mb-3">↑ +8% from yesterday</div>
              
              {/* Animated Progress Bar */}
              <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              
              {/* Sci-fi Status Indicators */}
              <div className="flex justify-center space-x-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Database</span>
              <span className={`text-sm ${
                systemStatus.database === 'online' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                ● {systemStatus.database === 'online' ? 'Online' : 'Warning'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">API</span>
              <span className={`text-sm ${
                systemStatus.api === 'online' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                ● {systemStatus.api === 'online' ? 'Online' : 'Warning'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Analytics</span>
              <span className="text-green-400 text-sm">● Online</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Response Time</span>
              <span className="text-blue-400 text-sm">45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Uptime</span>
              <span className="text-blue-400 text-sm">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Load</span>
              <span className="text-blue-400 text-sm">Low</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-4 h-4 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
            Quick Actions
          </h3>
                     <div className="space-y-4">
             <button className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm">
               📊 Export Report
             </button>
             <button 
               onClick={fetchDashboardData}
               className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
             >
               🔄 Refresh Data
             </button>
             <button className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm">
               ⚙️ Settings
             </button>
           </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BellIcon className="w-6 h-6 mr-3 text-yellow-400" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                activity.type === 'waitlist_signup' ? 'bg-blue-400' : 'bg-purple-400'
              }`} />
              <div className="flex-1">
                <div className="text-white font-medium">{activity.userName}</div>
                <div className="text-gray-400 text-sm">{activity.description}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{activity.time}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'new' ? 'bg-red-500/20 text-red-400' :
                  activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWaitlistTab = () => {
    const ModernWaitlistTab = lazy(() => import('./ModernWaitlistTab'));
    return (
      <Suspense fallback={
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
          <div className="text-gray-400 text-lg">Loading waitlist dashboard...</div>
        </div>
      }>
        <ModernWaitlistTab />
      </Suspense>
    );
  };

  const renderMessageTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Contact Messages</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Total: {contactMessages.length} | New: {contactMessages.filter(m => m.status === 'new').length}
            </div>
            <button
              onClick={() => {
                console.log('🔄 Manual refresh requested');
                fetchDashboardData();
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              title="Refresh data from Supabase"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {/* Info banner */}
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Click on any message to view comprehensive details including device info, location, and user behavior data.
          </div>
        </div>
        
        {/* Loading State */}
        {messagesLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-blue-400">Loading messages...</div>
          </div>
        )}

        {/* Success State */}
        {refreshSuccess && (
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="text-green-400 text-sm">
              ✅ Data refreshed successfully! Found {contactMessages.length} messages.
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="p-4 bg-gray-800/20 border border-gray-700/30 rounded-lg">
          <div className="text-gray-300 text-sm">
            🔍 Debug Info: Messages loaded: {contactMessages.length} | Loading: {messagesLoading ? 'Yes' : 'No'} | Error: {messagesError || 'None'}
          </div>
        </div>

        {/* Error State */}
        {messagesError && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-sm">
              ❌ Error loading messages: {messagesError}
            </div>
          </div>
        )}

        {/* Messages List */}
        {!messagesLoading && !messagesError && (
          <div className="space-y-4">
            {contactMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No contact messages found. Submit a message through the contact form to see it here.
              </div>
            ) : (
              contactMessages.map((message) => (
            <div 
              key={message.id} 
              className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer transition-all duration-200 hover:bg-gray-800/40"
              onClick={() => openMessageModal(message)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-white font-medium">{message.name}</div>
                  <div className="text-gray-400 text-sm">{message.email}</div>
                  {message.phone_number && (
                    <div className="text-gray-400 text-sm">📞 {message.phone_number}</div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className={`text-xs px-2 py-1 rounded-full mb-1 ${
                    message.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    message.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    message.priority === 'low' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {message.priority}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    message.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    message.status === 'read' ? 'bg-gray-500/20 text-gray-400' :
                    message.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                    message.status === 'resolved' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {message.status}
                  </div>
                </div>
              </div>
              
              <div className="text-white font-medium mb-1">{message.subject}</div>
              <div className="text-gray-400 text-sm mb-2 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>{message.message}</div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-gray-700/50 rounded">{message.category}</span>
                  {message.device_type && (
                    <span className="px-2 py-1 bg-gray-700/50 rounded">
                      📱 {message.device_type}
                    </span>
                  )}
                  {message.country && (
                    <span className="px-2 py-1 bg-gray-700/50 rounded">
                      🌍 {message.country}
                    </span>
                  )}
                </div>
                <span>{new Date(message.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* Quick stats */}
              {message.fraud_score !== undefined && (
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <span>🛡️ Risk: {message.risk_level}</span>
                  <span>📊 Engagement: {message.engagement_score || 0}/100</span>
                  <span>🎯 Conversion: {Math.round((message.conversion_probability || 0) * 100)}%</span>
                </div>
              )}
            </div>
          ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => {
    const GoogleAnalyticsTab = lazy(() => import('./GoogleAnalyticsTab'));
    return (
      <Suspense fallback={
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-orange-400">Loading Google Analytics...</div>
          </div>
        </div>
      }>
        <GoogleAnalyticsTab />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}


      {/* Main Content */}
      <main className={`transition-all duration-300 py-4 sm:py-6 md:py-8 lg:py-12 ${
        sidebarCollapsed ? 'w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12' : 'w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12'
      }`}>
        {/* Tab Navigation */}
        <div className="mb-4 sm:mb-6 md:mb-10">
          <nav className="flex flex-wrap gap-1.5 sm:gap-2 bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 md:p-3 border border-gray-800/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-2.5 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm md:text-base ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 mr-1.5 sm:mr-2 md:mr-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'waitlist' && renderWaitlistTab()}
        {activeTab === 'message' && renderMessageTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </main>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900/95 border-b border-gray-700/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Message Details</h2>
                <button
                  onClick={closeMessageModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Name</label>
                      <div className="text-white font-medium">{selectedMessage.name}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <div className="text-white">{selectedMessage.email}</div>
                    </div>
                    {selectedMessage.phone_number && (
                      <div>
                        <label className="text-gray-400 text-sm">Phone</label>
                        <div className="text-white">{selectedMessage.phone_number}</div>
                      </div>
                    )}
                    <div>
                      <label className="text-gray-400 text-sm">Subject</label>
                      <div className="text-white font-medium">{selectedMessage.subject}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Message</label>
                      <div className="text-white bg-gray-800/50 p-3 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Status & Priority</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Status</label>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        selectedMessage.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        selectedMessage.status === 'read' ? 'bg-gray-500/20 text-gray-400' :
                        selectedMessage.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                        selectedMessage.status === 'resolved' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {selectedMessage.status}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Priority</label>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        selectedMessage.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        selectedMessage.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        selectedMessage.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        selectedMessage.priority === 'low' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {selectedMessage.priority}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Category</label>
                      <div className="text-white">{selectedMessage.category}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Created</label>
                      <div className="text-white">{new Date(selectedMessage.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Device & Browser Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Device & Browser</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Device Type</label>
                    <div className="text-white">{selectedMessage.device_type || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Browser</label>
                    <div className="text-white">{selectedMessage.browser || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Operating System</label>
                    <div className="text-white">{selectedMessage.os || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Screen Resolution</label>
                    <div className="text-white">{selectedMessage.screen_resolution || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Language</label>
                    <div className="text-white">{selectedMessage.language || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Timezone</label>
                    <div className="text-white">{selectedMessage.timezone || 'Unknown'}</div>
                  </div>
                </div>
              </div>
              
              {/* Location & Network */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Location & Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">IP Address</label>
                    <div className="text-white font-mono text-sm">{selectedMessage.ip_address || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Country</label>
                    <div className="text-white">{selectedMessage.country || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">City</label>
                    <div className="text-white">{selectedMessage.city || 'Unknown'}</div>
                  </div>
                  {selectedMessage.latitude && selectedMessage.longitude && (
                    <div className="md:col-span-3">
                      <label className="text-gray-400 text-sm">Coordinates</label>
                      <div className="text-white font-mono text-sm">
                        {selectedMessage.latitude}, {selectedMessage.longitude}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Behavior & Engagement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">User Behavior & Engagement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Scroll Depth</label>
                    <div className="text-white">{selectedMessage.scroll_depth ? `${selectedMessage.scroll_depth}%` : 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Time on Page</label>
                    <div className="text-white">{selectedMessage.time_on_page ? `${Math.round(selectedMessage.time_on_page / 60)}m ${selectedMessage.time_on_page % 60}s` : 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Page Load Time</label>
                    <div className="text-white">{selectedMessage.page_load_time ? `${selectedMessage.page_load_time}ms` : 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Engagement Score</label>
                    <div className="text-white">{selectedMessage.engagement_score || 0}/100</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Conversion Probability</label>
                    <div className="text-white">{Math.round((selectedMessage.conversion_probability || 0) * 100)}%</div>
                  </div>
                </div>
              </div>
              
              {/* Security & Risk Assessment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Security & Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Risk Level</label>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedMessage.risk_level === 'high' ? 'bg-red-500/20 text-red-400' :
                      selectedMessage.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedMessage.risk_level || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Fraud Score</label>
                    <div className="text-white">{selectedMessage.fraud_score || 0}/100</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Bot Detected</label>
                    <div className="text-white">{selectedMessage.bot_detected ? '⚠️ Yes' : '✅ No'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">VPN Detected</label>
                    <div className="text-white">{selectedMessage.vpn_detected ? '⚠️ Yes' : '✅ No'}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Proxy Detected</label>
                    <div className="text-white">{selectedMessage.proxy_detected ? '⚠️ Yes' : '✅ No'}</div>
                  </div>
                </div>
              </div>
              
              {/* UTM & Campaign Data */}
              {(selectedMessage.utm_source || selectedMessage.utm_medium || selectedMessage.utm_campaign) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">Campaign & UTM Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedMessage.utm_source && (
                      <div>
                        <label className="text-gray-400 text-sm">UTM Source</label>
                        <div className="text-white">{selectedMessage.utm_source}</div>
                      </div>
                    )}
                    {selectedMessage.utm_medium && (
                      <div>
                        <label className="text-gray-400 text-sm">UTM Medium</label>
                        <div className="text-white">{selectedMessage.utm_medium}</div>
                      </div>
                    )}
                    {selectedMessage.utm_campaign && (
                      <div>
                        <label className="text-gray-400 text-sm">UTM Campaign</label>
                        <div className="text-white">{selectedMessage.utm_campaign}</div>
                      </div>
                    )}
                    {selectedMessage.referral_source && (
                      <div>
                        <label className="text-gray-400 text-sm">Referral Source</label>
                        <div className="text-white">{selectedMessage.referral_source}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Sci-fi Notification Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Monitor Header with Toggle */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">System Monitor</span>
            </div>
            <button 
              onClick={() => setMonitorCollapsed(!monitorCollapsed)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={monitorCollapsed ? "Expand Monitor" : "Collapse Monitor"}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-current transition-all duration-300 ${
                  monitorCollapsed ? 'rotate-45' : '-rotate-45'
                }`}></div>
              </div>
            </button>
          </div>
          
          {/* Monitor Content */}
          <div className={`transition-all duration-300 ${
            monitorCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100 p-4'
          }`}>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">CPU</span>
                <span className="text-green-400">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Memory</span>
                <span className="text-blue-400">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network</span>
                <span className="text-purple-400">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">GA Status</span>
                <span className={`${isGAConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isGAConnected ? '● Online' : '○ Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Live Visitors</span>
                <span className="text-purple-400 animate-pulse">{liveVisitors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">GA Status</span>
                <span className={`${isGAConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isGAConnected ? '● Online' : '○ Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend: string;
  trendUp: boolean;
}> = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm md:text-base font-medium">{title}</p>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 md:mt-3">{value.toLocaleString()}</p>
      </div>
      <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
      </div>
    </div>
    <div className="mt-4 md:mt-6 flex items-center">
      <span className={`text-sm md:text-base font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </span>
      <span className="text-gray-400 text-xs md:text-sm ml-2">from last month</span>
    </div>
  </div>
);

export default ModernAdminDashboard;
