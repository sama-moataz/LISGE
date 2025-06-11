
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Log all relevant environment variables to see what's being loaded
console.log('Attempting to load Firebase config from environment variables:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey || apiKey.trim() === "") {
  console.error("Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or empty in your environment variables.");
  // Throw an error to prevent Firebase from initializing with an invalid key,
  // which might make debugging harder.
  // Note: In a real production app, you might handle this more gracefully
  // or ensure build fails if env vars are missing.
  throw new Error("CRITICAL_ERROR: Firebase API Key is not configured. Check your .env.local file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set correctly.");
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

console.log('Constructed firebaseConfig:', firebaseConfig);

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    // Re-throw the error or handle it as appropriate for your app
    throw error;
  }
} else {
  app = getApp();
  console.log('Existing Firebase app retrieved.');
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
