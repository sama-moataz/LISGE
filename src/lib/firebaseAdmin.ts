
// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let adminDBInstance: admin.firestore.Firestore | undefined;
let adminAuthInstance: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  if (!serviceAccountPath) {
    console.warn(
      'WARNING: GOOGLE_APPLICATION_CREDENTIALS environment variable is NOT SET. ' +
      'Firebase Admin SDK will attempt to initialize with application default credentials. ' +
      'This might only work in specific Google Cloud environments (e.g., Cloud Functions, App Engine). ' +
      'For local development and most other deployments, you MUST provide a service account JSON file path via this variable.'
    );
    try {
      admin.initializeApp();
      console.log('Firebase Admin SDK: Initialized with application default credentials.');
    } catch (e: any) {
      console.error('Firebase Admin SDK: CRITICAL - Initialization FAILED with default credentials:', e.message);
      console.error('Firebase Admin SDK: Ensure your environment is set up for default credentials or set GOOGLE_APPLICATION_CREDENTIALS.');
    }
  } else {
    console.log('Firebase Admin SDK: GOOGLE_APPLICATION_CREDENTIALS is SET. Path:', serviceAccountPath);
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      console.log('Firebase Admin SDK: Initialized successfully with service account from path:', serviceAccountPath);
    } catch (e: any) {
      console.error('Firebase Admin SDK: CRITICAL - Initialization FAILED with service account. Path used:', serviceAccountPath, 'Error:', e.message);
      console.error('Firebase Admin SDK: Ensure the GOOGLE_APPLICATION_CREDENTIALS path is correct, the file exists, is valid JSON, and the Node.js process has read permissions.');
    }
  }

  // Verify initialization and attempt to get instances
  if (admin.apps.length > 0) {
    try {
      adminDBInstance = admin.firestore();
      adminAuthInstance = admin.auth();
      if (adminDBInstance && adminAuthInstance) {
        console.log('Firebase Admin SDK: Successfully retrieved Firestore and Auth instances. Admin SDK should be operational.');
      } else {
        console.error('Firebase Admin SDK: CRITICAL - admin.firestore() or admin.auth() returned undefined/null even after app initialization. This is unexpected.');
      }
    } catch (e: any) {
      console.error('Firebase Admin SDK: CRITICAL - Error when trying to get Firestore/Auth instance after app initialization:', e.message);
    }
  } else {
    console.error('Firebase Admin SDK: CRITICAL - admin.apps.length is 0. Initialization definitely failed.');
  }

} else {
  console.log('Firebase Admin SDK: Already initialized (admin.apps.length > 0). Retrieving existing instances.');
  // This block executes if the SDK was initialized elsewhere or in a previous hot reload cycle.
  // It's generally safer to ensure instances are always freshly retrieved from the default app if available.
  try {
    if (!adminDBInstance) adminDBInstance = admin.firestore();
    if (!adminAuthInstance) adminAuthInstance = admin.auth();
     if (adminDBInstance && adminAuthInstance) {
        console.log('Firebase Admin SDK: Re-confirmed Firestore and Auth instances from existing app.');
      }
  } catch (e:any) {
      console.error('Firebase Admin SDK: Error retrieving instances from existing app:', e.message);
  }
}

// Export the potentially undefined instances. Service functions MUST check them.
export const adminDB = adminDBInstance;
export const adminAuth = adminAuthInstance;
