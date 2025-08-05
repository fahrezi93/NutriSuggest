// Debug utility for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Debug mode enabled');
  
  // Check environment variables
  const requiredEnvVars = [
    'REACT_APP_API_URL',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingEnvVars);
    console.log('💡 This is normal for local development. The app will work with mock data.');
  } else {
    console.log('✅ All environment variables are set');
  }
  
  // Expose useful objects to window for debugging
  (window as any).debug = {
    // Add any debug utilities here
    log: (message: string, data?: any) => {
      console.log(`[DEBUG] ${message}`, data);
    },
    error: (message: string, error?: any) => {
      console.error(`[DEBUG ERROR] ${message}`, error);
    },
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.REACT_APP_API_URL,
      FIREBASE_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'SET' : 'NOT SET'
    }
  };
}

// Export empty object to make this a module
export {}; 