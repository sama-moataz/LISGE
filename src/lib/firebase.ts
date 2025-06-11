
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// Log all relevant environment variables to see what's being loaded
console.log('Attempting to load Firebase config from environment variables:');
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

console.log('NEXT_PUBLIC_FIREBASE_API_KEY from env:', apiKey);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN from env:', authDomain);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID from env:', projectId);
// Note: storageBucket, messagingSenderId, appId are less critical for initial auth but good to check
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET from env:', storageBucket);
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID from env:', messagingSenderId);
console.log('NEXT_PUBLIC_FIREBASE_APP_ID from env:', appId);

if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
  const errorMessage = "CRITICAL_CONFIG_ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, empty, not a string, or not loaded properly from .env.local. Application cannot initialize Firebase. Please verify your .env.local file in the project root and restart your Next.js development server.";
  console.error(errorMessage);
  // Throwing an error here will stop server-side execution if the key is missing.
  // This should make the problem very clear in the terminal.
  if (typeof window === 'undefined') { // Only throw on server-side during build/dev
    throw new Error(errorMessage);
  }
  // For client-side, further execution will likely fail at initializeApp.
}

const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

console.log('Constructed firebaseConfig for initialization attempt:', firebaseConfig);

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    // Double-check essential keys before calling initializeApp
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
        const errorMsg = `CRITICAL_CONFIG_ERROR: One or more essential Firebase config values (apiKey, authDomain, projectId) are missing in the firebaseConfig object just before initializeApp. Values received: apiKey='${firebaseConfig.apiKey}', authDomain='${firebaseConfig.authDomain}', projectId='${firebaseConfig.projectId}'. Check .env.local and server restart.`;
        console.error(errorMsg);
        if (typeof window === 'undefined') {
            throw new Error(errorMsg);
        }
    }
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialization attempted. If you still see auth/invalid-api-key, the API KEY VALUE itself is likely incorrect or restricted.');
  } catch (error) {
    console.error('Error during Firebase initializeApp():', error);
    // Re-throw the error to ensure it's visible
    throw error;
  }
} else {
  app = getApp();
  console.log('Existing Firebase app retrieved.');
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();
// Ensure auth is passed to PhoneAuthProvider constructor
const phoneAuthProvider = new PhoneAuthProvider(auth);


export { app, auth, db, googleAuthProvider, phoneAuthProvider, RecaptchaVerifier, serverTimestamp };

