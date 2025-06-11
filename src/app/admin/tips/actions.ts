
'use server';

import { addStudyTipAdmin, deleteStudyTipAdmin, updateStudyTipAdmin } from '@/lib/firestoreAdminService';
import type { StudyTip } from '@/types';
import { adminDB } from '@/lib/firebaseAdmin'; // Import adminDB to check its status

// Basic admin check placeholder. In a real app, implement robust RBAC.
async function verifyAdmin() {
  // This is a placeholder. In a real app, you'd verify the user's session/token
  // and check if they have admin privileges (e.g., from Firestore custom claims).
  console.warn("[Server Action - StudyTips] Placeholder admin verification. Implement actual checks!");
  return true;
}

export async function handleAddStudyTipAction(data: Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log("[Server Action - handleAddStudyTipAction] Received data:", JSON.stringify(data, null, 2));
  console.log("[Server Action - handleAddStudyTipAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot add study tip.", title: data.title };
  }

  try {
    const processedData: Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName && data.iconName !== '_none_' ? data.iconName : undefined,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
    };
    const tipId = await addStudyTipAdmin(processedData);
    return { success: true, tipId, title: data.title };
  } catch (err: any) {
    console.error("[Server Action - handleAddStudyTipAction] Error:", err);
    return { success: false, error: err.message || "Failed to add study tip.", title: data.title };
  }
}

export async function handleUpdateStudyTipAction(id: string, data: Partial<Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleUpdateStudyTipAction] Updating tip ${id} with data:`, JSON.stringify(data, null, 2));
  console.log("[Server Action - handleUpdateStudyTipAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot update study tip.", title: data.title };
  }

  try {
    const processedData: Partial<Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : (data.iconName || undefined),
        imageUrl: data.imageUrl === '' ? undefined : (data.imageUrl || undefined), 
        category: data.category || undefined,
        content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
    };
    await updateStudyTipAdmin(id, processedData);
    return { success: true, id, title: data.title };
  } catch (err: any) {
    console.error(`[Server Action - handleUpdateStudyTipAction] Error updating tip ${id}:`, err);
    return { success: false, error: err.message || "Failed to update study tip.", title: data.title };
  }
}

export async function handleDeleteStudyTipAction(id: string, title: string) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleDeleteStudyTipAction] Deleting tip ${id}`);
  console.log("[Server Action - handleDeleteStudyTipAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot delete study tip.", title };
  }
  
  try {
    await deleteStudyTipAdmin(id);
    return { success: true, title };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteStudyTipAction] Error deleting tip ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete study tip.", title };
  }
}
