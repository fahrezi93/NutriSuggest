import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with popup resolver to prevent COOP errors
export const auth = getAuth(app);
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = false;

// Use popup redirect resolver to handle popup issues
auth.useDeviceLanguage();

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with better popup handling
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add parameters to prevent popup blocking
  auth_type: 'reauthenticate'
});

// Add error handling for popup issues
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app; 