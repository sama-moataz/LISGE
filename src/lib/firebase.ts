
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  // GoogleAuthProvider, // No longer needed here for login page
  // PhoneAuthProvider, // No longer needed here for login page
  // RecaptchaVerifier // No longer needed here for login page
} from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
  const errorMessage = "CRITICAL_CONFIG_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, empty, not a string, or not loaded properly from .env.local. Application cannot initialize Firebase. Please verify your .env.local file in the project root and restart your Next.js development server.";
  console.error(errorMessage);
  // For server-side, throw to halt if critical config is missing.
  // For client-side, this error will likely be caught by initializeApp if this check somehow passes.
  if (typeof window === 'undefined') { 
    throw new Error(errorMessage);
  }
}

const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional, keep if used elsewhere
};

console.log("Attempting to load Firebase config from environment variables:");
console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING or empty");
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
     if (!firebaseConfig.authDomain || !firebaseConfig.projectId) {
        const errorMsg = `CRITICAL_CONFIG_ERROR: Essential Firebase config values (authDomain, projectId) are missing or undefined in firebaseConfig. Check .env.local and restart server. AuthDomain: ${firebaseConfig.authDomain}, ProjectID: ${firebaseConfig.projectId}`;
        console.error(errorMsg);
        if (typeof window === 'undefined') {
            throw new Error(errorMsg);
        }
    }
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialization attempted.');
  } catch (error: any) {
    console.error('CRITICAL_ERROR_DURING_FIREBASE_INIT:', error.message, error.code);
    console.error('Attempted Firebase Config (API Key Redacted):', JSON.stringify({ ...firebaseConfig, apiKey: firebaseConfig.apiKey ? 'REDACTED' : 'MISSING/INVALID' }));
    throw error; 
  }
} else {
  app = getApp();
  console.log('Existing Firebase app retrieved.');
}

const auth = getAuth(app);
const db = getFirestore(app);
// const googleAuthProvider = new GoogleAuthProvider(); // No longer needed for login page

// RecaptchaVerifier is still exported for potential future use or if other parts of the app might use phone auth.
// If truly not needed anywhere, it can be fully removed.
export { app, auth, db, serverTimestamp };
// Export RecaptchaVerifier separately if it's needed elsewhere but not in this direct context
export { RecaptchaVerifier } from 'firebase/auth';
