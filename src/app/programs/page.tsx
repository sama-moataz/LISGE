
"use client";

import type { Metadata } from 'next';
import type { SummerProgram, LocationFilter } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plane, Users, MapPin, Code2, ExternalLink, Filter, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export const metadata: Metadata = { // Metadata must be static
//   title: 'Summer Programs for Students',
//   description: 'Explore exciting summer programs. Filter by location to find unique learning and cultural experiences with LISGE.',
//   keywords: ['summer programs', 'EducationUSA CCC', 'Girls Who Code', 'Brown Pre-College', 'Yale Young Global Scholars', 'student summer camps', 'academic summer programs'],
// };

const summerProgramsData: SummerProgram[] = [
  {
    id: 'ccc',
    name: 'EducationUSA Competitive College Club (CCC)',
    description: 'A program designed to assist high-achieving Egyptian students in applying to U.S. colleges and universities. Provides guidance, workshops, and resources.',
    eligibility: 'High school students, typically in grades 10-11.',
    websiteUrl: 'https://educationusa.state.gov/find-advising-center/egypt-cairo',
    icon: Plane,
    category: "College Prep",
    location: 'Egypt', // Program is in Egypt to help apply to US
    provider: 'EducationUSA',
  },
  {
    id: 'gwc',
    name: 'Girls Who Code Summer Immersion Program',
    description: 'A free 2-week virtual program for high school girls and non-binary students to learn coding and get exposure to tech jobs.',
    eligibility: 'Girls and non-binary students in grades 9-12 (US-focused, but virtual access may be possible).',
    websiteUrl: 'https://girlswhocode.com/programs/summer-immersion-program',
    icon: Code2,
    category: "Tech & Coding",
    location: 'Online',
    provider: 'Girls Who Code',
  },
  {
    id: 'brown-precollege',
    name: 'Brown Pre-College Programs',
    description: 'Offers a wide range of summer programs for high school students to experience college-level academics at Brown University.',
    eligibility: 'High school students, specific grade levels vary by program.',
    websiteUrl: 'https://precollege.brown.edu/',
    icon: MapPin,
    category: "University Experience",
    location: 'International', // US-based
    provider: 'Brown University',
  },
  {
    id: 'yaleygs',
    name: 'Yale Young Global Scholars (YYGS)',
    description: 'An academic enrichment and leadership development program that brings together outstanding high school students from around the world for two-week sessions on Yale’s campus or online.',
    eligibility: 'Typically ages 16-17, current sophomores or juniors in high school.',
    websiteUrl: 'https://globalscholars.yale.edu/',
    icon: Users,
    category: "Global Leadership",
    location: 'International', // US-based, some online
    provider: 'Yale University',
  },
  {
    id: 'guc-junior-talents',
    name: 'GUC "Junior Talents" Camps',
    description: 'Practical, hands-on camps for high school students (16-18) to explore talents in fields like Civil Engineering. Provides early exposure to university disciplines.',
    eligibility: 'High school students (16-18).',
    websiteUrl: 'https://www.guc.edu.eg/',
    icon: Briefcase,
    category: "STEM / Engineering",
    location: 'Egypt',
    provider: 'German University in Cairo',
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' },
];

export default function SummerProgramsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  const [filteredPrograms, setFilteredPrograms] = useState<SummerProgram[]>(summerProgramsData);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedLocation === 'All') {
      setFilteredPrograms(summerProgramsData);
    } else {
      setFilteredPrograms(
        summerProgramsData.filter((program) => program.location === selectedLocation)
      );
    }
  }, [selectedLocation]);

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Experience the World: Summer Programs</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover exciting summer programs. Use the filter to find learning and cultural experiences.
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

      {filteredPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {program.icon ? <program.icon className="h-8 w-8 text-accent" /> : <Briefcase className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-2xl font-headline">{program.name}</CardTitle>
                </div>
                 <div className="flex flex-wrap gap-2 text-sm">
                    {program.category && <p className="text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{program.category}</p>}
                    <p className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-full inline-block">{program.location}</p>
                </div>
                <CardDescription className="pt-2 text-base">{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(program.name)}`}
                  alt={program.name}
                  data-ai-hint="students summer"
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                <div>
                  <h3 className="font-semibold text-md mb-1">Eligibility:</h3>
                  <p className="text-sm text-muted-foreground">{program.eligibility}</p>
                </div>
                {program.provider && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Provider:</h3>
                    <p className="text-sm text-muted-foreground">{program.provider}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full group">
                  <Link href={program.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit Official Website <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <p className="text-center text-muted-foreground text-lg py-8">No summer programs found matching your criteria. Try broadening your search.</p>
      )}
    </div>
  );
}
