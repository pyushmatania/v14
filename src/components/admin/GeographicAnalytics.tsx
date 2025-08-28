import { MapPinIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface GeographicData {
  countryBreakdown: Record<string, number>;
  cityBreakdown: Array<{
    country: string;
    region: string;
    city: string;
    sessions: number;
  }>;
}

interface GeographicAnalyticsProps {
  data: GeographicData;
  loading?: boolean;
}

const GeographicAnalytics: React.FC<GeographicAnalyticsProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <div className="text-center">
          <LoadingSpinner 
            variant="premium" 
            size="lg" 
            text="Loading geographic data..." 
          />
        </div>
      </div>
    );
  }

  // Sort countries by sessions
  const sortedCountries = Object.entries(data.countryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Sort cities by sessions
  const sortedCities = data.cityBreakdown
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 15);

  return (
    <div className="space-y-6">
      {/* World Map Overview */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-400" />
          Global Traffic Distribution
        </h3>
        
        {/* Simple World Map Visualization */}
        <div className="relative h-64 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-gray-700/50 overflow-hidden">
          {/* World Map Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl text-gray-600/30">🌍</div>
          </div>
          
          {/* Traffic Points */}
          {sortedCountries.slice(0, 8).map(([country, sessions], index) => {
            const intensity = Math.min((sessions / Math.max(...sortedCountries.map(([, s]) => s))) * 100, 100);
            const positions = [
              'top-8 left-1/4', 'top-16 right-1/3', 'top-32 left-1/2', 'bottom-20 left-1/3',
              'bottom-16 right-1/4', 'top-1/2 right-8', 'top-1/3 left-8', 'bottom-1/3 right-1/2'
            ];
            
            return (
              <div
                key={country}
                className={`absolute ${positions[index]} w-3 h-3 bg-blue-400 rounded-full animate-pulse`}
                style={{
                  boxShadow: `0 0 ${intensity * 0.5}px ${intensity * 0.3}px rgba(59, 130, 246, 0.6)`
                }}
                title={`${country}: ${sessions.toLocaleString()} sessions`}
              />
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          {sortedCountries.length} countries with active traffic
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MapPinIcon className="w-5 h-5 mr-2 text-green-400" />
          Top Countries by Sessions
        </h3>
        
        <div className="space-y-3">
          {sortedCountries.map(([country, sessions], index) => {
            const percentage = (sessions / Math.max(...sortedCountries.map(([, s]) => s))) * 100;
            const flag = getCountryFlag(country);
            
            return (
              <div key={country} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                  <span className="text-2xl mr-3">{flag}</span>
                  <span className="text-white text-sm">{country}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-green-400 font-medium w-16 text-right">{sessions.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Cities */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BuildingOfficeIcon className="w-5 h-5 mr-2 text-purple-400" />
          Top Cities by Sessions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedCities.map((cityData, index) => (
            <div key={`${cityData.city}-${cityData.country}`} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                  <span className="text-white text-sm font-medium">{cityData.city}</span>
                </div>
                <span className="text-purple-400 font-medium text-sm">{cityData.sessions.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-400">
                {cityData.region !== 'Unknown' && cityData.region !== cityData.city && `${cityData.region}, `}
                {cityData.country}
              </div>
            </div>
          ))}
        </div>
        
        {sortedCities.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No city data available
          </div>
        )}
      </div>

      {/* Geographic Insights */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <GlobeAltIcon className="w-5 h-5 mr-2 text-yellow-400" />
          Geographic Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-blue-400 mb-1">{sortedCountries.length}</div>
            <div className="text-gray-400 text-sm">Countries</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-green-400 mb-1">{sortedCities.length}</div>
            <div className="text-gray-400 text-sm">Cities</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {sortedCountries.length > 0 ? 
                Math.round((sortedCountries[0][1] / Object.values(data.countryBreakdown).reduce((a, b) => a + b, 0)) * 100) : 0
              }%
            </div>
            <div className="text-gray-400 text-sm">Top Country Share</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get country flags
function getCountryFlag(country: string): string {
  const flagMap: Record<string, string> = {
    'United States': '🇺🇸',
    'India': '🇮🇳',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'South Korea': '🇰🇷',
    'Russia': '🇷🇺',
    'China': '🇨🇳',
    'Singapore': '🇸🇬',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'Norway': '🇳🇴'
  };
  
  return flagMap[country] || '🌍';
}

export default GeographicAnalytics;
