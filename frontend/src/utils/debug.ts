// Debug utility to check environment variables and app state
export const debugApp = () => {
  console.log('🔍 === NUTRISUGGEST DEBUG ===');
  console.log('📍 Current URL:', window.location.href);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('📦 Public URL:', process.env.PUBLIC_URL);
  
  // Check environment variables
  const envVars = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'SET' : 'NOT SET',
    REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'SET' : 'NOT SET',
    REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET',
  };
  
  console.log('🔧 Environment Variables:', envVars);
  
  // Check if React is loaded
  console.log('⚛️ React loaded:', typeof window !== 'undefined' && 'React' in window);
  
  // Check if Firebase is loaded
  console.log('🔥 Firebase loaded:', typeof window !== 'undefined' && 'firebase' in window);
  
  // Check for errors
  const errors = [];
  if (!process.env.REACT_APP_FIREBASE_API_KEY) {
    errors.push('Firebase API Key not set');
  }
  if (!process.env.REACT_APP_API_URL) {
    errors.push('API URL not set');
  }
  
  if (errors.length > 0) {
    console.error('❌ Errors found:', errors);
  } else {
    console.log('✅ All environment variables are set');
  }
  
  console.log('🔍 === END DEBUG ===');
};

// Auto-run debug on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(debugApp, 1000); // Wait 1 second for everything to load
  });
} 