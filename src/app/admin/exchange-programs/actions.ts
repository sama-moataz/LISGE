
'use server';

import { addExchangeProgramAdmin, deleteExchangeProgramAdmin, updateExchangeProgramAdmin } from '@/lib/firestoreAdminService';
import type { ExchangeProgram } from '@/types';

// Basic admin check placeholder. In a real app, implement robust RBAC.
async function verifyAdmin() {
  // This is a placeholder. In a real app, you'd verify the user's session/token
  // and check if they have admin privileges (e.g., from Firestore custom claims).
  console.warn("[Server Action - ExchangePrograms] Placeholder admin verification. Implement actual checks!");
  return true;
}

export async function handleAddExchangeProgramAction(data: Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check

  try {
    const processedData: Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName && data.iconName !== '_none_' ? data.iconName : undefined,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        // Ensure all other required fields from ExchangeProgram are present or defaulted
        location: data.location || 'International',
        ageRequirement: data.ageRequirement && data.ageRequirement !== '_none_' ? data.ageRequirement : undefined,
        fundingLevel: data.fundingLevel && data.fundingLevel !== '_none_' ? data.fundingLevel : undefined,
        destinationRegion: data.destinationRegion && data.destinationRegion !== '_none_' ? data.destinationRegion : undefined,
        targetLevel: data.targetLevel && data.targetLevel !== '_none_' ? data.targetLevel : undefined,
        fundingCountry: data.fundingCountry && data.fundingCountry !== '_none_' ? data.fundingCountry : undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
        duration: data.duration || undefined,
    };
    const programId = await addExchangeProgramAdmin(processedData);
    return { success: true, programId, name: data.name };
  } catch (err: any) {
    console.error("[Server Action - handleAddExchangeProgramAction] Error:", err);
    return { success: false, error: err.message || "Failed to add exchange program.", name: data.name };
  }
}

export async function handleUpdateExchangeProgramAction(id: string, data: Partial<Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>>) {
  // await verifyAdmin(); // Uncomment and implement proper admin check

  try {
    const processedData: Partial<Omit<ExchangeProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : (data.iconName || undefined),
        imageUrl: data.imageUrl === '' ? undefined : (data.imageUrl || undefined),
        category: data.category || undefined,
        ageRequirement: data.ageRequirement === '_none_' ? undefined : (data.ageRequirement || undefined),
        fundingLevel: data.fundingLevel === '_none_' ? undefined : (data.fundingLevel || undefined),
        destinationRegion: data.destinationRegion === '_none_' ? undefined : (data.destinationRegion || undefined),
        targetLevel: data.targetLevel === '_none_' ? undefined : (data.targetLevel || undefined),
        fundingCountry: data.fundingCountry === '_none_' ? undefined : (data.fundingCountry || undefined),
    };
    await updateExchangeProgramAdmin(id, processedData);
    return { success: true, id, name: data.name };
  } catch (err: any) {
    console.error(`[Server Action - handleUpdateExchangeProgramAction] Error updating program ${id}:`, err);
    return { success: false, error: err.message || "Failed to update exchange program.", name: data.name };
  }
}

export async function handleDeleteExchangeProgramAction(id: string, name: string) {
  // await verifyAdmin(); // Uncomment and implement proper admin check

  try {
    await deleteExchangeProgramAdmin(id);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteExchangeProgramAction] Error deleting program ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete exchange program.", name };
  }
}
