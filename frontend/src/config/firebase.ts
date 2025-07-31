import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 