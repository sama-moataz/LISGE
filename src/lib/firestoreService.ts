
// src/lib/firestoreService.ts
// This file now primarily handles CLIENT-SDK Firestore operations, mainly reads for public pages.
// Admin CUD operations have been moved to firestoreAdminService.ts

import { db, auth } from '@/lib/firebase'; // Client SDK
import type { Scholarship, StudyTip, SummerProgram, ExchangeProgram, VolunteerOpportunity, PreCollegeCourse } from '@/types';
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
const STUDY_TIPS_COLLECTION = 'STUDY_TIPS';
const SUMMER_PROGRAMS_COLLECTION = 'SUMMER_PROGRAMS';
const EXCHANGE_PROGRAMS_COLLECTION = 'EXCHANGE_PROGRAMS';
const VOLUNTEER_OPPORTUNITIES_COLLECTION = 'VOLUNTEER_OPPORTUNITIES';
const PRE_COLLEGE_COURSES_COLLECTION = 'PRE_COLLEGE_COURSES';


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
    // icon and dataAiHint are typically for static data, ensure they don't cause issues if missing
    icon: data.icon || undefined, 
    dataAiHint: data.dataAiHint || undefined,
  } as Scholarship; 
};

const mapDocToStudyTip = (docSnapshot: any): StudyTip => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    title: data.title || '',
    content: data.content || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    // icon and dataAiHint are typically for static data
    icon: data.icon || undefined,
    dataAiHint: data.dataAiHint || undefined,
  } as StudyTip;
};

const mapDocToSummerProgram = (docSnapshot: any): SummerProgram => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    eligibility: data.eligibility || '',
    websiteUrl: data.websiteUrl || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    location: data.location || 'Online',
    provider: data.provider || undefined,
    ageRequirement: data.ageRequirement || undefined,
    fundingLevel: data.fundingLevel || undefined,
    focusArea: data.focusArea || undefined,
    programDuration: data.programDuration || undefined,
    partner: data.partner || undefined,
    coverage: data.coverage || undefined,
    deadline: data.deadline || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    icon: data.icon || undefined,
    dataAiHint: data.dataAiHint || undefined,
  } as SummerProgram;
};

const mapDocToExchangeProgram = (docSnapshot: any): ExchangeProgram => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    eligibility: data.eligibility || '',
    websiteUrl: data.websiteUrl || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    location: data.location || 'International',
    ageRequirement: data.ageRequirement || undefined,
    fundingLevel: data.fundingLevel || undefined,
    destinationRegion: data.destinationRegion || undefined,
    targetLevel: data.targetLevel || undefined,
    fundingCountry: data.fundingCountry || undefined,
    partner: data.partner || undefined,
    coverage: data.coverage || undefined,
    deadline: data.deadline || undefined,
    duration: data.duration || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    icon: data.icon || undefined,
    dataAiHint: data.dataAiHint || undefined,
  } as ExchangeProgram;
};

const mapDocToVolunteerOpportunity = (docSnapshot: any): VolunteerOpportunity => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    organization: data.organization || '',
    description: data.description || '',
    eligibility: data.eligibility || undefined,
    websiteUrl: data.websiteUrl || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    location: data.location || 'International',
    duration: data.duration || undefined,
    cost: data.cost || undefined,
    sdgFocus: data.sdgFocus || undefined,
    partner: data.partner || undefined,
    coverage: data.coverage || undefined,
    deadline: data.deadline || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    icon: data.icon || undefined,
    dataAiHint: data.dataAiHint || undefined,
  } as VolunteerOpportunity;
};

const mapDocToPreCollegeCourse = (docSnapshot: any): PreCollegeCourse => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || '',
    institution: data.institution || '',
    description: data.description || '',
    eligibility: data.eligibility || undefined,
    websiteUrl: data.websiteUrl || '',
    iconName: data.iconName || undefined,
    category: data.category || undefined,
    location: data.location || 'International',
    duration: data.duration || undefined,
    creditsTransferable: data.creditsTransferable === true, // Ensure boolean
    cost: data.cost || undefined,
    partner: data.partner || undefined,
    coverage: data.coverage || undefined,
    deadline: data.deadline || undefined,
    imageUrl: data.imageUrl || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    icon: data.icon || undefined,
    dataAiHint: data.dataAiHint || undefined,
  } as PreCollegeCourse;
};


// Scholarship READ operations
export async function getScholarships(): Promise<Scholarship[]> {
  try {
    const scholarshipsRef = collection(db, SCHOLARSHIPS_COLLECTION);
    const q = query(scholarshipsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToScholarship);
  } catch (error) {
    console.error("[firestoreService] Error fetching scholarships (client SDK): ", error);
    throw new Error("Failed to fetch scholarships from the database.");
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

// StudyTip READ operations
export async function getStudyTips(): Promise<StudyTip[]> {
  try {
    const tipsRef = collection(db, STUDY_TIPS_COLLECTION);
    const q = query(tipsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToStudyTip);
  } catch (error) {
    console.error("[firestoreService] Error fetching study tips (client SDK): ", error);
    throw new Error("Failed to fetch study tips from the database.");
  }
}

export async function getStudyTipById(id: string): Promise<StudyTip | null> {
  try {
    const tipDocRef = doc(db, STUDY_TIPS_COLLECTION, id);
    const docSnap = await getDoc(tipDocRef);
    if (docSnap.exists()) {
      return mapDocToStudyTip(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching study tip with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch study tip ${id}.`);
  }
}

// SummerProgram READ operations
export async function getSummerPrograms(): Promise<SummerProgram[]> {
  try {
    const programsRef = collection(db, SUMMER_PROGRAMS_COLLECTION);
    const q = query(programsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToSummerProgram);
  } catch (error) {
    console.error("[firestoreService] Error fetching summer programs (client SDK): ", error);
    throw new Error("Failed to fetch summer programs from the database.");
  }
}

export async function getSummerProgramById(id: string): Promise<SummerProgram | null> {
  try {
    const programDocRef = doc(db, SUMMER_PROGRAMS_COLLECTION, id);
    const docSnap = await getDoc(programDocRef);
    if (docSnap.exists()) {
      return mapDocToSummerProgram(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching summer program with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch summer program ${id}.`);
  }
}

// ExchangeProgram READ operations
export async function getExchangePrograms(): Promise<ExchangeProgram[]> {
  try {
    const programsRef = collection(db, EXCHANGE_PROGRAMS_COLLECTION);
    const q = query(programsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToExchangeProgram);
  } catch (error) {
    console.error("[firestoreService] Error fetching exchange programs (client SDK): ", error);
    throw new Error("Failed to fetch exchange programs from the database.");
  }
}

export async function getExchangeProgramById(id: string): Promise<ExchangeProgram | null> {
  try {
    const programDocRef = doc(db, EXCHANGE_PROGRAMS_COLLECTION, id);
    const docSnap = await getDoc(programDocRef);
    if (docSnap.exists()) {
      return mapDocToExchangeProgram(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching exchange program with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch exchange program ${id}.`);
  }
}

// VolunteerOpportunity READ operations
export async function getVolunteerOpportunities(): Promise<VolunteerOpportunity[]> {
  try {
    const oppsRef = collection(db, VOLUNTEER_OPPORTUNITIES_COLLECTION);
    const q = query(oppsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToVolunteerOpportunity);
  } catch (error) {
    console.error("[firestoreService] Error fetching volunteer opportunities (client SDK): ", error);
    throw new Error("Failed to fetch volunteer opportunities from the database.");
  }
}

export async function getVolunteerOpportunityById(id: string): Promise<VolunteerOpportunity | null> {
  try {
    const oppDocRef = doc(db, VOLUNTEER_OPPORTUNITIES_COLLECTION, id);
    const docSnap = await getDoc(oppDocRef);
    if (docSnap.exists()) {
      return mapDocToVolunteerOpportunity(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching volunteer opportunity with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch volunteer opportunity ${id}.`);
  }
}

// PreCollegeCourse READ operations
export async function getPreCollegeCourses(): Promise<PreCollegeCourse[]> {
  try {
    const coursesRef = collection(db, PRE_COLLEGE_COURSES_COLLECTION);
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToPreCollegeCourse);
  } catch (error) {
    console.error("[firestoreService] Error fetching pre-college courses (client SDK): ", error);
    throw new Error("Failed to fetch pre-college courses from the database.");
  }
}

export async function getPreCollegeCourseById(id: string): Promise<PreCollegeCourse | null> {
  try {
    const courseDocRef = doc(db, PRE_COLLEGE_COURSES_COLLECTION, id);
    const docSnap = await getDoc(courseDocRef);
    if (docSnap.exists()) {
      return mapDocToPreCollegeCourse(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`[firestoreService] Error fetching pre-college course with ID ${id} (client SDK): `, error);
    throw new Error(`Failed to fetch pre-college course ${id}.`);
  }
}


// Seeding (can be kept here, but for robust server-side seeding, Admin SDK is better)
// Note: This seed function is not currently used by the application logic.
// It's here for potential manual seeding if needed.
export async function seedInitialScholarships(scholarshipsToSeed: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  console.log("[firestoreService] seedInitialScholarships: Checking if seeding is needed.");
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
      createdAt: serverTimestamp(), 
      updatedAt: serverTimestamp(), 
    };
    batch.set(newDocRef, dataToSave);
    seededCount++;
  });

  if (seededCount > 0) {
    try {
      const currentAuthUserUid = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SEEDING_FUNCTION';
      console.log(`[firestoreService] seedInitialScholarships: Committing batch. Auth UID (if client-side): ${currentAuthUserUid}`);

      await batch.commit();
      console.log(`[firestoreService] seedInitialScholarships: Successfully seeded ${seededCount} new scholarships.`);
    } catch (error: any) {
      console.error("[firestoreService] seedInitialScholarships: Error committing seed batch:", error);
      const currentAuthUserUidInCatch = auth.currentUser?.uid || 'UNKNOWN_UID_IN_SEEDING_CATCH_BLOCK';
       if (error.code === 'permission-denied' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
         const detailedErrorMessage =
           `ACTION REQUIRED: Firestore Permission Denied when 'seedInitialScholarships' tried to write. ` +
           `Firebase Original Message: "${error.message}". ` +
           `UID available in function's auth context (if any): '${currentAuthUserUidInCatch}'. ` +
           `Ensure Firestore rules allow this operation for the acting user, or use Admin SDK for server-side scripts.`;
         console.error(detailedErrorMessage);
         throw new Error(detailedErrorMessage);
       }
      throw new Error(`Failed to seed scholarships. Server error: ${error.message || 'Please check server console for details.'}`);
    }
  } else {
    console.log("[firestoreService] seedInitialScholarships: No new scholarships were provided for seeding.");
  }
}

