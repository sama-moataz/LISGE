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
  console.log("[firestoreService] addScholarship: Received data:", scholarshipData);
  
  // Ensure all optional fields are explicitly null if not provided or empty, as Firestore expects plain objects.
  const dataToSave: Partial<Scholarship> & { createdAt: any, updatedAt: any } = {
    name: scholarshipData.name, 
    description: scholarshipData.description, 
    eligibility: scholarshipData.eligibility, 
    websiteUrl: scholarshipData.websiteUrl, 
    location: scholarshipData.location, // This is a required field in the form

    // Optional fields: ensure they are null if not provided or empty
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
    imageUrl: scholarshipData.imageUrl || null, // Already handled by Zod on client: .url().or(z.literal('')).optional().nullable()

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // Remove 'id' if it somehow sneaked in, as addDoc generates it.
  delete (dataToSave as any).id; 
  
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    console.log("[firestoreService] addScholarship: Attempting to save data to Firestore:", dataToSave);
    const docRef = await addDoc(scholarshipsRef, dataToSave as any); // Cast to any to satisfy addDoc's specific DocumentData constraint
    console.log("[firestoreService] addScholarship: Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) { 
    // Log detailed error information to the server console
    console.error("--------------------------------------------------------------------");
    console.error("[firestoreService] CRITICAL ERROR adding scholarship to Firestore!");
    console.error("[firestoreService] Original Firebase Error Object:", error);
    console.error("[firestoreService] Firebase Error Code:", error.code); 
    console.error("[firestoreService] Firebase Error Message:", error.message); 
    if (error.details) console.error("[firestoreService] Firebase Error Details:", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO SAVE:", dataToSave);
    console.error("--------------------------------------------------------------------");
    
    // Re-throw a more informative error for the client
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
      throw new Error(`Firestore permission denied when adding scholarship: ${error.message}. Check Firestore rules and ensure the admin user's profile in 'USERS' has role: 'Admin'. Detailed Firebase error is in the server console.`);
    }
    throw new Error(`Failed to add scholarship. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function updateScholarship(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`[firestoreService] updateScholarship: Received data for ID ${id}:`, scholarshipData);
  
  // Prepare data for update, ensuring empty strings for optional fields become null
  const dataToUpdate: { [key: string]: any } = {}; // Use a more generic type for dataToUpdate
  (Object.keys(scholarshipData) as Array<keyof typeof scholarshipData>).forEach(key => {
      const value = scholarshipData[key];
      // Explicitly set to null if value is undefined, null, or an empty string for specific optional fields
      if (value === undefined || value === null) {
          dataToUpdate[key] = null;
      } else if (typeof value === 'string' && value.trim() === '' && 
                 // List of fields where empty string should be treated as null
                 (key === 'imageUrl' || key === 'iconName' || key === 'category' || 
                  key === 'ageRequirement' || key === 'fundingLevel' || key === 'destinationRegion' || 
                  key === 'targetLevel' || key === 'fundingCountry' || key === 'partner' || 
                  key === 'coverage' || key === 'deadline')) {
          dataToUpdate[key] = null;
      }
      // For required fields (name, description, eligibility, websiteUrl, location), empty strings are not allowed by Zod.
      // If they somehow pass, they'll be saved as is, but Zod should prevent this.
      else {
          dataToUpdate[key] = value;
      }
  });
  dataToUpdate.updatedAt = serverTimestamp();

  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    console.log(`[firestoreService] updateScholarship: Attempting to update data in Firestore (ID: ${id}):`, dataToUpdate);
    await updateDoc(scholarshipDocRef, dataToUpdate);
    console.log(`[firestoreService] updateScholarship: Successfully updated document with ID: ${id}`);
  } catch (error: any) {
    console.error("--------------------------------------------------------------------");
    console.error(`[firestoreService] ERROR updating scholarship ${id} in Firestore!`);
    console.error("[firestoreService] Original Firebase Error Object (update):", error);
    console.error("[firestoreService] Firebase Error Code (update):", error.code);
    console.error("[firestoreService] Firebase Error Message (update):", error.message);
    if (error.details) console.error("[firestoreService] Firebase Error Details (update):", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO UPDATE (ID: " + id + "):", dataToUpdate);
    console.error("--------------------------------------------------------------------");
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        throw new Error(`Firestore permission denied when updating scholarship ${id}: ${error.message}. Check Firestore rules and admin role. Detailed Firebase error is in the server console.`);
    }
    throw new Error(`Failed to update scholarship ${id}. Server error: ${error.message || 'Unknown Firestore error. Check server console for full details.'}`);
  }
}

export async function deleteScholarship(id: string): Promise<void> {
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    await deleteDoc(scholarshipDocRef);
  } catch (error: any) {
    console.error(`Error deleting scholarship ${id}: `, error);
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        throw new Error(`Firestore permission denied when deleting scholarship ${id}: ${error.message}. Check Firestore rules and admin role. Detailed Firebase error is in the server console.`);
    }
    throw new Error(`Failed to delete scholarship ${id}.`);
  }
}

// Helper function for seeding, ensures names are unique before adding.
export async function seedInitialScholarships(scholarshipsToSeed: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
  // Check for existing scholarships by name to avoid duplicates during seeding
  const existingScholarshipsSnapshot = await getDocs(query(scholarshipsRef, where("name", "in", scholarshipsToSeed.map(s => s.name))));
  const existingNames = new Set(existingScholarshipsSnapshot.docs.map(doc => doc.data().name));

  const batch = writeBatch(db);
  let seededCount = 0;

  scholarshipsToSeed.forEach(scholarship => {
    if (!existingNames.has(scholarship.name)) {
      const newDocRef = doc(scholarshipsRef); // Firestore will auto-generate an ID
      const dataToSave = {
        ...scholarship,
        // Ensure optional fields default to null if not provided in seed data
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
    console.log("No new scholarships to seed (based on name check). All provided scholarship names already exist.");
  }
}


// --- User Profile Functions (Example, if needed for admin management later) ---
// export async function getUserProfile(userId: string): Promise<UserProfile | null> { ... }
// export async function updateUserRole(userId: string, newRole: 'user' | 'Admin'): Promise<void> { ... }
