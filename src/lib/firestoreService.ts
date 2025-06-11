
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

const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';

// Helper to convert Firestore doc data to Scholarship type
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


// --- Scholarship Functions ---

export async function getScholarships(): Promise<Scholarship[]> {
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const q = query(scholarshipsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToScholarship);
  } catch (error) {
    console.error("Error fetching scholarships: ", error);
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
    console.error(`Error fetching scholarship with ID ${id}: `, error);
    throw new Error(`Failed to fetch scholarship ${id}.`);
  }
}

export async function addScholarship(scholarshipData: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log("Data received by addScholarship service:", scholarshipData);
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    
    // Explicitly construct the object to save, ensuring all optional fields are null if not provided or empty
    // and required fields are present.
    const dataToSave: Partial<Scholarship> & { createdAt: any, updatedAt: any } = {
      name: scholarshipData.name, // Required
      description: scholarshipData.description, // Required
      eligibility: scholarshipData.eligibility, // Required
      websiteUrl: scholarshipData.websiteUrl, // Required
      location: scholarshipData.location, // Required

      iconName: scholarshipData.iconName || null,
      category: scholarshipData.category || null,
      ageRequirement: scholarshipData.ageRequirement || null,
      fundingLevel: scholarshipData.fundingLevel || null,
      destinationRegion: scholarshipData.destinationRegion || null,
      targetLevel: scholarshipData.targetLevel || null,
      fundingCountry: scholarshipData.fundingCountry || null,
      partner: scholarshipData.partner || null,
      coverage: scholarshipData.coverage || null,
      deadline: scholarshipData.deadline || null,
      imageUrl: scholarshipData.imageUrl || null, 

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // Firestore does not allow 'id' field to be part of the data in addDoc if it's the document ID itself.
    // Omit type should handle this, but defensive delete.
    delete (dataToSave as any).id; 
    
    console.log("Data being sent to Firestore for addDoc:", dataToSave);
    const docRef = await addDoc(scholarshipsRef, dataToSave as any); // Cast to any to satisfy addDoc, since serverTimestamp is complex
    return docRef.id;
  } catch (error: any) { 
    console.error("[firestoreService] Error adding scholarship: ", error);
    console.error("[firestoreService] Error Code: ", error.code); 
    console.error("[firestoreService] Error Message: ", error.message); 
    console.error("[firestoreService] Error Details: ", error.details); 
    throw new Error(`Failed to add scholarship. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function updateScholarship(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`Data received by updateScholarship service for ID ${id}:`, scholarshipData);
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    
    const dataToUpdate: { [key: string]: any } = {};
    // Iterate over scholarshipData and prepare for update, ensuring undefined becomes null
    (Object.keys(scholarshipData) as Array<keyof typeof scholarshipData>).forEach(key => {
        const value = scholarshipData[key];
        // For updateDoc, explicitly set fields to null if they are meant to be cleared
        // and were passed as undefined or null from the form.
        // Empty strings for optional text fields that are not required URLs should also become null.
        if (value === undefined || value === null) {
            dataToUpdate[key] = null;
        } else if (typeof value === 'string' && value.trim() === '' && 
                   key !== 'name' && key !== 'description' && key !== 'eligibility' && key !== 'websiteUrl' && key !== 'location') {
             if (key === 'imageUrl' || key === 'iconName' || key === 'category' || key === 'ageRequirement' || key === 'fundingLevel' || key === 'destinationRegion' || key === 'targetLevel' || key === 'fundingCountry' || key === 'partner' || key === 'coverage' || key === 'deadline') {
               dataToUpdate[key] = null;
            } else {
               dataToUpdate[key] = value; // Keep empty string for required fields if it somehow passes validation
            }
        }
        else {
            dataToUpdate[key] = value;
        }
    });
    dataToUpdate.updatedAt = serverTimestamp();

    console.log(`Data being sent to Firestore for updateDoc (ID: ${id}):`, dataToUpdate);
    await updateDoc(scholarshipDocRef, dataToUpdate);
  } catch (error: any) {
    console.error(`[firestoreService] Error updating scholarship ${id}: `, error);
    console.error(`[firestoreService] Error Code (update): ${error.code}`);
    console.error(`[firestoreService] Error Message (update): ${error.message}`);
    console.error(`[firestoreService] Error Details (update): ${error.details}`);
    throw new Error(`Failed to update scholarship ${id}. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function deleteScholarship(id: string): Promise<void> {
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    await deleteDoc(scholarshipDocRef);
  } catch (error) {
    console.error(`Error deleting scholarship ${id}: `, error);
    throw new Error(`Failed to delete scholarship ${id}.`);
  }
}

export async function seedInitialScholarships(scholarshipsToSeed: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
  const existingScholarshipsSnapshot = await getDocs(query(scholarshipsRef, where("name", "in", scholarshipsToSeed.map(s => s.name))));
  const existingNames = new Set(existingScholarshipsSnapshot.docs.map(doc => doc.data().name));

  const batch = writeBatch(db);
  let seededCount = 0;

  scholarshipsToSeed.forEach(scholarship => {
    if (!existingNames.has(scholarship.name)) {
      const newDocRef = doc(scholarshipsRef); 
      const dataToSave = {
        ...scholarship,
        iconName: scholarship.iconName || null,
        category: scholarship.category || null,
        ageRequirement: scholarship.ageRequirement || null,
        fundingLevel: scholarship.fundingLevel || null,
        destinationRegion: scholarship.destinationRegion || null,
        targetLevel: scholarship.targetLevel || null,
        fundingCountry: scholarship.fundingCountry || null,
        partner: scholarship.partner || null,
        coverage: scholarship.coverage || null,
        deadline: scholarship.deadline || null,
        imageUrl: scholarship.imageUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      batch.set(newDocRef, dataToSave);
      seededCount++;
    }
  });

  if (seededCount > 0) {
    await batch.commit();
    console.log(`Successfully seeded ${seededCount} new scholarships.`);
  } else {
    console.log("No new scholarships to seed (based on name check).");
  }
}
