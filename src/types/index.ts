
import type { LucideIcon } from 'lucide-react';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Global'; // Standardized
  // For future expansion:
  // financialAidType?: 'Full' | 'Partial' | 'Varies' | 'None';
  // ageRequirement?: string; // e.g., "15-17"
}

export interface StudyTip {
  id: string;
  title: string;
  content: string | React.ReactNode;
  icon?: LucideIcon;
}

export interface SummerProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Online'; // Standardized
  provider?: string;
  // For future expansion:
  // financialAidAvailable?: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  name: string;
  organization: string;
  description: string;
  eligibility?: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International'; // Standardized
  duration?: string;
  cost?: string;
  sdgFocus?: string;
  // For future expansion:
  // financialAidAvailable?: boolean;
}

export interface PreCollegeCourse {
  id: string;
  name: string;
  institution: string;
  description: string;
  eligibility?: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Online'; // Standardized
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
  // For future expansion:
  // financialAidAvailable?: boolean;
}
