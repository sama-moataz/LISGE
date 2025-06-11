
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  PhoneAuthProvider, 
  RecaptchaVerifier
} from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore'; // Corrected import for serverTimestamp

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
  apiKey: apiKey,
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
    // Minimal check for essential config values before attempting init
    if (!firebaseConfig.authDomain || !firebaseConfig.projectId) {
        const errorMsg = `CRITICAL_CONFIG_ERROR: Essential Firebase config values (authDomain, projectId) are missing in firebaseConfig. Check .env.local and restart server.`;
        console.error(errorMsg);
        if (typeof window === 'undefined') { // Server-side
            throw new Error(errorMsg);
        }
    }
    app = initializeApp(firebaseConfig);
    // console.log('Firebase app initialization attempted successfully.');
  } catch (error: any) {
    console.error('CRITICAL_ERROR_DURING_FIREBASE_INIT:', error.message, error.code);
    // Log the config that was attempted, but be careful not to leak sensitive info in production logs if this code path is ever hit
    // console.error('Attempted Firebase Config:', JSON.stringify(firebaseConfig, (key, value) => key === 'apiKey' ? 'REDACTED' : value));
    throw error; // Re-throw to ensure visibility and stop further execution
  }
} else {
  app = getApp();
  // console.log('Existing Firebase app retrieved.');
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();
// PhoneAuthProvider doesn't need to be exported if used inline with signInWithPhoneNumber

export { app, auth, db, googleAuthProvider, RecaptchaVerifier, serverTimestamp };
