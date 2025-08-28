import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

const ConfigStatus: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [configStatus, setConfigStatus] = useState({
    supabase: false,
    gaMeasurement: false,
    gaProperty: false,
    gaClient: false
  });

  useEffect(() => {
    // Check environment variables
    setConfigStatus({
      supabase: isSupabaseConfigured,
      gaMeasurement: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
      gaProperty: !!import.meta.env.VITE_GA_PROPERTY_ID,
      gaClient: !!import.meta.env.VITE_GA_CLIENT_ID
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50 border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">🔧 Config Status</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Supabase:</span>
          <span className={configStatus.supabase ? 'text-green-400' : 'text-red-400'}>
            {configStatus.supabase ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>GA Measurement ID:</span>
          <span className={configStatus.gaMeasurement ? 'text-green-400' : 'text-red-400'}>
            {configStatus.gaMeasurement ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>GA Property ID:</span>
          <span className={configStatus.gaProperty ? 'text-green-400' : 'text-red-400'}>
            {configStatus.gaProperty ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>GA Client ID:</span>
          <span className={configStatus.gaClient ? 'text-green-400' : 'text-red-400'}>
            {configStatus.gaClient ? '✅' : '❌'}
          </span>
        </div>
      </div>

      {!configStatus.supabase && (
        <div className="mt-3 p-2 bg-red-900/50 rounded text-xs">
          <strong>Missing Supabase credentials!</strong>
          <br />Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
        </div>
      )}

      {configStatus.gaMeasurement && configStatus.gaProperty && configStatus.gaClient && (
        <div className="mt-3 p-2 bg-green-900/50 rounded text-xs">
          <strong>Google Analytics configured!</strong>
          <br />Ready to track user behavior
        </div>
      )}
    </div>
  );
};

export default ConfigStatus;

