
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
    const scholarshipsRef = adminDB!.collection(SCHOLARSHIPS_COLLECTION);
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
                 (key === 'iconName' || key === 'category' ||
                  key === 'ageRequirement' || key === 'fundingLevel' || key === 'destinationRegion' ||
                  key === 'targetLevel' || key === 'fundingCountry' || key === 'partner' ||
                  key === 'coverage' || key === 'deadline')) {
          dataToUpdate[key] = null;
      } else if (key === 'imageUrl' && typeof value === 'string' && value.trim() === '') {
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

// StudyTip Admin Functions
export async function addStudyTipAdmin(tipData: Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>): Promise<string> {
  ensureAdminDBInitialized();
  const dataToSave = {
    ...tipData,
    iconName: tipData.iconName && tipData.iconName !== '_none_' ? tipData.iconName : null,
    imageUrl: tipData.imageUrl || null,
    category: tipData.category || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(STUDY_TIPS_COLLECTION).add(dataToSave as any);
  return docRef.id;
}

export async function updateStudyTipAdmin(id: string, tipData: Partial<Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(tipData) as Array<keyof typeof tipData>).forEach(key => {
    const value = tipData[key];
    if (value === undefined || value === null || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (typeof value === 'string' && value.trim() === '' && (key === 'iconName' || key === 'category' || key === 'imageUrl')) {
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
  const dataToSave = {
    ...programData,
    iconName: programData.iconName && programData.iconName !== '_none_' ? programData.iconName : null,
    imageUrl: programData.imageUrl || null,
    category: programData.category || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(SUMMER_PROGRAMS_COLLECTION).add(dataToSave as any);
  return docRef.id;
}

export async function updateSummerProgramAdmin(id: string, programData: Partial<Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(programData) as Array<keyof typeof programData>).forEach(key => {
    const value = programData[key];
    if (value === undefined || value === null || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (typeof value === 'string' && value.trim() === '' && (key === 'iconName' || key === 'category' || key === 'imageUrl' || key === 'focusArea' || key === 'programDuration' || key === 'provider' || key === 'ageRequirement' || key === 'fundingLevel')) {
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
  const dataToSave = {
    ...programData,
    iconName: programData.iconName && programData.iconName !== '_none_' ? programData.iconName : null,
    imageUrl: programData.imageUrl || null,
    category: programData.category || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(EXCHANGE_PROGRAMS_COLLECTION).add(dataToSave as any);
  return docRef.id;
}

export async function updateExchangeProgramAdmin(id: string, programData: Partial<Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(programData) as Array<keyof typeof programData>).forEach(key => {
    const value = programData[key];
    if (value === undefined || value === null || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (typeof value === 'string' && value.trim() === '' && (key === 'iconName' || key === 'category' || key === 'imageUrl' || key === 'destinationRegion' || key === 'targetLevel' || key === 'fundingCountry' || key === 'ageRequirement' || key === 'fundingLevel')) {
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
  const dataToSave = {
    ...oppData,
    iconName: oppData.iconName && oppData.iconName !== '_none_' ? oppData.iconName : null,
    imageUrl: oppData.imageUrl || null,
    category: oppData.category || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(VOLUNTEER_OPPORTUNITIES_COLLECTION).add(dataToSave as any);
  return docRef.id;
}

export async function updateVolunteerOpportunityAdmin(id: string, oppData: Partial<Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
   const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(oppData) as Array<keyof typeof oppData>).forEach(key => {
    const value = oppData[key];
    if (value === undefined || value === null || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (typeof value === 'string' && value.trim() === '' && (key === 'iconName' || key === 'category' || key === 'imageUrl' || key === 'duration' || key === 'cost' || key === 'sdgFocus')) {
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
  const dataToSave = {
    ...courseData,
    iconName: courseData.iconName && courseData.iconName !== '_none_' ? courseData.iconName : null,
    imageUrl: courseData.imageUrl || null,
    category: courseData.category || null,
    creditsTransferable: courseData.creditsTransferable ?? false, // Default to false if not provided
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await adminDB!.collection(PRE_COLLEGE_COURSES_COLLECTION).add(dataToSave as any);
  return docRef.id;
}

export async function updatePreCollegeCourseAdmin(id: string, courseData: Partial<Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>): Promise<void> {
  ensureAdminDBInitialized();
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(courseData) as Array<keyof typeof courseData>).forEach(key => {
    const value = courseData[key];
    if (value === undefined || value === null || value === '_none_') {
      dataToUpdate[key] = null;
    } else if (typeof value === 'string' && value.trim() === '' && (key === 'iconName' || key === 'category' || key === 'imageUrl' || key === 'duration' || key === 'cost')) {
      dataToUpdate[key] = null;
    } else if (key === 'creditsTransferable' && value === null) { // specifically handle null for boolean
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

    