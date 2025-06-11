
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, serverTimestamp } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Critical check for API Key presence
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
  const errorMessage = "CRITICAL_CONFIG_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, empty, not a string, or not loaded properly from .env.local. Application cannot initialize Firebase. Please verify your .env.local file in the project root and restart your Next.js development server.";
  console.error(errorMessage);
  // Throwing an error here will stop server-side execution if the key is missing during build/dev.
  if (typeof window === 'undefined') { 
    throw new Error(errorMessage);
  }
  // For client-side, further execution will likely fail at initializeApp if this check somehow passes.
}

const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey, // Use the checked apiKey
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    // Double-check other essential keys before calling initializeApp
    if (!firebaseConfig.authDomain || !firebaseConfig.projectId) {
        const errorMsg = `CRITICAL_CONFIG_ERROR: One or more essential Firebase config values (authDomain, projectId) are missing in the firebaseConfig object just before initializeApp. Check .env.local and server restart.`;
        console.error(errorMsg);
        if (typeof window === 'undefined') {
            throw new Error(errorMsg);
        }
    }
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialization attempted. If you still see auth/invalid-api-key, the API KEY VALUE in your .env.local is likely incorrect or restricted.');
  } catch (error) {
    console.error('Error during Firebase initializeApp():', error);
    throw error; // Re-throw to ensure visibility
  }
} else {
  app = getApp();
  console.log('Existing Firebase app retrieved.');
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();
const phoneAuthProvider = new PhoneAuthProvider(auth);


export { app, auth, db, googleAuthProvider, phoneAuthProvider, RecaptchaVerifier, serverTimestamp };

