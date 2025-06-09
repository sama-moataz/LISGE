
"use client";

import type { Metadata } from 'next';
import type { PreCollegeCourse, LocationFilter } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { School2, Globe, MapPin, ExternalLink, BookOpen, Laptop, Filter } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export const metadata: Metadata = { // Metadata must be static
//   title: 'Pre-College Programs for University Preparation',
//   description: 'Discover pre-college courses. Filter by location to prepare for university life and academics with LISGE.',
//   keywords: ['pre-college programs', 'AUC College Bound', 'GUC Junior Talents', 'Johns Hopkins pre-college', 'CIEE Global Navigator', 'university preparation'],
// };

const preCollegeCoursesData: PreCollegeCourse[] = [
  {
    id: 'auc-college-bound',
    name: 'College Bound: AUC',
    institution: 'American University in Cairo (AUC)',
    description: 'Experience college life, discover passions, explore courses (e.g., CS, Graphic Design, Political Science, Psychology), and earn transferable credits. Includes social activities and trips.',
    eligibility: 'High school students.',
    websiteUrl: 'https://www.aucegypt.edu/academics/college-bound-auc',
    icon: School2,
    category: "Multi-disciplinary",
    location: 'Egypt',
    duration: "3 weeks (e.g., July 27 - Aug 14, 2025)",
    creditsTransferable: true,
    cost: "Not specified (check website)"
  },
  {
    id: 'guc-junior-talents',
    name: 'GUC "Junior Talents" Camps',
    institution: 'German University in Cairo (GUC)',
    description: 'Practical, hands-on camps for high school students (16-18) to explore talents in fields like Civil Engineering (e.g., "Build Out of the Box" camp). Provides early exposure to university disciplines.',
    eligibility: 'High school students (16-18).',
    websiteUrl: 'https://www.guc.edu.eg/', // General site, specific page for camps if available
    icon: MapPin,
    category: "STEM / Engineering",
    location: 'Egypt',
    duration: "Varies (e.g., 3-day camps)",
    creditsTransferable: false,
    cost: "Not specified (check website)"
  },
  {
    id: 'jhu-pre-college',
    name: 'JHU Pre-College Summer Programs',
    institution: 'Johns Hopkins University (JHU)',
    description: 'Fast-paced, college-level learning for academically advanced high school students. On-campus and online options in fields like medicine, neuroscience, psychology. Earn academic credit.',
    eligibility: 'Academically advanced high school students. English proficiency (TOEFL, IELTS, Duolingo) may be required for international students.',
    websiteUrl: 'https://summer.jhu.edu/programs-courses/pre-college-programs/',
    icon: Globe,
    category: "STEM / Health Sciences / Psychology",
    location: 'International', // Primarily US, some online options
    duration: "2-week sessions (June-August)",
    creditsTransferable: true,
    cost: "$1,950 USD per 1-credit program + $85 application fee. Financial aid available."
  },
  {
    id: 'ciee-global-navigator',
    name: 'CIEE Global Navigator High School Summer Abroad',
    institution: 'CIEE',
    description: 'Explore different cultures and gain real-world experience in 35+ destinations. Programs in Arts & Culture, Business, Language, Leadership & Service. Earn college credits. Scholarships available.',
    eligibility: 'Students aged 15-18.',
    websiteUrl: 'https://www.ciee.org/go-abroad/high-school-study-abroad/summer',
    icon: Globe,
    category: "Various (Language, Arts, Business, Service)",
    location: 'International',
    duration: "3 to 8 weeks",
    creditsTransferable: true,
    cost: "Varies (e.g., $7M in scholarships available annually)"
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' }, // JHU has online options
];

export default function PreCollegePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  const [filteredCourses, setFilteredCourses] = useState<PreCollegeCourse[]>(preCollegeCoursesData);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedLocation === 'All') {
      setFilteredCourses(preCollegeCoursesData);
    } else {
      setFilteredCourses(
        preCollegeCoursesData.filter((course) => course.location === selectedLocation || (selectedLocation === 'International' && course.location === 'Online' && course.institution !== 'AUC' && course.institution !== 'GUC')) // Basic online logic
      );
    }
  }, [selectedLocation]);

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Prepare for University: Pre-College Programs</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get a taste of university life and academics. Use the filter to narrow your search.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg shadow-sm bg-card">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-5 w-5 text-primary" />
          Filter by Location:
        </div>
        <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value as LocationFilter)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {course.icon ? <course.icon className="h-8 w-8 text-accent" /> : <School2 className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-2xl font-headline">{course.name}</CardTitle>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{course.institution}</p>
                <div className="flex flex-wrap gap-2 text-sm mt-1">
                    {course.category && <p className="text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{course.category}</p>}
                    <p className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-full inline-block">{course.location}</p>
                </div>
                <CardDescription className="pt-2 text-base">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                 <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(course.name)}`}
                  alt={course.name}
                  data-ai-hint={course.location === 'Egypt' ? "egypt university" : "global study"}
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                {course.eligibility && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Eligibility:</h3>
                    <p className="text-sm text-muted-foreground">{course.eligibility}</p>
                  </div>
                )}
                 {course.duration && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Duration:</h3>
                    <p className="text-sm text-muted-foreground">{course.duration}</p>
                  </div>
                )}
                {course.creditsTransferable !== undefined && (
                   <div>
                    <h3 className="font-semibold text-md mb-1">Credits Transferable:</h3>
                    <p className="text-sm text-muted-foreground">{course.creditsTransferable ? 'Yes' : 'No/Varies'}</p>
                  </div>
                )}
                {course.cost && (
                   <div>
                    <h3 className="font-semibold text-md mb-1">Cost:</h3>
                    <p className="text-sm text-muted-foreground">{course.cost}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full group">
                  <Link href={course.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit Official Website <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-8">No pre-college courses found matching your criteria. Try broadening your search.</p>
      )}
      <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          This is a selection of programs. Many more exist! Always verify details, dates, and application procedures on the official program websites.
        </p>
      </div>
    </div>
  );
}
