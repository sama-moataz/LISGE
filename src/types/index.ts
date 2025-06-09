
import type { LucideIcon } from 'lucide-react';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

// Scholarship & Exchange Program Filter Types (can be shared or specialized if needed)
export type AgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type FundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'Paid Program' | 'No Funding' | 'Varies';
export type RegionFilter = 'All' | 'USA' | 'Europe' | 'Asia' | 'Egypt/MENA' | 'Global' | 'Canada' | 'UK' | 'Other';
export type LevelFilter = 'All' | 'High School' | 'Undergraduate' | 'Postgraduate' | 'Youth' | 'All Levels' | 'Exchange' | 'Language' | 'Research' | 'Varies';
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
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  destinationRegion?: RegionFilter | string;
  targetLevel?: LevelFilter | string;
  fundingCountry?: FundingCountryFilter | string;
  partner?: string;
  coverage?: string;
  deadline?: string;
}

export interface ExchangeProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string;
  location: 'Egypt' | 'International' | 'Global' | 'Online';
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  destinationRegion?: RegionFilter | string;
  targetLevel?: LevelFilter | string;
  fundingCountry?: FundingCountryFilter | string;
  partner?: string;
  coverage?: string;
  deadline?: string;
  duration?: string; // Specific to exchanges or some programs
}

// Summer Program Filter Types
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
  provider?: string; // Can be used as partner
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  focusArea?: ProgramFocusAreaFilter | string | string[];
  programDuration?: ProgramDurationFilter | string;
  partner?: string;
  deadline?: string;
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
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  cost?: string;
  sdgFocus?: string;
  partner?: string;
  deadline?: string;
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
  partner?: string;
  deadline?: string;
}
