// Environment Configuration for Admin Panel
export const environment = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  },
  
  // Google Analytics Configuration
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    propertyId: import.meta.env.VITE_GA_PROPERTY_ID || '',
    clientId: import.meta.env.VITE_GA_CLIENT_ID || '',
    isConfigured: Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID && import.meta.env.VITE_GA_PROPERTY_ID)
  },
  
  // Admin Configuration
  admin: {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'matania'
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Circles Landing Page',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development'
  }
};

// Environment validation
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  if (!environment.supabase.isConfigured) {
    issues.push('❌ Supabase not configured - Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }
  
  if (!environment.googleAnalytics.isConfigured) {
    issues.push('❌ Google Analytics not configured - Set VITE_GA_MEASUREMENT_ID and VITE_GA_PROPERTY_ID');
  }
  
  if (issues.length === 0) {
    console.log('✅ Environment configuration is valid');
  } else {
    console.warn('⚠️ Environment configuration issues found:');
    issues.forEach(issue => console.warn(issue));
  }
  
  return issues;
};

// Export environment status for components
export const getEnvironmentStatus = () => ({
  supabase: environment.supabase.isConfigured,
  googleAnalytics: environment.googleAnalytics.isConfigured,
  admin: Boolean(environment.admin.username && environment.admin.password)
});
