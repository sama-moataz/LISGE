
// src/lib/firestoreAdminService.ts
// Note: This file uses the Firebase Admin SDK and should only be called from server-side environments (e.g., Server Actions, API routes).

import { adminDB } from '@/lib/firebaseAdmin';
import type { Scholarship } from '@/types';
import { Timestamp } from 'firebase-admin/firestore'; // Use Admin SDK Timestamp

const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';

export async function addScholarshipAdmin(scholarshipData: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log("[firestoreAdminService] addScholarshipAdmin: Received data:", scholarshipData);
  
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
    createdAt: Timestamp.now(), // Use admin.firestore.FieldValue.serverTimestamp() or Timestamp.now()
    updatedAt: Timestamp.now(),
  };
  
  try {
    const scholarshipsRef = adminDB.collection(SCHOLARSHIPS_COLLECTION);
    const docRef = await scholarshipsRef.add(dataToSave as any); // Type assertion as Admin SDK types might differ slightly
    console.log("[firestoreAdminService] addScholarshipAdmin: Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) { 
    console.error("[firestoreAdminService] CRITICAL ERROR adding scholarship with Admin SDK:", error);
    throw new Error(`Failed to add scholarship using Admin SDK. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function updateScholarshipAdmin(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`[firestoreAdminService] updateScholarshipAdmin: Received data for ID ${id}:`, scholarshipData);
  
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
    const scholarshipDocRef = adminDB.collection(SCHOLARSHIPS_COLLECTION).doc(id);
    await scholarshipDocRef.update(dataToUpdate);
    console.log(`[firestoreAdminService] updateScholarshipAdmin: Successfully updated document with ID: ${id}`);
  } catch (error: any) {
    console.error(`[firestoreAdminService] ERROR updating scholarship ${id} with Admin SDK:`, error);
    throw new Error(`Failed to update scholarship ${id} using Admin SDK. Server error: ${error.message || 'Unknown Firestore error.'}`);
  }
}

export async function deleteScholarshipAdmin(id: string): Promise<void> {
  console.log(`[firestoreAdminService] deleteScholarshipAdmin: Attempting to delete ID: ${id}`);
  try {
    const scholarshipDocRef = adminDB.collection(SCHOLARSHIPS_COLLECTION).doc(id);
    await scholarshipDocRef.delete();
    console.log(`[firestoreAdminService] deleteScholarshipAdmin: Successfully deleted document with ID: ${id}`);
  } catch (error: any) {
    console.error(`[firestoreAdminService] Error deleting scholarship ${id} with Admin SDK:`, error);
    throw new Error(`Failed to delete scholarship ${id} using Admin SDK.`);
  }
}

// Note: getScholarships and getScholarshipById for public reads can remain in a client-SDK based service file (e.g., firestoreClientService.ts)
// if they are intended for public access where security rules handle read permissions.
// If all Firestore interactions are to be centralized through Admin SDK (e.g., for an internal tool or if public pages also use Server Components with admin data access),
// then read functions could also be implemented here using adminDB.
