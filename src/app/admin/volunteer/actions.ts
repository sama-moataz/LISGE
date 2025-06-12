
'use server';

import { addVolunteerOpportunityAdmin, deleteVolunteerOpportunityAdmin, updateVolunteerOpportunityAdmin } from '@/lib/firestoreAdminService';
import type { VolunteerOpportunity } from '@/types';
import { adminDB } from '@/lib/firebaseAdmin';

// Basic admin check placeholder. In a real app, implement robust RBAC.
async function verifyAdmin() {
  // This is a placeholder. In a real app, you'd verify the user's session/token
  // and check if they have admin privileges (e.g., from Firestore custom claims).
  console.warn("[Server Action - VolunteerOpportunities] Placeholder admin verification. Implement actual checks!");
  return true;
}

export async function handleAddVolunteerOpportunityAction(data: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log("[Server Action - handleAddVolunteerOpportunityAction] Received data:", JSON.stringify(data, null, 2));
  console.log("[Server Action - handleAddVolunteerOpportunityAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot add volunteer opportunity.", name: data.name };
  }

  try {
    const processedData: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName && data.iconName !== '_none_' ? data.iconName : undefined,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        eligibility: data.eligibility || undefined,
        duration: data.duration || undefined,
        cost: data.cost || undefined,
        sdgFocus: data.sdgFocus || undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    const opportunityId = await addVolunteerOpportunityAdmin(processedData);
    return { success: true, opportunityId, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleAddVolunteerOpportunityAction] Error:", err);
    return { success: false, error: err.message || "Failed to add volunteer opportunity.", name: data.name };
  }
}

export async function handleUpdateVolunteerOpportunityAction(id: string, data: Partial<Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleUpdateVolunteerOpportunityAction] Updating opportunity ${id} with data:`, JSON.stringify(data, null, 2));
  console.log("[Server Action - handleUpdateVolunteerOpportunityAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot update volunteer opportunity.", name: data.name };
  }

  try {
    const processedData: Partial<Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : (data.iconName || undefined),
        imageUrl: data.imageUrl === '' ? undefined : (data.imageUrl || undefined),
        category: data.category || undefined,
        eligibility: data.eligibility || undefined,
        duration: data.duration || undefined,
        cost: data.cost || undefined,
        sdgFocus: data.sdgFocus || undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };
    await updateVolunteerOpportunityAdmin(id, processedData);
    return { success: true, id, name: data.name };
  } catch (err: any) {
    console.error(`[Server Action - handleUpdateVolunteerOpportunityAction] Error updating opportunity ${id}:`, err);
    return { success: false, error: err.message || "Failed to update volunteer opportunity.", name: data.name };
  }
}

export async function handleDeleteVolunteerOpportunityAction(id: string, name: string) {
  // await verifyAdmin(); // Uncomment and implement proper admin check
  console.log(`[Server Action - handleDeleteVolunteerOpportunityAction] Deleting opportunity ${id}`);
  console.log("[Server Action - handleDeleteVolunteerOpportunityAction] Checking adminDB status:", adminDB ? "adminDB is initialized" : "adminDB is NOT initialized (CRITICAL)");

  if (!adminDB) {
    return { success: false, error: "Admin SDK not initialized on the server. Cannot delete volunteer opportunity.", name };
  }
  
  try {
    await deleteVolunteerOpportunityAdmin(id);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteVolunteerOpportunityAction] Error deleting opportunity ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete volunteer opportunity.", name };
  }
}
