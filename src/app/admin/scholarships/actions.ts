
'use server';

import { addScholarshipAdmin, deleteScholarshipAdmin, updateScholarshipAdmin } from '@/lib/firestoreAdminService';
import type { Scholarship } from '@/types';

// Authorization check placeholder - implement robust checks before production
async function verifyAdminPrivileges(actionName: string) {
  // In a real app, verify the user's ID token and check their role (e.g., from Firestore custom claims).
  // Example:
  // const { headers } = await import('next/headers');
  // const idToken = headers().get('Authorization')?.split('Bearer ')[1];
  // if (!idToken) throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: No token provided`);
  // const { adminAuth } = await import('@/lib/firebaseAdmin');
  // if (!adminAuth) throw new Error(`[Server Action Auth - ${actionName}] Admin Auth not initialized`);
  // try {
  //   const decodedToken = await adminAuth.verifyIdToken(idToken);
  //   const userRecord = await adminAuth.getUser(decodedToken.uid);
  //   if (userRecord.customClaims?.role !== 'Admin') {
  //     throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: User is not an admin`);
  //   }
  //   console.log(`[Server Action Auth - ${actionName}] Admin privileges verified for UID:`, decodedToken.uid);
  // } catch (error: any) {
  //   console.error(`[Server Action Auth - ${actionName}] Admin verification failed:`, error.message);
  //   throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: Admin verification failed.`);
  // }
  console.warn(`[Server Action - ${actionName}] Placeholder admin authorization check. Implement actual verification.`);
  return true; // Assume admin for now
}

export async function handleAddScholarshipAction(data: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt'>) {
  console.log('[Server Action - handleAddScholarshipAction] INVOKED.');
  console.log('[Server Action - handleAddScholarshipAction] GOOGLE_APPLICATION_CREDENTIALS (at start of Server Action):', process.env.GOOGLE_APPLICATION_CREDENTIALS || "NOT SET in Server Action environment");
  
  // await verifyAdminPrivileges('handleAddScholarshipAction'); // Uncomment and implement

  try {
    // Data is already processed by the client before being sent here
    console.log("[Server Action - handleAddScholarshipAction] Received processed data:", JSON.stringify(data, null, 2));
    const scholarshipId = await addScholarshipAdmin(data);
    console.log("[Server Action - handleAddScholarshipAction] Scholarship added successfully with ID:", scholarshipId);
    return { success: true, scholarshipId, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleAddScholarshipAction] CAUGHT ERROR while calling addScholarshipAdmin or during processing:", err);
    console.error("[Server Action - handleAddScholarshipAction] Error Name:", err.name);
    console.error("[Server Action - handleAddScholarshipAction] Error Message:", err.message);
    console.error("[Server Action - handleAddScholarshipAction] Error Stack:", err.stack);
    let clientErrorMessage = "Failed to add scholarship. An unexpected server error occurred.";
    if (err.message) {
        clientErrorMessage = err.message.includes("SERVER_CONFIG_ERROR:") 
                             ? err.message 
                             : `Failed to add scholarship: ${err.message}`;
    }
    return { success: false, error: clientErrorMessage, name: data.name };
  }
}

export async function handleUpdateScholarshipAction(id: string, data: Partial<Omit<Scholarship, 'id' | 'createdAt'>>) {
  console.log(`[Server Action - handleUpdateScholarshipAction] Received data for ID ${id}:`, data);
  
  // await verifyAdminPrivileges('handleUpdateScholarshipAction'); // Uncomment and implement

  try {
    // Data is already processed by the client
    console.log("[Server Action - handleUpdateScholarshipAction] Processed data for Admin SDK:", data);
    await updateScholarshipAdmin(id, data);
    console.log("[Server Action - handleUpdateScholarshipAction] Scholarship updated for ID:", id);
    return { success: true, id, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleUpdateScholarshipAction] Error calling updateScholarshipAdmin:", err);
    return { success: false, error: err.message || "Failed to update scholarship via Admin SDK.", name: data.name };
  }
}

export async function handleDeleteScholarshipAction(id: string, name: string) {
  console.log(`[Server Action - handleDeleteScholarshipAction] Attempting to delete ID ${id}, Name: ${name}`);
  
  // await verifyAdminPrivileges('handleDeleteScholarshipAction'); // Uncomment and implement

  try {
    await deleteScholarshipAdmin(id);
    console.log(`[Server Action - handleDeleteScholarshipAction] Scholarship deleted for ID: ${id}`);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteScholarshipAction] Error calling deleteScholarshipAdmin for ID ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete scholarship via Admin SDK.", name };
  }
}
