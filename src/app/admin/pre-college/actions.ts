
'use server';

import { addPreCollegeCourseAdmin, deletePreCollegeCourseAdmin, updatePreCollegeCourseAdmin } from '@/lib/firestoreAdminService';
import type { PreCollegeCourse } from '@/types';
import { adminDB } from '@/lib/firebaseAdmin';

// Basic admin check placeholder
async function verifyAdmin() {
  console.warn("[Server Action - PreCollegeCourses] Placeholder admin verification. Implement actual checks!");
  return true;
}

export async function handleAddPreCollegeCourseAction(data: Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon' | 'dataAiHint'>) {
  // await verifyAdmin();
  console.log("[Server Action - handleAddPreCollegeCourseAction] Received data:", JSON.stringify(data, null, 2));
  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized. Cannot add pre-college course.", name: data.name };
  }

  try {
    const processedData: Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon' | 'dataAiHint'> = {
        ...data,
        iconName: data.iconName && data.iconName !== '_none_' ? data.iconName : undefined,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        eligibility: data.eligibility || undefined,
        duration: data.duration || undefined,
        creditsTransferable: data.creditsTransferable || false,
        cost: data.cost || undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    const courseId = await addPreCollegeCourseAdmin(processedData);
    return { success: true, courseId, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleAddPreCollegeCourseAction] Error:", err);
    return { success: false, error: err.message || "Failed to add pre-college course.", name: data.name };
  }
}

export async function handleUpdatePreCollegeCourseAction(id: string, data: Partial<Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon' | 'dataAiHint'>>) {
  // await verifyAdmin();
  console.log(`[Server Action - handleUpdatePreCollegeCourseAction] Updating course ${id} with data:`, JSON.stringify(data, null, 2));
  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized. Cannot update pre-college course.", name: data.name };
  }

  try {
    const processedData: Partial<Omit<PreCollegeCourse, 'id' | 'createdAt' | 'updatedAt' | 'icon' | 'dataAiHint'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : (data.iconName || undefined),
        imageUrl: data.imageUrl === '' ? undefined : (data.imageUrl || undefined),
        category: data.category || undefined,
        eligibility: data.eligibility || undefined,
        duration: data.duration || undefined,
        creditsTransferable: data.creditsTransferable === null ? false : (data.creditsTransferable || false),
        cost: data.cost || undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    await updatePreCollegeCourseAdmin(id, processedData);
    return { success: true, id, name: data.name };
  } catch (err: any) {
    console.error(`[Server Action - handleUpdatePreCollegeCourseAction] Error updating course ${id}:`, err);
    return { success: false, error: err.message || "Failed to update pre-college course.", name: data.name };
  }
}

export async function handleDeletePreCollegeCourseAction(id: string, name: string) {
  // await verifyAdmin();
  console.log(`[Server Action - handleDeletePreCollegeCourseAction] Deleting course ${id}`);
  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized. Cannot delete pre-college course.", name };
  }
  
  try {
    await deletePreCollegeCourseAdmin(id);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeletePreCollegeCourseAction] Error deleting course ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete pre-college course.", name };
  }
}
