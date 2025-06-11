
// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  if (!serviceAccountPath) {
    console.warn(
      'WARNING: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. ' +
      'Firebase Admin SDK will try to initialize with default credentials, which might only work in specific Google Cloud environments. ' +
      'For local development and most deployments, provide a service account JSON file path via this variable.'
    );
    try {
      admin.initializeApp();
      console.log('Firebase Admin SDK initialized with application default credentials.');
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed with default credentials:', e.message);
      // Optionally, rethrow or handle appropriately if default init is critical and fails
    }
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        // Add your databaseURL here if not using a Google Cloud environment
        // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL 
        // (Note: databaseURL is for Realtime Database, not typically needed for Firestore Admin SDK unless specifically using RTDB features)
      });
      console.log('Firebase Admin SDK initialized with service account.');
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed with service account:', e.message);
      console.error('Ensure the GOOGLE_APPLICATION_CREDENTIALS path is correct and the file is valid JSON.');
      // Rethrow or handle critical initialization failure
      throw e;
    }
  }
}

const adminAuth = admin.auth();
const adminDB = admin.firestore();

export { adminAuth, adminDB };
