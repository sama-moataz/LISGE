
import type { LucideIcon } from 'lucide-react';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

// Scholarship Filter Types
export type ScholarshipAgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type ScholarshipFundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'No Funding' | 'Varies';
export type ScholarshipRegionFilter = 'All' | 'USA' | 'Europe' | 'Asia' | 'Egypt/MENA' | 'Global' | 'Other';
export type ScholarshipTypeFilter = 'All' | 'High School' | 'Undergraduate' | 'Language' | 'Exchange' | 'Varies';

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; // General category, can be used for initial display or broader grouping
  location: 'Egypt' | 'International' | 'Global' | 'Online'; // Original general location
  // New detailed filter fields for Scholarships
  ageRequirement?: ScholarshipAgeFilter | string; // Can be specific string or predefined filter value
  fundingLevel?: ScholarshipFundingFilter | string;
  destinationRegion?: ScholarshipRegionFilter | string;
  scholarshipType?: ScholarshipTypeFilter | string;
}

// Summer Program Filter Types
export type ProgramAgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type ProgramFundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'Paid Program' | 'Varies';
export type ProgramFocusAreaFilter = 'All' | 'STEM' | 'Leadership' | 'Arts' | 'Language' | 'Culture' | 'Test Prep' | 'College Prep' | 'University Experience' | 'Tech & Coding' | 'Global Leadership' | 'STEM / Engineering' | 'Community Development' | 'Environmental Conservation' | 'Various';
export type ProgramDurationFilter = 'All' | '1 Week' | '2-4 Weeks' | '1 Month+' | 'Academic Year' | 'Varies';


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
  category?: string; // General category
  location: 'Egypt' | 'International' | 'Online'; // Original general location
  provider?: string;
  // New detailed filter fields for Summer Programs
  ageRequirement?: ProgramAgeFilter | string;
  fundingLevel?: ProgramFundingFilter | string;
  focusArea?: ProgramFocusAreaFilter | string | string[]; // Allow single or multiple
  programDuration?: ProgramDurationFilter | string;
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
  location: 'Egypt' | 'International' | 'Online'; // Added Online for consistency
  duration?: string;
  cost?: string;
  sdgFocus?: string;
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
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
}
