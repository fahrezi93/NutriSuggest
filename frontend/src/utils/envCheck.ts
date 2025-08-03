// Environment variables checker
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
};

// Check environment variables on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔧 Checking environment variables...');
    const allSet = checkEnvironmentVariables();
    
    if (!allSet) {
      console.error('❌ Environment variables not set properly. Please check Vercel dashboard.');
    }
  }, 2000);
} 