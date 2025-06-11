
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
  
  const dataToSave: Partial<Scholarship> & { createdAt: any, updatedAt: any } = {
    name: scholarshipData.name, 
    description: scholarshipData.description, 
    eligibility: scholarshipData.eligibility, 
    websiteUrl: scholarshipData.websiteUrl, 
    location: scholarshipData.location,

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
  
  delete (dataToSave as any).id; 
  
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    console.log("[firestoreService] addScholarship: Attempting to save data to Firestore:", dataToSave);
    const docRef = await addDoc(scholarshipsRef, dataToSave as any);
    console.log("[firestoreService] addScholarship: Successfully added document with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) { 
    console.error("--------------------------------------------------------------------");
    console.error("[firestoreService] CRITICAL ERROR adding scholarship to Firestore!");
    const currentAuthUserUid = auth.currentUser?.uid || 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR';
    console.error(`[firestoreService] UID of user attempting write (from server-side auth state, might be unreliable if not direct client action): ${currentAuthUserUid}`);
    console.error("[firestoreService] Original Firebase Error Object:", error);
    console.error("[firestoreService] Firebase Error Code:", error.code); 
    console.error("[firestoreService] Firebase Error Message:", error.message); 
    if (error.details) console.error("[firestoreService] Firebase Error Details:", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO SAVE:", dataToSave);
    console.error("--------------------------------------------------------------------");
    
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
      const clientUidMessage = `The client-side application reported the UID initiating this request as '${currentAuthUserUid}'. `;
      throw new Error(
        `ACTION REQUIRED: Firestore Permission Denied when adding scholarship. ` +
        `Firebase message: "${error.message}". ` +
        `${currentAuthUserUid !== 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR' ? clientUidMessage : ''}` +
        `TROUBLESHOOTING STEPS: ` +
        `1. DOUBLE-CHECK your DEPLOYED Firestore rules in the Firebase Console. Ensure they EXACTLY match the required rules for 'SCHOLARSHIPS' and 'USERS' collections (path casing, field names like 'role', and value 'Admin' must be precise). ` +
        `2. VERIFY the admin user's document in the 'USERS' collection (UID: '${currentAuthUserUid}') has a field named 'role' with the exact string value 'Admin' (case-sensitive). ` +
        `3. MOST IMPORTANT: USE THE FIREBASE RULES SIMULATOR in the Firebase Console: Simulate a 'create' operation on path '/SCHOLARSHIPS/testId' with Authentication ON and User UID set to '${currentAuthUserUid}'. Observe the evaluation of the 'get()' call to the USERS collection. ` +
        `4. See full original Firebase error in your SERVER CONSOLE (Next.js terminal).`
      );
    }
    throw new Error(`Failed to add scholarship. Server error: ${error.message || 'Please check server console for details.'}`);
  }
}

export async function updateScholarship(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  console.log(`[firestoreService] updateScholarship: Received data for ID ${id}:`, scholarshipData);
  
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(scholarshipData) as Array<keyof typeof scholarshipData>).forEach(key => {
      const value = scholarshipData[key];
      if (value === undefined || value === null) {
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
    console.log(`[firestoreService] updateScholarship: Attempting to update data in Firestore (ID: ${id}):`, dataToUpdate);
    await updateDoc(scholarshipDocRef, dataToUpdate);
    console.log(`[firestoreService] updateScholarship: Successfully updated document with ID: ${id}`);
  } catch (error: any) {
    console.error("--------------------------------------------------------------------");
    console.error(`[firestoreService] ERROR updating scholarship ${id} in Firestore!`);
    const currentAuthUserUid = auth.currentUser?.uid || 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR';
    console.error(`[firestoreService] UID of user attempting write (from server-side auth state, might be unreliable if not direct client action): ${currentAuthUserUid}`);
    console.error("[firestoreService] Original Firebase Error Object (update):", error);
    console.error("[firestoreService] Firebase Error Code (update):", error.code);
    console.error("[firestoreService] Firebase Error Message (update):", error.message);
    if (error.details) console.error("[firestoreService] Firebase Error Details (update):", error.details);
    console.error("[firestoreService] Data that was ATTEMPTED TO UPDATE (ID: " + id + "):", dataToUpdate);
    console.error("--------------------------------------------------------------------");
    
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        const clientUidMessage = `The client-side application reported the UID initiating this request as '${currentAuthUserUid}'. `;
        throw new Error(
          `ACTION REQUIRED: Firestore Permission Denied when updating scholarship (ID: ${id}). ` +
          `Firebase message: "${error.message}". ` +
          `${currentAuthUserUid !== 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR' ? clientUidMessage : ''}` +
          `TROUBLESHOOTING STEPS: ` +
          `1. DOUBLE-CHECK your DEPLOYED Firestore rules in the Firebase Console. Ensure they EXACTLY match the required rules for 'SCHOLARSHIPS' and 'USERS' collections. ` +
          `2. VERIFY the admin user's document in the 'USERS' collection (UID: '${currentAuthUserUid}') has a field 'role' with value 'Admin'. ` +
          `3. MOST IMPORTANT: USE THE FIREBASE RULES SIMULATOR: Simulate an 'update' operation on path '/SCHOLARSHIPS/${id}' with Authentication ON and User UID set to '${currentAuthUserUid}'. Observe the 'get()' call. ` +
          `4. See full original Firebase error in your SERVER CONSOLE.`
        );
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
    const currentAuthUserUid = auth.currentUser?.uid || 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR';
    if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
        const clientUidMessage = `The client-side application reported the UID initiating this request as '${currentAuthUserUid}'. `;
        throw new Error(
          `ACTION REQUIRED: Firestore Permission Denied when deleting scholarship (ID: ${id}). ` +
          `Firebase message: "${error.message}". ` +
          `${currentAuthUserUid !== 'UNKNOWN_UID_ON_SERVER_SIDE_DURING_ERROR' ? clientUidMessage : ''}` +
          `TROUBLESHOOTING STEPS: ` +
          `1. DOUBLE-CHECK your DEPLOYED Firestore rules. ` +
          `2. VERIFY the admin user's document in 'USERS' (UID: '${currentAuthUserUid}') has role: 'Admin'. ` +
          `3. MOST IMPORTANT: USE THE FIREBASE RULES SIMULATOR: Simulate a 'delete' on '/SCHOLARSHIPS/${id}' with Auth ON and User UID '${currentAuthUserUid}'. ` +
          `4. See full original Firebase error in your SERVER CONSOLE.`
        );
    }
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
    console.log("No new scholarships to seed (based on name check). All provided scholarship names already exist.");
  }
}

    