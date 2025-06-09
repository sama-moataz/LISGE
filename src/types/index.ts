
import type { LucideIcon } from 'lucide-react';

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon; // Optional icon for category
  category?: string; // Optional category text
}

export interface StudyTip {
  id: string;
  title: string;
  content: string;
  icon?: LucideIcon;
}

export interface SummerProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  websiteUrl: string;
  icon?: LucideIcon; // Optional icon for category
  category?: string; // Optional category text
}
