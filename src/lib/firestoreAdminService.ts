
// src/lib/firestoreAdminService.ts
import { adminDB } from '@/lib/firebaseAdmin';
import type { Scholarship } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';

function ensureAdminDBInitialized() {
  if (typeof adminDB === 'undefined' || !adminDB || typeof adminDB.collection !== 'function') {
    const errorMessage = "SERVER_CONFIG_ERROR: Firebase Admin SDK (adminDB) is not properly initialized. This is a critical server configuration issue. Possible causes: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set, path is incorrect, service account file is malformed/missing, or Node.js process lacks read permissions. Detailed Admin SDK initialization logs should be in the server console (check firebaseAdmin.ts logs).";
    console.error("[firestoreAdminService] CRITICAL CHECK FAILED:", errorMessage);
    throw new Error(errorMessage);
  }
   console.log("[firestoreAdminService] AdminDB initialized check passed.");
}

export async function addScholarshipAdmin(scholarshipData: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log("[firestoreAdminService] addScholarshipAdmin: Attempting to add data:", JSON.stringify(scholarshipData, null, 2));
  ensureAdminDBInitialized(); // Explicit check
  
  const dataToSave: Partial<Scholarship> & { createdAt: any, updatedAt: any } = {
    name: scholarshipData.name || '',
    description: scholarshipData.description || '',
    eligibility: scholarshipData.eligibility || '',
    websiteUrl: scholarshipData.websiteUrl || '',
    location: scholarshipData.location || 'International',
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
    imageUrl: scholarshipData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  try {
    const scholarshipsRef = adminDB!.collection(SCHOLARSHIPS_COLLECTION); // Added non-null assertion as ensureAdminDBInitialized would have thrown
    const docRef = await scholarshipsRef.add(dataToSave as any);
    console.log("[firestoreAdminService] addScholarshipAdmin: Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) { 
    console.error("[firestoreAdminService] addScholarshipAdmin: CRITICAL ERROR during Admin SDK Firestore 'add' operation:", error);
    throw new Error(`Admin SDK Firestore Error: ${error.message || 'Failed to add scholarship using Admin SDK. Check server console for details.'}`);
  }
}

export async function updateScholarshipAdmin(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`[firestoreAdminService] updateScholarshipAdmin: Attempting to update ID ${id} with data:`, JSON.stringify(scholarshipData, null, 2));
  ensureAdminDBInitialized();
  
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
  dataToUpdate.updatedAt = Timestamp.now();

  try {
    const scholarshipDocRef = adminDB!.collection(SCHOLARSHIPS_COLLECTION).doc(id);
    await scholarshipDocRef.update(dataToUpdate);
    console.log(`[firestoreAdminService] updateScholarshipAdmin: Successfully updated document with ID: ${id}`);
  } catch (error: any) {
    console.error(`[firestoreAdminService] updateScholarshipAdmin: ERROR updating scholarship ${id} with Admin SDK:`, error);
    throw new Error(`Admin SDK Firestore Error: ${error.message || `Failed to update scholarship ${id}. Check server console.`}`);
  }
}

export async function deleteScholarshipAdmin(id: string): Promise<void> {
  console.log(`[firestoreAdminService] deleteScholarshipAdmin: Attempting to delete ID: ${id}`);
  ensureAdminDBInitialized();
  try {
    const scholarshipDocRef = adminDB!.collection(SCHOLARSHIPS_COLLECTION).doc(id);
    await scholarshipDocRef.delete();
    console.log(`[firestoreAdminService] deleteScholarshipAdmin: Successfully deleted document with ID: ${id}`);
  } catch (error: any) {
    console.error(`[firestoreAdminService] deleteScholarshipAdmin: Error deleting scholarship ${id} with Admin SDK:`, error);
    throw new Error(`Admin SDK Firestore Error: ${error.message || `Failed to delete scholarship ${id}. Check server console.`}`);
  }
}
