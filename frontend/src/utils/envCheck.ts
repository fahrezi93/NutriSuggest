// Environment check utility
export const checkEnvironmentVariables = () => {
  const requiredEnvVars = [
    'REACT_APP_API_URL',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Missing environment variables are normal');
      console.log('📝 Missing variables:', missingEnvVars);
      console.log('💡 The app will work with mock data and fallback configurations');
    } else {
      console.warn('⚠️ Production mode: Some environment variables are missing');
      console.warn('📝 Missing variables:', missingEnvVars);
    }
  } else {
    console.log('✅ All environment variables are properly configured');
  }
  
  return {
    isConfigured: missingEnvVars.length === 0,
    missingVars: missingEnvVars,
    hasApiUrl: !!process.env.REACT_APP_API_URL,
    hasFirebase: !!process.env.REACT_APP_FIREBASE_API_KEY
  };
};

// Auto-run check on import
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    checkEnvironmentVariables();
  }, 1000); // Wait for app to load
} 