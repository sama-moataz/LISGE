
// src/lib/firestoreAdminService.ts
import { adminDB } from '@/lib/firebaseAdmin';
import type { Scholarship, StudyTip, SummerProgram, ExchangeProgram, VolunteerOpportunity, PreCollegeCourse } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';
const STUDY_TIPS_COLLECTION = 'STUDY_TIPS';
const SUMMER_PROGRAMS_COLLECTION = 'SUMMER_PROGRAMS';
const EXCHANGE_PROGRAMS_COLLECTION = 'EXCHANGE_PROGRAMS';
const VOLUNTEER_OPPORTUNITIES_COLLECTION = 'VOLUNTEER_OPPORTUNITIES';
const PRE_COLLEGE_COURSES_COLLECTION = 'PRE_COLLEGE_COURSES';


function ensureAdminDBInitialized() {
  if (typeof adminDB === 'undefined' || !adminDB || typeof adminDB.collection !== 'function') {
    const errorMessage = "SERVER_CONFIG_ERROR: Firebase Admin SDK (adminDB) is not properly initialized. This is a critical server configuration issue. Possible causes: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set, path is incorrect, service account file is malformed/missing, or Node.js process lacks read permissions. Detailed Admin SDK initialization logs should be in the server console (check firebaseAdmin.ts logs).";
    console.error("[firestoreAdminService] CRITICAL CHECK FAILED:", errorMessage);
    throw new Error(errorMessage);
  }
   console.log("[firestoreAdminService] AdminDB initialized check passed.");
}

// Scholarship Admin Functions
export async function addScholarshipAdmin(scholarshipData: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log("[firestoreAdminService] addScholarshipAdmin: Attempting to add data:", JSON.stringify(scholarshipData, null, 2));
  ensureAdminDBInitialized();

  const dataToSave: {
    name: string;
    description: string;
    eligibility: string;
    websiteUrl: string;
    location: 'Egypt' | 'International' | 'Global' | 'Online';
    iconName?: string | null;
    category?: string | null;
    ageRequirement?: string | null;
    fundingLevel?: string | null;
    destinationRegion?: string | null;
    targetLevel?: string | null;
    fundingCountry?: string | null;
    partner?: string | null;
    coverage?: string | null;
    deadline?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    name: scholarshipData.name || '',
    description: scholarshipData.description || '',
    eligibility: scholarshipData.eligibility || '',
    websiteUrl: scholarshipData.websiteUrl || '',
    location: scholarshipData.location || 'International',
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  try {
    const scholarshipsRef = adminDB!.collection(SCHOLARSHIPS_COLLECTION);
    const docRef = await scholarshipsRef.add(dataToSave);
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
      if (value === undefined || value === '_none_') { // Treat '_none_' as explicit clear for optional fields
          dataToUpdate[key] = null;
      } else {
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

// StudyTip Admin Functions
export async function addStudyTipAdmin(tipData: Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataForFirestore: {
    title: string;
    content: string;
    iconName?: string | null;
    category?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    title: tipData.title,
    content: tipData.content as string, // Content is expected to be string from form
    iconName: tipData.iconName || null,
    category: tipData.category || null,
    imageUrl: tipData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(STUDY_TIPS_COLLECTION).add(dataForFirestore);
  return docRef.id;
}

export async function updateStudyTipAdmin(id: string, tipData: Partial<Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(tipData) as Array<keyof typeof tipData>).forEach(key => {
    const value = tipData[key];
     if (value === undefined || value === '_none_') {
      dataToUpdate[key] = null;
    } else {
      dataToUpdate[key] = value;
    }
  });
  dataToUpdate.updatedAt = Timestamp.now();
  await adminDB!.collection(STUDY_TIPS_COLLECTION).doc(id).update(dataToUpdate);
}

export async function deleteStudyTipAdmin(id: string): Promise<void> {
  ensureAdminDBInitialized();
  await adminDB!.collection(STUDY_TIPS_COLLECTION).doc(id).delete();
}

// SummerProgram Admin Functions
export async function addSummerProgramAdmin(programData: Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataForFirestore: {
    name: string;
    description: string;
    eligibility: string;
    websiteUrl: string;
    location: 'Egypt' | 'International' | 'Online';
    iconName?: string | null;
    category?: string | null;
    provider?: string | null;
    ageRequirement?: string | null;
    fundingLevel?: string | null;
    focusArea?: string | string[] | null;
    programDuration?: string | null;
    partner?: string | null;
    coverage?: string | null;
    deadline?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    name: programData.name,
    description: programData.description,
    eligibility: programData.eligibility,
    websiteUrl: programData.websiteUrl,
    location: programData.location,
    iconName: programData.iconName || null,
    category: programData.category || null,
    provider: programData.provider || null,
    ageRequirement: programData.ageRequirement || null,
    fundingLevel: programData.fundingLevel || null,
    focusArea: programData.focusArea || null,
    programDuration: programData.programDuration || null,
    partner: programData.partner || null,
    coverage: programData.coverage || null,
    deadline: programData.deadline || null,
    imageUrl: programData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(SUMMER_PROGRAMS_COLLECTION).add(dataForFirestore);
  return docRef.id;
}

export async function updateSummerProgramAdmin(id: string, programData: Partial<Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(programData) as Array<keyof typeof programData>).forEach(key => {
    const value = programData[key];
    if (value === undefined || value === '_none_') {
      dataToUpdate[key] = null;
    } else {
      dataToUpdate[key] = value;
    }
  });
  dataToUpdate.updatedAt = Timestamp.now();
  await adminDB!.collection(SUMMER_PROGRAMS_COLLECTION).doc(id).update(dataToUpdate);
}

export async function deleteSummerProgramAdmin(id: string): Promise<void> {
  ensureAdminDBInitialized();
  await adminDB!.collection(SUMMER_PROGRAMS_COLLECTION).doc(id).delete();
}

// ExchangeProgram Admin Functions
export async function addExchangeProgramAdmin(programData: Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataForFirestore: {
    name: string;
    description: string;
    eligibility: string;
    websiteUrl: string;
    location: 'Egypt' | 'International' | 'Global' | 'Online';
    iconName?: string | null;
    category?: string | null;
    ageRequirement?: string | null;
    fundingLevel?: string | null;
    destinationRegion?: string | null;
    targetLevel?: string | null;
    fundingCountry?: string | null;
    partner?: string | null;
    coverage?: string | null;
    deadline?: string | null;
    duration?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    name: programData.name,
    description: programData.description,
    eligibility: programData.eligibility,
    websiteUrl: programData.websiteUrl,
    location: programData.location,
    iconName: programData.iconName || null,
    category: programData.category || null,
    ageRequirement: programData.ageRequirement || null,
    fundingLevel: programData.fundingLevel || null,
    destinationRegion: programData.destinationRegion || null,
    targetLevel: programData.targetLevel || null,
    fundingCountry: programData.fundingCountry || null,
    partner: programData.partner || null,
    coverage: programData.coverage || null,
    deadline: programData.deadline || null,
    duration: programData.duration || null,
    imageUrl: programData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(EXCHANGE_PROGRAMS_COLLECTION).add(dataForFirestore);
  return docRef.id;
}

export async function updateExchangeProgramAdmin(id: string, programData: Partial<Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(programData) as Array<keyof typeof programData>).forEach(key => {
    const value = programData[key];
    if (value === undefined || value === '_none_') {
      dataToUpdate[key] = null;
    } else {
      dataToUpdate[key] = value;
    }
  });
  dataToUpdate.updatedAt = Timestamp.now();
  await adminDB!.collection(EXCHANGE_PROGRAMS_COLLECTION).doc(id).update(dataToUpdate);
}

export async function deleteExchangeProgramAdmin(id: string): Promise<void> {
  ensureAdminDBInitialized();
  await adminDB!.collection(EXCHANGE_PROGRAMS_COLLECTION).doc(id).delete();
}

// VolunteerOpportunity Admin Functions
export async function addVolunteerOpportunityAdmin(oppData: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataForFirestore: {
    name: string;
    organization: string;
    description: string;
    websiteUrl: string;
    location: 'Egypt' | 'International' | 'Online';
    iconName?: string | null;
    category?: string | null;
    eligibility?: string | null;
    duration?: string | null;
    cost?: string | null;
    sdgFocus?: string | null;
    partner?: string | null;
    coverage?: string | null;
    deadline?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    name: oppData.name,
    organization: oppData.organization,
    description: oppData.description,
    websiteUrl: oppData.websiteUrl,
    location: oppData.location,
    iconName: oppData.iconName || null,
    category: oppData.category || null,
    eligibility: oppData.eligibility || null,
    duration: oppData.duration || null,
    cost: oppData.cost || null,
    sdgFocus: oppData.sdgFocus || null,
    partner: oppData.partner || null,
    coverage: oppData.coverage || null,
    deadline: oppData.deadline || null,
    imageUrl: oppData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(VOLUNTEER_OPPORTUNITIES_COLLECTION).add(dataForFirestore);
  return docRef.id;
}

export async function updateVolunteerOpportunityAdmin(id: string, oppData: Partial<Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(oppData) as Array<keyof typeof oppData>).forEach(key => {
    const value = oppData[key];
    if (value === undefined || value === '_none_') {
      dataToUpdate[key] = null;
    } else {
      dataToUpdate[key] = value;
    }
  });
  dataToUpdate.updatedAt = Timestamp.now();
  await adminDB!.collection(VOLUNTEER_OPPORTUNITIES_COLLECTION).doc(id).update(dataToUpdate);
}

export async function deleteVolunteerOpportunityAdmin(id: string): Promise<void> {
  ensureAdminDBInitialized();
  await adminDB!.collection(VOLUNTEER_OPPORTUNITIES_COLLECTION).doc(id).delete();
}

// PreCollegeCourse Admin Functions
export async function addPreCollegeCourseAdmin(courseData: Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataForFirestore: {
    name: string;
    institution: string;
    description: string;
    websiteUrl: string;
    location: 'Egypt' | 'International' | 'Online';
    iconName?: string | null;
    category?: string | null;
    eligibility?: string | null;
    duration?: string | null;
    creditsTransferable?: boolean;
    cost?: string | null;
    partner?: string | null;
    coverage?: string | null;
    deadline?: string | null;
    imageUrl?: string | null;
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    name: courseData.name,
    institution: courseData.institution,
    description: courseData.description,
    websiteUrl: courseData.websiteUrl,
    location: courseData.location,
    iconName: courseData.iconName || null,
    category: courseData.category || null,
    eligibility: courseData.eligibility || null,
    duration: courseData.duration || null,
    creditsTransferable: courseData.creditsTransferable || false, // Default to false
    cost: courseData.cost || null,
    partner: courseData.partner || null,
    coverage: courseData.coverage || null,
    deadline: courseData.deadline || null,
    imageUrl: courseData.imageUrl || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(PRE_COLLEGE_COURSES_COLLECTION).add(dataForFirestore);
  return docRef.id;
}

export async function updatePreCollegeCourseAdmin(id: string, courseData: Partial<Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(courseData) as Array<keyof typeof courseData>).forEach(key => {
    const value = courseData[key];
     if (value === undefined || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (key === 'creditsTransferable' && value === null) {
        dataToUpdate[key] = false; 
    } else {
      dataToUpdate[key] = value;
    }
  });
  dataToUpdate.updatedAt = Timestamp.now();
  await adminDB!.collection(PRE_COLLEGE_COURSES_COLLECTION).doc(id).update(dataToUpdate);
}

export async function deletePreCollegeCourseAdmin(id: string): Promise<void> {
  ensureAdminDBInitialized();
  await adminDB!.collection(PRE_COLLEGE_COURSES_COLLECTION).doc(id).delete();
}
