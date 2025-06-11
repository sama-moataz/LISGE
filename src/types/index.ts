
import type { LucideIcon } from 'lucide-react';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

// Scholarship & Exchange Program Filter Types
export type AgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type FundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'Paid Program' | 'No Funding' | 'Varies';
export type RegionFilter = 'All' | 'USA' | 'Europe' | 'Asia' | 'Egypt/MENA' | 'Global' | 'Canada' | 'UK' | 'Other';
export type LevelFilter = 'All' | 'High School' | 'Undergraduate' | 'Postgraduate' | 'Youth' | 'All Levels' | 'Exchange' | 'Language' | 'Research' | 'Varies' | 'STEM' | 'Cultural Exchange' | 'Academic Exchange' | 'STEM Exchange'; // Added more specific levels/types
export type FundingCountryFilter = 'All' | 'Egypt' | 'USA' | 'Germany' | 'UK' | 'Canada' | 'China' | 'South Korea' | 'Other';


export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; // General category, can be used for broader grouping
  location: 'Egypt' | 'International' | 'Global' | 'Online'; // Where the opportunity is based or takes place
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  destinationRegion?: RegionFilter | string; // For international opportunities, the target study/exchange region
  targetLevel?: LevelFilter | string; // Academic or program level
  fundingCountry?: FundingCountryFilter | string; // Country providing the funds
  partner?: string; // Partner organization(s)
  coverage?: string; // What the scholarship/program covers
  deadline?: string; // Application deadline
}

export interface ExchangeProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon;
  category?: string; // e.g., "Cultural Exchange", "Academic Exchange"
  location: 'Egypt' | 'International' | 'Global' | 'Online'; // Program's operational base or destination type
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  destinationRegion?: RegionFilter | string; // Specific region student will go to
  targetLevel?: LevelFilter | string; // e.g., High School, Undergraduate
  fundingCountry?: FundingCountryFilter | string;
  partner?: string;
  coverage?: string;
  deadline?: string;
  duration?: string;
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
  category?: string; // e.g., "STEM Leadership", "College Prep"
  location: 'Egypt' | 'International' | 'Online'; // Where the program takes place
  provider?: string; // Can be used as partner
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  focusArea?: ProgramFocusAreaFilter | string | string[];
  programDuration?: ProgramDurationFilter | string;
  partner?: string;
  coverage?: string; // What the program offers/covers
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
  category?: string; // e.g., "Education", "Community Development"
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  cost?: string;
  sdgFocus?: string;
  partner?: string;
  coverage?: string;
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
  category?: string; // e.g., "Multi-disciplinary", "STEM"
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
  partner?: string; // Could be the institution itself or a collaborator
  coverage?: string; // What the course includes
  deadline?: string;
}

// User Profile for Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: any; // Firestore Timestamp or ServerTimestamp
  lastLoginAt?: any; // Firestore Timestamp or ServerTimestamp
  photoURL?: string | null; // Optional, from Auth or custom
}
