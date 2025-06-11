
'use server';

import { db } from '@/lib/firebase';
import type { Scholarship } from '@/types';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  getDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth } from '@/lib/firebase';


const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';

const mapDocToScholarship = (docSnapshot: any): Scholarship => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    eligibility: data.eligibility || '',
    websiteUrl: data.websiteUrl || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    location: data.location || 'Global',
    ageRequirement: data.ageRequirement || undefined,
    fundingLevel: data.fundingLevel || undefined,
    destinationRegion: data.destinationRegion || undefined,
    targetLevel: data.targetLevel || undefined,
    fundingCountry: data.fundingCountry || undefined,
    partner: data.partner || undefined,
    coverage: data.coverage || undefined,
    deadline: data.deadline || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
  } as Scholarship;
};


export async function getScholarships(): Promise<Scholarship[]> {
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const q = query(scholarshipsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToScholarship);
  } catch (error) {
    console.error("[firestoreService] Error fetching scholarships: ", error);
    throw new Error("Failed to fetch scholarships.");
  }
}

export async function getScholarshipById(id: string): Promise<Scholarship | null> {
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    const docSnap = await getDoc(scholarshipDocRef);
    if (docSnap.exists()) {
      return mapDocToScholarship(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching scholarship with ID ${id}: `, error);
    throw new Error(`Failed to fetch scholarship ${id}.`);
  }
}

export async function addScholarship(scholarshipData: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log("[firestoreService] addScholarship (Server Action): Received data:", scholarshipData);
  const initialAuthUser = auth.currentUser;
  console.log(`[firestoreService] addScholarship (Server Action): auth.currentUser?.uid at START of function: ${initialAuthUser?.uid || 'auth.currentUser IS NULL/STALE at start'}`);

  const dataToSave: Partial<Scholarship> & { createdAt: any, updatedAt: any } = {
    // Ensure all required fields from schema are present or explicitly nulled if optional
    name: scholarshipData.name || '',
    description: scholarshipData.description || '',
    eligibility: scholarshipData.eligibility || '',
    websiteUrl: scholarshipData.websiteUrl || '',
    location: scholarshipData.location || 'International', // Default location

    // Optional fields: set to null if not provided or empty string from form
    iconName: scholarshipData.iconName && scholarshipData.iconName !== '_none_' ? scholarshipData.iconName : null,
    category: scholarshipData.category || null,
    ageRequirement: scholarshipData.ageRequirement && scholarshipData.ageRequirement !== '_none_' ? scholarshipData.ageRequirement : null,
    fundingLevel: scholarshipData.fundingLevel && scholarshipData.fundingLevel !== '_none_' ? scholarshipData.fundingLevel : null,
    destinationRegion: scholarshipData.destinationRegion && scholarshipData.destinationRegion !== '_none_' ? scholarshipData.destinationRegion : null,
    targetLevel: scholarshipData.targetLevel && scholarshipData.targetLevel !== '_none_' ? scholarshipData.targetLevel : null,
    fundingCountry: scholarshipData.fundingCountry && scholarshipData.fundingCountry !== '_none_' ? scholarshipData.fundingCountry : null,
    partner: scholarshipData.partner || null,
    coverage: scholarshipData.coverage || null,
    deadline: scholarshipData.deadline || null,
    imageUrl: scholarshipData.imageUrl || null, // Assuming empty string from form becomes null via client-side processing or here

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  delete (dataToSave as any).id; 
  
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    console.log("[firestoreService] addScholarship (Server Action): Attempting to save data to Firestore:", dataToSave);
    console.log(`[firestoreService] addScholarship (Server Action): auth.currentUser?.uid JUST BEFORE addDoc: ${auth.currentUser?.uid || 'auth.currentUser IS NULL/STALE before addDoc'}`);
    
    const docRef = await addDoc(scholarshipsRef, dataToSave as any);
    console.log("[firestoreService] addScholarship (Server Action): Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) { 
    const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SERVER_ACTION_CATCH_BLOCK';
    console.error("--------------------------------------------------------------------");
    console.error("[firestoreService] CRITICAL ERROR adding scholarship to Firestore (Server Action)!");
    console.error(`[firestoreService] UID available in Server Action auth context (auth.currentUser.uid) at time of error: ${currentAuthUserUidInCatch}`);
    console.error("[firestoreService] Original Firebase Error Object:", error);
    console.error("[firestoreService] Firebase Error Code:", error.code); 
    console.error("[firestoreService] Firebase Error Message:", error.message); 
    if (error.details) console.error("[firestoreService] Firebase Error Details:", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO SAVE:", dataToSave);
    console.error("--------------------------------------------------------------------");
    
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
      const detailedErrorMessage =
        `ACTION REQUIRED: Firestore Permission Denied when Server Action 'addScholarship' tried to write. ` +
        `Firebase Original Message: "${error.message}". ` +
        `This usually means 'request.auth' was 'null' in your Firestore security rules because the Server Action's execution context was not recognized as authenticated by Firebase when using the client SDK. ` +
        `UID available in Server Action's auth context (auth.currentUser.uid) at time of error: '${currentAuthUserUidInCatch}'. ` +
        `Client-side logs (from form submission) should show the UID the client believes is active. ` +
        `TROUBLESHOOTING STEPS FOR SERVER ACTION PERMISSIONS: ` +
        `1. VERIFY FIREBASE RULES: The rule is likely 'allow create: if request.auth != null && get(/.../USERS/$(request.auth.uid)).data.role == "Admin";'. The 'request.auth != null' part is likely the point of failure in the server context. ` +
        `2. SERVER ACTION AUTH CONTEXT: Using the Firebase *client* SDK in Server Actions for writes requires careful handling of authentication context. 'auth.currentUser' from client SDK is often null/stale on server. ` +
        `3. Consider using Firebase Admin SDK for backend operations if this pattern persists. Admin SDK calls from a trusted server environment can bypass client security rules if needed, or impersonate users. ` +
        `4. SIMULATOR: Use Firestore Rules Simulator: Test with 'request.auth' as NULL (simulating unauthenticated server call), and then as your admin UID to see how the rule 'get(/.../USERS/$(request.auth.uid))' behaves. ` +
        `5. SERVER LOGS: Examine the full original Firebase error and the 'auth.currentUser.uid' logs in your SERVER CONSOLE (Next.js terminal).`;
      throw new Error(detailedErrorMessage);
    }
    throw new Error(`Failed to add scholarship. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function updateScholarship(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`[firestoreService] updateScholarship (Server Action): Received data for ID ${id}:`, scholarshipData);
  const initialAuthUser = auth.currentUser;
  console.log(`[firestoreService] updateScholarship (Server Action): auth.currentUser?.uid at START of function: ${initialAuthUser?.uid || 'auth.currentUser IS NULL/STALE at start'}`);
  
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(scholarshipData) as Array<keyof typeof scholarshipData>).forEach(key => {
      const value = scholarshipData[key];
      if (value === undefined || value === null || value === '_none_') {
          dataToUpdate[key] = null;
      } else if (typeof value === 'string' && value.trim() === '' && 
                 (key === 'imageUrl' || key === 'iconName' || key === 'category' || 
                  key === 'ageRequirement' || key === 'fundingLevel' || key === 'destinationRegion' || 
                  key === 'targetLevel' || key === 'fundingCountry' || key === 'partner' || 
                  key === 'coverage' || key === 'deadline')) {
          dataToUpdate[key] = null;
      }
      else {
          dataToUpdate[key] = value;
      }
  });
  dataToUpdate.updatedAt = serverTimestamp();

  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    console.log(`[firestoreService] updateScholarship (Server Action): Attempting to update data in Firestore (ID: ${id}):`, dataToUpdate);
    console.log(`[firestoreService] updateScholarship (Server Action): auth.currentUser?.uid JUST BEFORE updateDoc: ${auth.currentUser?.uid || 'auth.currentUser IS NULL/STALE before updateDoc'}`);
    await updateDoc(scholarshipDocRef, dataToUpdate);
    console.log(`[firestoreService] updateScholarship (Server Action): Successfully updated document with ID: ${id}`);
  } catch (error: any) {
    const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SERVER_ACTION_CATCH_BLOCK';
    console.error("--------------------------------------------------------------------");
    console.error(`[firestoreService] ERROR updating scholarship ${id} in Firestore (Server Action)!`);
    console.error(`[firestoreService] UID available in Server Action auth context (auth.currentUser.uid) at time of error: ${currentAuthUserUidInCatch}`);
    console.error("[firestoreService] Original Firebase Error Object (update):", error);
    console.error("[firestoreService] Firebase Error Code (update):", error.code);
    console.error("[firestoreService] Firebase Error Message (update):", error.message);
    if (error.details) console.error("[firestoreService] Firebase Error Details (update):", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO UPDATE (ID: " + id + "):", dataToUpdate);
    console.error("--------------------------------------------------------------------");
    
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        const detailedErrorMessage =
          `ACTION REQUIRED: Firestore Permission Denied when Server Action 'updateScholarship' tried to write (ID: ${id}). ` +
          `Firebase Original Message: "${error.message}". ` +
          `This usually means 'request.auth' was 'null' in your Firestore security rules because the Server Action's execution context was not recognized as authenticated by Firebase when using the client SDK. ` +
          `UID available in Server Action's auth context (auth.currentUser.uid) at time of error: '${currentAuthUserUidInCatch}'. ` +
          `TROUBLESHOOTING STEPS FOR SERVER ACTION PERMISSIONS: ` +
          `1. VERIFY FIREBASE RULES: Rule is 'allow update: if request.auth != null && get(/.../USERS/$(request.auth.uid)).data.role == "Admin";'. The 'request.auth != null' part is likely failing. ` +
          `2. AUTH CONTEXT: Using the Firebase *client* SDK in Server Actions for writes requires careful handling of authentication context. ` +
          `3. ADMIN SDK: Consider Firebase Admin SDK for backend operations. ` +
          `4. SIMULATOR: Use Firestore Rules Simulator with 'request.auth' as NULL and then as your admin UID. ` +
          `5. SERVER LOGS: Examine the full original Firebase error and auth logs in your SERVER CONSOLE.`;
        throw new Error(detailedErrorMessage);
    }
    throw new Error(`Failed to update scholarship ${id}. Server error: ${error.message || 'Unknown Firestore error. Check server console for full details.'}`);
  }
}

export async function deleteScholarship(id: string): Promise<void> {
  console.log(`[firestoreService] deleteScholarship (Server Action): Attempting to delete ID: ${id}`);
  const initialAuthUser = auth.currentUser;
  console.log(`[firestoreService] deleteScholarship (Server Action): auth.currentUser?.uid at START of function: ${initialAuthUser?.uid || 'auth.currentUser IS NULL/STALE at start'}`);
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    console.log(`[firestoreService] deleteScholarship (Server Action): auth.currentUser?.uid JUST BEFORE deleteDoc: ${auth.currentUser?.uid || 'auth.currentUser IS NULL/STALE before deleteDoc'}`);
    await deleteDoc(scholarshipDocRef);
    console.log(`[firestoreService] deleteScholarship (Server Action): Successfully deleted document with ID: ${id}`);
  } catch (error: any) {
    const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SERVER_ACTION_CATCH_BLOCK';
    console.error(`[firestoreService] Error deleting scholarship ${id} (Server Action): `, error);
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        const detailedErrorMessage =
          `ACTION REQUIRED: Firestore Permission Denied when Server Action 'deleteScholarship' tried to delete (ID: ${id}). ` +
          `Firebase Original Message: "${error.message}". ` +
          `This usually means 'request.auth' was 'null' in Firestore rules. ` +
          `UID available in Server Action's auth context at time of error: '${currentAuthUserUidInCatch}'. ` +
          `TROUBLESHOOTING: Check rule 'allow delete: if request.auth != null && get(/.../USERS/$(request.auth.uid)).data.role == "Admin";', auth context in Server Actions, or consider Admin SDK. Use Rules Simulator. Check SERVER LOGS.`;
        throw new Error(detailedErrorMessage);
    }
    throw new Error(`Failed to delete scholarship ${id}.`);
  }
}

export async function seedInitialScholarships(scholarshipsToSeed: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  console.log("[firestoreService] seedInitialScholarships (Server Action): Checking if seeding is needed.");
  const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
  
  // Check if ANY scholarships exist. If so, don't seed.
  const existingQuerySnapshot = await getDocs(query(scholarshipsRef, orderBy('createdAt', 'desc')));
  if (!existingQuerySnapshot.empty) {
      console.log(`[firestoreService] seedInitialScholarships: Found ${existingQuerySnapshot.size} existing scholarships. Seeding aborted to prevent duplicates.`);
      return;
  }

  console.log("[firestoreService] seedInitialScholarships: No existing scholarships found. Proceeding with seeding.");
  const batch = writeBatch(db);
  let seededCount = 0;

  scholarshipsToSeed.forEach(scholarship => {
    const newDocRef = doc(scholarshipsRef); 
    const dataToSave = {
      ...scholarship,
      iconName: scholarship.iconName && scholarship.iconName !== '_none_' ? scholarship.iconName : null,
      category: scholarship.category || null,
      ageRequirement: scholarship.ageRequirement && scholarship.ageRequirement !== '_none_' ? scholarship.ageRequirement : null,
      fundingLevel: scholarship.fundingLevel && scholarship.fundingLevel !== '_none_' ? scholarship.fundingLevel : null,
      destinationRegion: scholarship.destinationRegion && scholarship.destinationRegion !== '_none_' ? scholarship.destinationRegion : null,
      targetLevel: scholarship.targetLevel && scholarship.targetLevel !== '_none_' ? scholarship.targetLevel : null,
      fundingCountry: scholarship.fundingCountry && scholarship.fundingCountry !== '_none_' ? scholarship.fundingCountry : null,
      partner: scholarship.partner || null,
      coverage: scholarship.coverage || null,
      deadline: scholarship.deadline || null,
      imageUrl: scholarship.imageUrl || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(newDocRef, dataToSave);
    seededCount++;
  });

  if (seededCount > 0) {
    try {
      await batch.commit();
      console.log(`[firestoreService] seedInitialScholarships: Successfully seeded ${seededCount} new scholarships.`);
    } catch (error: any) {
      console.error("[firestoreService] seedInitialScholarships: Error committing seed batch:", error);
      // Even if seeding fails, we re-throw. The admin needs to be aware.
      // The error message construction here matches other permission denied errors for consistency.
       const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SERVER_ACTION_CATCH_BLOCK_SEEDING';
       if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
         const detailedErrorMessage =
           `ACTION REQUIRED: Firestore Permission Denied when Server Action 'seedInitialScholarships' tried to write. ` +
           `Firebase Original Message: "${error.message}". ` +
           `UID available in Server Action's auth context at time of error: '${currentAuthUserUidInCatch}'. ` +
           `Ensure the account performing this action (if any is relevant for seeding) has permissions or that rules allow unauthenticated writes IF seeding is meant to be unprotected (not recommended for general ops).`;
         throw new Error(detailedErrorMessage);
       }
      throw new Error(`Failed to seed scholarships. Server error: ${error.message || 'Please check server console for details.'}`);
    }
  } else {
    console.log("[firestoreService] seedInitialScholarships: No new scholarships were in the provided seed data or all were filtered out.");
  }
}
