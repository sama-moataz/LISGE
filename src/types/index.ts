
import type { LucideIcon } from 'lucide-react';

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  country?: 'Egypt' | 'Abroad' | 'Global'; // Added for potential filtering
  area?: string; // e.g., STEM, Arts
}

export interface StudyTip {
  id: string;
  title: string;
  content: string | React.ReactNode; // Allow ReactNode for more complex content
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
  location?: 'Egypt' | 'Abroad' | 'Online';
  provider?: string;
}

export interface VolunteerOpportunity {
  id: string;
  name: string;
  organization: string;
  description: string;
  eligibility?: string; // Optional as not always present
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; // e.g., Education, Environment, Healthcare
  location: 'Egypt' | 'International';
  duration?: string;
  cost?: string;
  sdgFocus?: string; // e.g., SDG #4 Quality Education
}

export interface PreCollegeCourse {
  id: string;
  name: string;
  institution: string;
  description: string;
  eligibility?: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; // e.g., STEM, Arts, Humanities
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
}
