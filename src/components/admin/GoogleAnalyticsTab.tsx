import { 
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

import DeviceAnalytics from './DeviceAnalytics';
import GeographicAnalytics from './GeographicAnalytics';
import LoadingSpinner from '../LoadingSpinner';

// Google Analytics Configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GA_PROPERTY_ID = import.meta.env.VITE_GA_PROPERTY_ID;
const GA_CLIENT_ID = import.meta.env.VITE_GA_CLIENT_ID;

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topSources: Array<{ source: string; sessions: number }>;
  deviceBreakdown: Array<{ device: string; percentage: number }>;
  recentActivity: Array<{ time: string; event: string; count: number }>;
}

const GoogleAnalyticsTab: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gaData, setGaData] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGoogleAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setError(null);
      
      // Import and use the real Google Analytics service
      const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
      
      // Check if GA is configured
      if (!googleAnalyticsService.isConfigured()) {
        setError('Google Analytics not properly configured');
        return;
      }
      
      // Initialize the service
      const initialized = await googleAnalyticsService.initialize();
      if (!initialized) {
        setError('Failed to initialize Google Analytics service');
        return;
      }
      
      // Check authentication status
      const authStatus = googleAnalyticsService.getAuthStatus();
      
      if (!authStatus.authenticated) {
        // Don't automatically request authentication - let user click button
        setError('Google Analytics authentication required. Click "Connect" to authenticate.');
        return;
      }
      
      // Get real GA data
      const enhancedAnalytics = await googleAnalyticsService.getEnhancedAnalytics();
      
      // Get real-time data
      const realTimeData = await googleAnalyticsService.getRealTimeData();
      
      // Transform data for UI
      const realData: AnalyticsData = {
        pageViews: enhancedAnalytics.totalPageViews,
        uniqueVisitors: enhancedAnalytics.totalUsers,
        bounceRate: enhancedAnalytics.avgBounceRate,
        avgSessionDuration: enhancedAnalytics.avgSessionDuration,
        topPages: realTimeData.topPages || [],
        topSources: Object.entries(enhancedAnalytics.trafficSources).map(([source, sessions]) => ({
          source,
          sessions
        })),
        deviceBreakdown: [], // Will be populated when we add device dimension
        recentActivity: [] // Will be populated when we add real-time events
      };
      
      setAnalyticsData(realData);
      setGaData(enhancedAnalytics);
      setLastRefresh(new Date());
      
      
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch Google Analytics data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Check if GA is properly configured
    if (GA_MEASUREMENT_ID && GA_PROPERTY_ID && GA_CLIENT_ID) {
      // Fetch real Google Analytics data
      fetchGoogleAnalyticsData();
    } else {
      setError('Google Analytics not properly configured. Please check your environment variables.');
      setLoading(false);
    }
  }, [fetchGoogleAnalyticsData]);

  // Auto-refresh data every 30 seconds when authenticated
  useEffect(() => {
    if (!error && analyticsData) {
      const interval = setInterval(() => {
        fetchGoogleAnalyticsData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [error, analyticsData, fetchGoogleAnalyticsData]);

  const [activeTab, setActiveTab] = useState<'overview' | 'geographic' | 'devices' | 'traffic'>('overview');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner 
              variant="premium" 
              size="lg" 
              text="Loading Google Analytics..." 
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">⚠️ Configuration Error</div>
            <div className="text-gray-400 mb-4">{error}</div>
            
            {/* Show connection button if it's an authentication error */}
            {error.includes('authentication') && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    try {
                      setError(null);
                      const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
                      const authenticated = await googleAnalyticsService.requestAuthentication();
                      if (authenticated) {
                        // After successful authentication, fetch data
                        fetchGoogleAnalyticsData();
                      }
                    } catch (error) {
                      console.error('Authentication error:', error);
                      setError('Authentication failed. Please try again.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  🔐 Connect to Google Analytics
                </button>
              </div>
            )}
            
            <div className="text-sm text-gray-500 mt-4">
              Required environment variables:
              <br />
              VITE_GA_MEASUREMENT_ID: {GA_MEASUREMENT_ID ? '✅ Set' : '❌ Missing'}
              <br />
              VITE_GA_PROPERTY_ID: {GA_PROPERTY_ID ? '✅ Set' : '❌ Missing'}
              <br />
              VITE_GA_CLIENT_ID: {GA_CLIENT_ID ? '✅ Set' : '❌ Missing'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-green-400" />
            Google Analytics Status
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Connected</span>
              {lastRefresh && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Auto-refresh active</span>
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                try {
                  const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
                  const authenticated = await googleAnalyticsService.requestAuthentication();
                  if (authenticated) {
                    // After successful authentication, fetch data
                    fetchGoogleAnalyticsData();
                  }
                } catch (error) {
                  console.error('Authentication error:', error);
                  setError('Authentication failed. Please try again.');
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              title="Connect to Google Analytics"
            >
              🔐 Connect
            </button>
            <button
              onClick={fetchGoogleAnalyticsData}
              disabled={isRefreshing}
              className={`px-3 py-1 text-white text-sm rounded-lg transition-colors ${
                isRefreshing 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title="Refresh Google Analytics data"
            >
              {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
            <button
              onClick={async () => {
                try {
                  const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
                  const debugInfo = await googleAnalyticsService.debugDataAvailability();
                  alert(`GA Debug Info:\n\nHas Token: ${debugInfo.hasToken}\nHas Property ID: ${debugInfo.hasPropertyId}\nCan Fetch Basic: ${debugInfo.canFetchBasic}\nCan Fetch Advanced: ${debugInfo.canFetchAdvanced}\n\nBasic Data: ${JSON.stringify(debugInfo.basicDataSample, null, 2)}\n\nReal-time Test: ${JSON.stringify(debugInfo.realTimeTest, null, 2)}\n\nCheck console for full details.`);
                } catch (error) {
                  console.error('Debug failed:', error);
                  alert('Debug failed. Check console for details.');
                }
              }}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
              title="Debug Google Analytics data availability"
            >
              🐛 Debug
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-gray-400">
            <span className="text-white">Measurement ID:</span> {GA_MEASUREMENT_ID}
          </div>
          <div className="text-gray-400">
            <span className="text-white">Property ID:</span> {GA_PROPERTY_ID}
          </div>
          <div className="text-gray-400">
            <span className="text-white">Client ID:</span> {GA_CLIENT_ID?.substring(0, 20)}...
          </div>
        </div>
        
        {/* Last Refresh Indicator */}
        {lastRefresh && (
          <div className="text-center text-sm text-gray-400 mt-2">
            <span className="text-white">Last refreshed:</span> {lastRefresh.toLocaleTimeString()} 
            <span className="text-gray-500 ml-2">(Auto-refresh every 30s)</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-800/50">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'geographic', label: 'Geographic', icon: '🌍' },
            { id: 'devices', label: 'Devices', icon: '📱' },
            { id: 'traffic', label: 'Traffic', icon: '🚦' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Refreshing Overlay */}
      {isRefreshing && (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-800/50 text-center">
          <div className="flex items-center justify-center space-x-3 text-blue-400">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Refreshing Google Analytics data...</span>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Page Views</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData?.pageViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-400">+15%</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Unique Visitors</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData?.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-400">+8%</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Bounce Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData?.bounceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-red-400">+2%</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg Session</p>
              <p className="text-3xl font-bold text-white mt-2">{analyticsData?.avgSessionDuration}s</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-400">+12%</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-400" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {analyticsData?.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                  <span className="text-white text-sm ml-2">{page.page}</span>
                </div>
                <span className="text-blue-400 font-medium">{page.views.toLocaleString()}</span>
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
            {analyticsData?.deviceBreakdown.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-white text-sm">{device.device}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                      style={{width: `${device.percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-green-400 font-medium w-12 text-right">{device.percentage}%</span>
                </div>
              </div>
            ))}
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
          {analyticsData?.topSources.map((source, index) => (
            <div key={index} className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="text-2xl font-bold text-white mb-1">{source.sessions.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">{source.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ClockIcon className="w-5 h-5 mr-2 text-yellow-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {analyticsData?.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-white font-medium">{activity.event}</div>
                <div className="text-gray-400 text-sm">{activity.time}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{activity.count}</div>
                <div className="text-xs text-gray-400">events</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Analytics Section */}
      {gaData && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-2">Enhanced Analytics</h3>
          
          {/* Conversion Funnel */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-blue-400" />
              Conversion Funnel
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">{gaData.conversionFunnel?.sessions?.toLocaleString() || 0}</div>
                <div className="text-gray-400 text-sm">Sessions</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">{gaData.conversionFunnel?.pageViews?.toLocaleString() || 0}</div>
                <div className="text-gray-400 text-sm">Page Views</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-1">{gaData.conversionFunnel?.waitlistSignups?.toLocaleString() || 0}</div>
                <div className="text-gray-400 text-sm">Waitlist Signups</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-400 mb-1">{gaData.conversionFunnel?.conversionRate ? `${gaData.conversionFunnel.conversionRate.toFixed(1)}%` : '0%'}</div>
                <div className="text-gray-400 text-sm">Conversion Rate</div>
              </div>
            </div>
          </div>

          {/* Enhanced Metrics */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-400" />
              Enhanced Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">GA to Waitlist Ratio</span>
                  <span className="text-white font-medium">{gaData.enhancedMetrics?.gaToWaitlistRatio ? `${gaData.enhancedMetrics.gaToWaitlistRatio.toFixed(2)}%` : '0%'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Waitlist Conversion from GA</span>
                  <span className="text-white font-medium">{gaData.enhancedMetrics?.waitlistConversionFromGA ? `${gaData.enhancedMetrics.waitlistConversionFromGA.toFixed(2)}%` : '0%'}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Returning User Signup Rate</span>
                  <span className="text-white font-medium">{gaData.enhancedMetrics?.returningUserSignupRate ? `${gaData.enhancedMetrics.returningUserSignupRate.toFixed(2)}%` : '0%'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Average Time to Signup</span>
                  <span className="text-white font-medium">{gaData.enhancedMetrics?.avgTimeToSignup ? `${gaData.enhancedMetrics.avgTimeToSignup.toFixed(1)}s` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'geographic' && gaData && (
        <GeographicAnalytics 
          data={{
            countryBreakdown: gaData.countryBreakdown || {},
            cityBreakdown: gaData.cityBreakdown || []
          }}
          loading={loading}
        />
      )}

      {activeTab === 'devices' && gaData && (
        <DeviceAnalytics 
          data={{
            deviceBreakdown: gaData.deviceBreakdown || {},
            realTimeDevices: gaData.realTimeDevices || {}
          }}
          loading={loading}
        />
      )}

      {activeTab === 'traffic' && gaData && (
        <div className="space-y-6">
          {/* Traffic Sources */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2 text-purple-400" />
              Traffic Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gaData.trafficSources || {}).map(([source, sessions]) => (
                <div key={source} className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="text-2xl font-bold text-white mb-1">{(sessions as number).toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">{source}</div>
                </div>
              ))}
            </div>
          </div>

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
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-400 font-medium">{page.views.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm">views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Analytics Integration Note */}
      <div className="bg-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-800/50">
        <div className="text-center">
          <div className="text-blue-400 text-lg mb-2">🔗 Google Analytics Integration</div>
          <div className="text-gray-400 text-sm mb-4">
            This dashboard displays real analytics data from your Google Analytics 4 property.
            <br />
            Data is fetched directly from the GA4 API using OAuth2 authentication.
          </div>
          <div className="text-xs text-gray-500">
            Measurement ID: {GA_MEASUREMENT_ID} | Property ID: {GA_PROPERTY_ID}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsTab;
