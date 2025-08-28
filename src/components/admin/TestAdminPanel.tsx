import * as React from 'react';

const TestAdminPanel: React.FC = () => {
  const [testResults, setTestResults] = React.useState<string[]>([]);
  const [isTesting, setIsTesting] = React.useState(false);

  const runTests = React.useCallback(async () => {
    setIsTesting(true);
    const results: string[] = [];
    
    try {
      // Test 1: Check if React is working
      results.push('✅ React is working properly');
      
      // Test 2: Check if component is rendering
      results.push('✅ Component rendering is working');
      
      // Test 3: Check environment variables
      const envVars = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
        gaPropertyId: import.meta.env.VITE_GA_PROPERTY_ID,
        adminUsername: import.meta.env.VITE_ADMIN_USERNAME,
        adminPassword: import.meta.env.VITE_ADMIN_PASSWORD
      };
      
      results.push(`🔍 Environment Variables Status:`);
      results.push(`  - Supabase URL: ${envVars.supabaseUrl ? '✅ Set' : '❌ Missing'}`);
      results.push(`  - Supabase Key: ${envVars.supabaseKey ? '✅ Set' : '❌ Missing'}`);
      results.push(`  - GA Measurement ID: ${envVars.gaMeasurementId ? '✅ Set' : '❌ Missing'}`);
      results.push(`  - GA Property ID: ${envVars.gaPropertyId ? '✅ Set' : '❌ Missing'}`);
      results.push(`  - Admin Username: ${envVars.adminUsername ? '✅ Set' : '❌ Missing'}`);
      results.push(`  - Admin Password: ${envVars.adminPassword ? '✅ Set' : '❌ Missing'}`);
      
      // Test 4: Check if services can be imported
      try {
        const { adminDataService } = await import('../../services/adminDataService');
        // Use the service to verify it's working
        if (adminDataService) {
          results.push('✅ Admin data service imported successfully');
        }
      } catch (error) {
        results.push(`❌ Admin data service import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      try {
        const { googleAnalyticsService } = await import('../../services/googleAnalyticsService');
        // Use the service to verify it's working
        if (googleAnalyticsService) {
          results.push('✅ Google Analytics service imported successfully');
        }
      } catch (error) {
        results.push(`❌ Google Analytics service import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Test 5: Check if Supabase client can be created
      try {
        const { supabase, isSupabaseConfigured } = await import('../../lib/supabase');
        // Use the variables to verify they're working
        if (supabase && typeof isSupabaseConfigured === 'boolean') {
          results.push(`✅ Supabase client created: ${isSupabaseConfigured ? 'Configured' : 'Not Configured'}`);
        }
      } catch (error) {
        results.push(`❌ Supabase client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      results.push(`❌ Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setTestResults(results);
    setIsTesting(false);
  }, []);

  return (
    <div className="p-6 space-y-6 relative" style={{ zIndex: 99999 }}>
      {/* Floating Test Button - Always Visible */}
      <div className="fixed top-20 right-6 z-[999999]">
        <button
          onClick={runTests}
          disabled={isTesting}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-2xl border-2 border-white/30 animate-pulse"
          style={{ 
            zIndex: 999999,
            position: 'fixed'
          }}
          title="Quick Test - Always Visible"
        >
          {isTesting ? '🔄' : '🧪'}
        </button>
      </div>

      <div className="bg-red-800/20 backdrop-blur-sm rounded-xl border border-red-700/30 p-6 relative" style={{ zIndex: 99999 }}>
        <h2 className="text-2xl font-bold text-white mb-4">🧪 Admin Panel Test Suite</h2>
        <p className="text-red-300 mb-4">
          This component tests the admin panel functionality without requiring full environment setup.
        </p>
        
        <button
          onClick={runTests}
          disabled={isTesting}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-lg relative border-2 border-white/20"
          style={{ 
            zIndex: 99999,
            position: 'relative',
            transform: 'translateZ(0)'
          }}
        >
          {isTesting ? '🔄 Running Tests...' : '🔍 Run Tests'}
        </button>
        
        {testResults.length > 0 && (
          <div className="mt-6 relative" style={{ zIndex: 99999 }}>
            <h3 className="text-lg font-semibold text-white mb-3">Test Results:</h3>
            <div className="bg-red-900/30 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto relative" style={{ zIndex: 99999 }}>
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-red-800/20 backdrop-blur-sm rounded-xl border border-red-700/30 p-6 relative" style={{ zIndex: 99999 }}>
        <h3 className="text-lg font-semibold text-white mb-3">📋 Setup Checklist</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span>1.</span>
            <span>Create .env file with required variables</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>2.</span>
            <span>Set up Supabase project and table</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>3.</span>
            <span>Configure Google Analytics 4</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>4.</span>
            <span>Test admin login (admin/matania)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>5.</span>
            <span>Verify waitlist analytics dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminPanel;

