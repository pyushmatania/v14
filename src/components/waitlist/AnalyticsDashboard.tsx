import * as React from 'react';
import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone, 
  Download, 
  BarChart3,
  Eye,
  MousePointer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

// 🛡️ Type definitions for better type safety
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
    mobileNumber?: string;
    timestamp: string;
    source: string;
    location: string;
    device: string;
  }>;
}

interface AnalyticsDashboardProps {
  isAdmin?: boolean;
  onExport?: (data: AnalyticsData) => void;
}

// Default empty analytics data
const defaultAnalyticsData: AnalyticsData = {
  totalSignups: 0,
  dailySignups: 0,
  weeklyGrowth: 0,
  monthlyGrowth: 0,
  topCountries: [],
  deviceBreakdown: [],
  browserBreakdown: [],
  referralSources: [],
  scrollDepthData: [],
  timeOnPageData: [],
  utmCampaigns: [],
  recentSignups: []
};

/**
 * 🎯 AnalyticsDashboard - Admin dashboard for waitlist analytics
 * @description Displays comprehensive analytics with charts and data visualization
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isAdmin = false, onExport }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // 🚀 Memoized gradient configurations
  const cyberpunkGradients = useMemo(() => ({
    card: 'bg-white/10 backdrop-blur-xl border-white/20',
    hover: 'hover:border-purple-400/50 hover:bg-white/15',
    text: 'bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent',
    primary: 'bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600',
    success: 'bg-gradient-to-br from-green-600 to-emerald-600',
    warning: 'bg-gradient-to-br from-yellow-600 to-orange-600'
  }), []);

  // 🚀 Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics?timeframe=${selectedTimeframe}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe]);

  // 🚀 Handle data export
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(analyticsData);
    } else {
      // Default CSV export
      const csvContent = generateCSV(analyticsData);
      downloadCSV(csvContent, `waitlist-analytics-${selectedTimeframe}.csv`);
    }
  }, [analyticsData, selectedTimeframe, onExport]);

  // 🚀 Generate CSV content
  const generateCSV = (data: AnalyticsData): string => {
    const headers = ['Metric', 'Value', 'Percentage'];
    const rows = [
      ['Total Signups', data.totalSignups.toString(), '100%'],
      ['Daily Signups', data.dailySignups.toString(), ''],
      ['Weekly Growth', `${data.weeklyGrowth}%`, ''],
      ['Monthly Growth', `${data.monthlyGrowth}%`, '']
    ];

    // Add country data
    data.topCountries.forEach(country => {
      rows.push([country.country, country.count.toString(), `${country.percentage}%`]);
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // 🚀 Download CSV file
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🚀 Refresh data
  const handleRefresh = useCallback(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // 🚀 Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // 🚀 Format percentage
  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  // 🚀 Get growth indicator
  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    } else if (growth < 0) {
      return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🎯 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className={cyberpunkGradients.text}>
                  AI Waitlist Analytics
                </span>
              </h1>
              <p className="text-gray-300">
                Real-time insights into your waitlist performance
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timeframe Selector */}
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400/50"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2 ${cyberpunkGradients.primary}`}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 🎯 Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Signups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-purple-400/30`}
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <div className="flex items-center gap-1">
                {getGrowthIndicator(analyticsData.monthlyGrowth)}
                <span className="text-green-400 text-sm font-semibold">
                  +{formatPercentage(analyticsData.monthlyGrowth)}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(analyticsData.totalSignups)}
            </h3>
            <p className="text-gray-400 text-sm">Total Signups</p>
          </motion.div>

          {/* Daily Signups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-green-400/30`}
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="flex items-center gap-1">
                {getGrowthIndicator(analyticsData.weeklyGrowth)}
                <span className="text-green-400 text-sm font-semibold">
                  +{formatPercentage(analyticsData.weeklyGrowth)}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(analyticsData.dailySignups)}
            </h3>
            <p className="text-gray-400 text-sm">Daily Signups</p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-blue-400/30`}
          >
            <div className="flex items-center justify-between mb-4">
              <MousePointer className="w-8 h-8 text-blue-400" />
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">
                  +2.3%
                </span>
                <div className="text-xs text-red-400">(not real data)</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              24.7%
            </h3>
            <p className="text-gray-400 text-sm">Conversion Rate</p>
            <div className="text-center mt-2">
              <span className="text-red-400 text-xs">(not real data)</span>
            </div>
          </motion.div>

          {/* Avg Time on Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-yellow-400/30`}
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">
                  +12s
                </span>
                <div className="text-xs text-red-400">(not real data)</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              2m 34s
            </h3>
            <p className="text-gray-400 text-sm">Avg Time on Page</p>
            <div className="text-center mt-2">
              <span className="text-red-400 text-xs">(not real data)</span>
            </div>
          </motion.div>
        </div>

        {/* 🎯 Charts and Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-purple-400/30`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Geographic Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {analyticsData.topCountries.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="text-white font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm w-12 text-right">
                      {formatNumber(country.count)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-green-400/30`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Device Breakdown</h3>
            </div>
            
            <div className="space-y-4">
              {analyticsData.deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-white font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm w-12 text-right">
                      {formatPercentage(device.percentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Referral Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-blue-400/30`}
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Referral Sources</h3>
            </div>
            
            <div className="space-y-4">
              {analyticsData.referralSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="text-white font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm w-12 text-right">
                      {formatNumber(source.count)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Signups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-6 rounded-2xl ${cyberpunkGradients.card} border-yellow-400/30`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Recent Signups</h3>
            </div>
            
            <div className="space-y-4">
              {analyticsData.recentSignups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{signup.name}</p>
                    <p className="text-gray-400 text-sm">{signup.email}</p>
                    {signup.mobileNumber && (
                      <p className="text-gray-500 text-xs">{signup.mobileNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">{signup.source}</p>
                    <p className="text-gray-400 text-xs">{signup.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(AnalyticsDashboard); 