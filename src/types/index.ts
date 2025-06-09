
import type { LucideIcon } from 'lucide-react';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

// Scholarship Filter Types
export type ScholarshipAgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type ScholarshipFundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'No Funding' | 'Varies';
export type ScholarshipRegionFilter = 'All' | 'USA' | 'Europe' | 'Asia' | 'Egypt/MENA' | 'Global' | 'Other';
// Renamed ScholarshipTypeFilter to ScholarshipLevelFilter for clarity and to align with common terminology
export type ScholarshipLevelFilter = 'All' | 'High School' | 'Undergraduate' | 'Postgraduate' | 'Youth' | 'All Levels' | 'Exchange' | 'Language' | 'Varies';
export type FundingCountryFilter = 'All' | 'Egypt' | 'USA' | 'Germany' | 'UK' | 'Canada' | 'China' | 'South Korea' | 'Other';


export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; 
  location: 'Egypt' | 'International' | 'Global' | 'Online'; 
  ageRequirement?: ScholarshipAgeFilter | string; 
  fundingLevel?: ScholarshipFundingFilter | string;
  destinationRegion?: ScholarshipRegionFilter | string;
  targetLevel?: ScholarshipLevelFilter | string; // Changed from scholarshipType
  // New fields inspired by HTML example and report
  fundingCountry?: FundingCountryFilter | string;
  partner?: string;
  coverage?: string;
  deadline?: string;
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
  category?: string; 
  location: 'Egypt' | 'International' | 'Online'; 
  provider?: string; // Already exists, can be used as partner
  ageRequirement?: ProgramAgeFilter | string;
  fundingLevel?: ProgramFundingFilter | string;
  focusArea?: ProgramFocusAreaFilter | string | string[]; 
  programDuration?: ProgramDurationFilter | string;
  // New fields
  partner?: string; // Can alias to provider or be distinct if needed
  deadline?: string;
}

export interface VolunteerOpportunity {
  id: string;
  name: string;
  organization: string; // Can be used as partner
  description: string;
  eligibility?: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Online'; 
  duration?: string;
  cost?: string;
  sdgFocus?: string;
  // New fields
  partner?: string; // Can alias to organization
  deadline?: string;
}

export interface PreCollegeCourse {
  id: string;
  name: string;
  institution: string; // Can be used as partner
  description: string;
  eligibility?: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
  // New fields
  partner?: string; // Can alias to institution
  deadline?: string;
}
