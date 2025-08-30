import { DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface DeviceData {
  deviceBreakdown: Record<string, number>;
  realTimeDevices?: Record<string, number>;
}

interface DeviceAnalyticsProps {
  data: DeviceData;
  loading?: boolean;
}

const DeviceAnalytics: React.FC<DeviceAnalyticsProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <div className="text-center">
          <LoadingSpinner 
            variant="premium" 
            size="lg" 
            text="Loading device data..." 
          />
        </div>
      </div>
    );
  }

  // Sort devices by sessions
  const sortedDevices = Object.entries(data.deviceBreakdown)
    .sort(([, a], [, b]) => b - a);

  // Calculate total sessions
  const totalSessions = Object.values(data.deviceBreakdown).reduce((a, b) => a + b, 0);

  // Get device icon and color
  const getDeviceInfo = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return { icon: ComputerDesktopIcon, color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
      case 'mobile':
        return { icon: DevicePhoneMobileIcon, color: 'text-green-400', bgColor: 'bg-green-500/20' };
      case 'tablet':
        return { icon: DeviceTabletIcon, color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
      default:
        return { icon: DevicePhoneMobileIcon, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Device Overview */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-green-400" />
          Device Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {sortedDevices.map(([device, sessions]) => {
            const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;
            const deviceInfo = getDeviceInfo(device);
            const IconComponent = deviceInfo.icon;
            
            return (
              <div key={device} className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className={`w-16 h-16 ${deviceInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className={`w-8 h-8 ${deviceInfo.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{sessions.toLocaleString()}</div>
                <div className="text-gray-400 text-sm mb-2">{device}</div>
                <div className="text-lg font-semibold text-green-400">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>

        {/* Device Usage Chart */}
        <div className="space-y-3">
          {sortedDevices.map(([device, sessions]) => {
            const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;
            const deviceInfo = getDeviceInfo(device);
            
            return (
              <div key={device} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${deviceInfo.bgColor}`}></div>
                  <span className="text-white text-sm capitalize">{device}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${deviceInfo.bgColor}`}
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-green-400 font-medium w-16 text-right">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Device Activity */}
      {data.realTimeDevices && Object.keys(data.realTimeDevices).length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Real-time Device Activity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.realTimeDevices)
              .sort(([, a], [, b]) => b - a)
              .map(([device, sessions]) => {
                const deviceInfo = getDeviceInfo(device);
                const IconComponent = deviceInfo.icon;
                
                return (
                  <div key={device} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${deviceInfo.bgColor} rounded-full flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${deviceInfo.color}`} />
                        </div>
                        <div>
                          <div className="text-white font-medium capitalize">{device}</div>
                          <div className="text-gray-400 text-sm">Active sessions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{sessions.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">sessions</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Device Insights */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-blue-400" />
          Device Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {sortedDevices.length}
            </div>
            <div className="text-gray-400 text-sm">Device Types</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {totalSessions.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {sortedDevices.length > 0 ? 
                Math.round((sortedDevices[0]?.[1] || 0 / totalSessions) * 100) : 0
              }%
            </div>
            <div className="text-gray-400 text-sm">Top Device Share</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {sortedDevices.length > 0 ? 
                Math.round(totalSessions / sortedDevices.length) : 0
              }
            </div>
            <div className="text-gray-400 text-sm">Avg Sessions/Device</div>
          </div>
        </div>
      </div>

      {/* Device Performance Comparison */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-purple-400" />
          Device Performance Comparison
        </h3>
        
        <div className="space-y-4">
          {sortedDevices.map(([device, sessions], index) => {
            const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;
            const deviceInfo = getDeviceInfo(device);
            const IconComponent = deviceInfo.icon;
            
            return (
              <div key={device} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${deviceInfo.bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${deviceInfo.color}`} />
                  </div>
                  <div>
                    <div className="text-white font-medium capitalize">{device}</div>
                    <div className="text-gray-400 text-sm">#{index + 1} in usage</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{sessions.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">sessions</div>
                  <div className="text-lg font-semibold text-green-400">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeviceAnalytics;
