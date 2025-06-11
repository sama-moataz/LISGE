
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export type LocationFilter = 'All' | 'Egypt' | 'International' | 'Global' | 'Online';

// Scholarship & Exchange Program Filter Types
export type AgeFilter = 'All' | 'Under 16' | '16-18' | '18+';
export type FundingFilter = 'All' | 'Fully Funded' | 'Partial Scholarship' | 'Paid Program' | 'No Funding' | 'Varies';
export type RegionFilter = 'All' | 'USA' | 'Europe' | 'Asia' | 'Egypt/MENA' | 'Global' | 'Canada' | 'UK' | 'Other';
export type LevelFilter = 'All' | 'High School' | 'Undergraduate' | 'Postgraduate' | 'Youth' | 'All Levels' | 'Exchange' | 'Language' | 'Research' | 'Varies' | 'STEM' | 'Cultural Exchange' | 'Academic Exchange' | 'STEM Exchange';
export type FundingCountryFilter = 'All' | 'Egypt' | 'USA' | 'Germany' | 'UK' | 'Canada' | 'China' | 'South Korea' | 'Other';

export interface Scholarship {
  id: string; // Firestore document ID
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  iconName?: string; // Name of the lucide-react icon
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
  imageUrl?: string; // URL for the scholarship image
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ExchangeProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon; // Keep as LucideIcon for now, will update if/when managed by admin
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
  category?: string;
  location: 'Egypt' | 'International' | 'Online';
  provider?: string;
  ageRequirement?: AgeFilter | string;
  fundingLevel?: FundingFilter | string;
  focusArea?: ProgramFocusAreaFilter | string | string[];
  programDuration?: ProgramDurationFilter | string;
  partner?: string;
  coverage?: string;
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
  category?: string;
  location: 'Egypt' | 'International' | 'Online';
  duration?: string;
  creditsTransferable?: boolean;
  cost?: string;
  partner?: string;
  coverage?: string;
  deadline?: string;
}

// User Profile for Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'user' | 'Admin'; // Ensure 'Admin' matches Firestore
  createdAt: Timestamp; // Firestore Timestamp or ServerTimestamp
  lastLoginAt?: Timestamp; // Firestore Timestamp or ServerTimestamp
  photoURL?: string | null;
  phoneNumber?: string | null;
}
