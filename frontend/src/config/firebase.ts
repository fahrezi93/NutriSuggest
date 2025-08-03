import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhuJGVaC4Rhl8RzAYQB9BM3Yc1goe-434",
  authDomain: "nutrisuggest-ecaed.firebaseapp.com",
  projectId: "nutrisuggest-ecaed",
  storageBucket: "nutrisuggest-ecaed.firebasestorage.app",
  messagingSenderId: "492864704692",
  appId: "1:492864704692:web:5d6c34e30d91c2e16a07e1",
  measurementId: "G-PSPT37424E"
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