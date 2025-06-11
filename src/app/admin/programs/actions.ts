
'use server';

import { addSummerProgramAdmin, deleteSummerProgramAdmin, updateSummerProgramAdmin } from '@/lib/firestoreAdminService';
import type { SummerProgram } from '@/types';
import { adminDB } from '@/lib/firebaseAdmin';

// Basic admin check placeholder. In a real app, implement robust RBAC.
async function verifyAdmin() {
  // This is a placeholder. In a real app, you'd verify the user's session/token
  // and check if they have admin privileges (e.g., from Firestore custom claims).
  console.warn("[Server Action - SummerPrograms] Placeholder admin verification. Implement actual checks!");
  return true;
}

export async function handleAddSummerProgramAction(data: Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log("[Server Action - handleAddSummerProgramAction] Received data:", JSON.stringify(data, null, 2));
  console.log("[Server Action - handleAddSummerProgramAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");


  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot add summer program.", name: data.name };
  }
  if (!addSummerProgramAdmin) {
    return { success: false, error: "Admin SDK function (addSummerProgramAdmin) not available. Server misconfiguration.", name: data.name };
  }

  try {
    // Ensure iconName is set to undefined if it's "_none_" or empty, otherwise use its value or undefined.
    const processedData: Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName && data.iconName !== '_none_' ? data.iconName : undefined,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        provider: data.provider || undefined,
        ageRequirement: data.ageRequirement && data.ageRequirement !== '_none_' ? data.ageRequirement : undefined,
        fundingLevel: data.fundingLevel && data.fundingLevel !== '_none_' ? data.fundingLevel : undefined,
        focusArea: data.focusArea && (Array.isArray(data.focusArea) ? data.focusArea.filter(Boolean) : (data.focusArea || undefined)),
        programDuration: data.programDuration && data.programDuration !== '_none_' ? data.programDuration : undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    const programId = await addSummerProgramAdmin(processedData);
    return { success: true, programId, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleAddSummerProgramAction] Error:", err);
    return { success: false, error: err.message || "Failed to add summer program.", name: data.name };
  }
}

export async function handleUpdateSummerProgramAction(id: string, data: Partial<Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleUpdateSummerProgramAction] Updating program ${id} with data:`, JSON.stringify(data, null, 2));
  console.log("[Server Action - handleUpdateSummerProgramAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot update summer program.", name: data.name };
  }
  if (!updateSummerProgramAdmin) {
    return { success: false, error: "Admin SDK function (updateSummerProgramAdmin) not available. Server misconfiguration.", name: data.name };
  }

  try {
    // Ensure iconName is set to undefined if it's "_none_", otherwise keep its value or undefined.
    // Ensure imageUrl is set to undefined if it's an empty string, otherwise keep its value or undefined.
    const processedData: Partial<Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : (data.iconName || undefined),
        imageUrl: data.imageUrl === '' ? undefined : (data.imageUrl || undefined),
        category: data.category || undefined,
        provider: data.provider || undefined,
        ageRequirement: data.ageRequirement === '_none_' ? undefined : (data.ageRequirement || undefined),
        fundingLevel: data.fundingLevel === '_none_' ? undefined : (data.fundingLevel || undefined),
        focusArea: data.focusArea && (Array.isArray(data.focusArea) ? data.focusArea.filter(Boolean) : (data.focusArea || undefined)),
        programDuration: data.programDuration === '_none_' ? undefined : (data.programDuration || undefined),
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    await updateSummerProgramAdmin(id, processedData);
    return { success: true, id, name: data.name };
  } catch (err: any) {
    console.error(`[Server Action - handleUpdateSummerProgramAction] Error updating program ${id}:`, err);
    return { success: false, error: err.message || "Failed to update summer program.", name: data.name };
  }
}

export async function handleDeleteSummerProgramAction(id: string, name: string) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleDeleteSummerProgramAction] Deleting program ${id}`);
  console.log("[Server Action - handleDeleteSummerProgramAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot delete summer program.", name };
  }
  if (!deleteSummerProgramAdmin) {
    return { success: false, error: "Admin SDK function (deleteSummerProgramAdmin) not available. Server misconfiguration.", name };
  }
  
  try {
    await deleteSummerProgramAdmin(id);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteSummerProgramAction] Error deleting program ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete summer program.", name };
  }
}
