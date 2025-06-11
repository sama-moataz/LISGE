
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
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const dataToSave = {
      ...scholarshipData,
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
    const docRef = await addDoc(scholarshipsRef, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding scholarship: ", error);
    throw new Error("Failed to add scholarship.");
  }
}

export async function updateScholarship(id: string, scholarshipData: Partial<Omit<Scholarship, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const scholarshipDocRef = doc(db, SCHOLARSHIPS_COLLECTION, id);
    const dataToUpdate: { [key: string]: any } = {};
    // Ensure all fields in scholarshipData are handled, converting undefined to null
    (Object.keys(scholarshipData) as Array<keyof typeof scholarshipData>).forEach(key => {
        const value = scholarshipData[key];
        dataToUpdate[key] = value === undefined ? null : value;
    });
    dataToUpdate.updatedAt = serverTimestamp();

    await updateDoc(scholarshipDocRef, dataToUpdate);
  } catch (error) {
    console.error(`Error updating scholarship ${id}: `, error);
    throw new Error(`Failed to update scholarship ${id}.`);
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
