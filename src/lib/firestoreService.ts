
// src/lib/firestoreService.ts
// This file now primarily handles CLIENT-SDK Firestore operations, mainly reads for public pages.
// Admin CUD operations have been moved to firestoreAdminService.ts

import { db, auth } from '@/lib/firebase'; // Client SDK
import type { Scholarship } from '@/types';
import {
  collection,
  getDocs,
  doc,
  serverTimestamp, // Client SDK serverTimestamp
  query,
  orderBy,
  Timestamp, // Client SDK Timestamp
  getDoc,
  writeBatch,
} from 'firebase/firestore';

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

// READ operations for public pages (using client SDK)
export async function getScholarships(): Promise<Scholarship[]> {
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const q = query(scholarshipsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToScholarship);
  } catch (error) {
    console.error("[firestoreService] Error fetching scholarships (client SDK): ", error);
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
    console.error(`[firestoreService] Error fetching scholarship with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch scholarship ${id}.`);
  }
}

// Seeding (can be kept here, but for robust server-side seeding, Admin SDK is better)
export async function seedInitialScholarships(scholarshipsToSeed: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  'use server'; // Make this a server action if it's to be triggered from client by admin
  // For one-off scripts, Admin SDK is preferred.
  // If triggered by an admin from client, this Server Action will need robust auth checks.

  console.log("[firestoreService] seedInitialScholarships (Server Action): Checking if seeding is needed.");
  const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
  
  const existingQuerySnapshot = await getDocs(query(scholarshipsRef, orderBy('createdAt', 'desc')));
  if (!existingQuerySnapshot.empty) {
      console.log(`[firestoreService] seedInitialScholarships: Found ${existingQuerySnapshot.size} existing scholarships. Seeding aborted.`);
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
      createdAt: serverTimestamp(), // client SDK serverTimestamp
      updatedAt: serverTimestamp(), // client SDK serverTimestamp
    };
    batch.set(newDocRef, dataToSave);
    seededCount++;
  });

  if (seededCount > 0) {
    try {
      // CRITICAL: Authorization for seeding
      // If this Server Action is called from client, it MUST verify admin status.
      // Example:
      // const user = auth.currentUser; // This might be null or stale in Server Actions
      // if (!user || !(await checkUserIsAdmin(user.uid))) { throw new Error("Unauthorized"); }
      // For this example, we assume auth is handled if it's a protected Server Action.
      console.log(`[firestoreService] seedInitialScholarships (Server Action): Auth UID before commit: ${auth.currentUser?.uid || 'auth.currentUser is NULL/STALE'}`);

      await batch.commit();
      console.log(`[firestoreService] seedInitialScholarships: Successfully seeded ${seededCount} new scholarships.`);
    } catch (error: any) {
      console.error("[firestoreService] seedInitialScholarships: Error committing seed batch:", error);
      const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SERVER_ACTION_CATCH_BLOCK_SEEDING';
       if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
         const detailedErrorMessage =
           `ACTION REQUIRED: Firestore Permission Denied when Server Action 'seedInitialScholarships' tried to write. ` +
           `Firebase Original Message: "${error.message}". ` +
           `UID available in Server Action's auth context (if any): '${currentAuthUserUidInCatch}'. ` +
           `Ensure the Server Action is properly authenticated and authorized if called from client, or use Admin SDK for scripts.`;
         throw new Error(detailedErrorMessage);
       }
      throw new Error(`Failed to seed scholarships. Server error: ${error.message || 'Please check server console for details.'}`);
    }
  } else {
    console.log("[firestoreService] seedInitialScholarships: No new scholarships were provided for seeding.");
  }
}
