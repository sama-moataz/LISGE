
"use client";

import type { SummerProgram, ProgramAgeFilter, ProgramFundingFilter, ProgramFocusAreaFilter, ProgramDurationFilter, LocationFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plane, Users, MapPin, Code2, ExternalLink, Filter, Briefcase, RefreshCw, Globe, Landmark, CalendarDays, BookOpen, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const summerProgramsData: SummerProgram[] = [
  {
    id: 'ccc',
    name: 'EducationUSA Competitive College Club (CCC)',
    description: 'A program designed to assist high-achieving Egyptian students in applying to U.S. colleges and universities. Provides guidance, workshops, and resources.',
    eligibility: 'High school students, typically in grades 10-11.',
    websiteUrl: 'https://educationusa.state.gov/find-advising-center/egypt-cairo',
    icon: Plane,
    category: "College Prep",
    location: 'Egypt', 
    provider: 'EducationUSA',
    ageRequirement: '16-18',
    fundingLevel: 'Varies', // Often free or low-cost for CCC itself
    focusArea: 'College Prep',
    programDuration: 'Varies', // Academic year long engagement
    partner: 'EducationUSA',
    coverage: "Guidance, workshops, and resources for U.S. college applications.",
    deadline: "Varies (check with local EducationUSA center)"
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
    ageRequirement: 'Under 16', // Target grades 9-12, can include under 16
    fundingLevel: 'Fully Funded',
    focusArea: 'Tech & Coding',
    programDuration: '2-4 Weeks',
    partner: 'Girls Who Code',
    coverage: "Virtual coding instruction and tech job exposure.",
    deadline: "Applications typically open early in the year"
  },
  {
    id: 'techgirls',
    name: 'TechGirls Program',
    description: 'An international summer exchange program designed to empower and inspire young women to pursue careers in science and technology.',
    eligibility: "Girls aged 15-17, citizen of participating country (incl. Egypt), strong English skills, commitment to community project.",
    websiteUrl: 'https://techgirlsglobal.org/',
    icon: Briefcase, // Consistent with Exchange programs
    category: "STEM Leadership",
    location: 'International', // Takes place in USA
    provider: 'U.S. Department of State (via Legacy International)',
    ageRequirement: '16-18',
    fundingLevel: 'Fully Funded',
    focusArea: 'STEM',
    programDuration: '2-4 Weeks', // "Three-week summer exchange"
    partner: 'U.S. Department of State',
    coverage: "Full coverage for three-week summer exchange in the U.S. focused on STEM.",
    deadline: "December (Typical, check official site)"
  },
  {
    id: 'daad-summer-courses',
    name: 'DAAD University Summer Courses',
    description: 'Offers Egyptian undergraduate students an opportunity for short-term study in Germany, focusing on Language & Regional Studies. Enhances profile for future Master\'s scholarships.',
    eligibility: "Foreign students and graduates. (Egyptian undergraduate students eligible)",
    websiteUrl: 'https://www.daad.eg/en/find-funding/scholarship-database/',
    icon: Globe,
    category: "Language & Culture",
    location: 'International', // Germany
    provider: 'DAAD',
    ageRequirement: '18+', // Undergraduate
    fundingLevel: 'Partial Scholarship',
    focusArea: 'Language',
    programDuration: 'Varies', // "minimum of 18 teaching days"
    partner: 'DAAD',
    coverage: "One-time scholarship of €1,134 plus allowances for course fees, travel, and living expenses.",
    deadline: "December (Approximate)"
  },
  {
    id: 'yaleygs',
    name: 'Yale Young Global Scholars (YYGS)',
    description: 'An academic enrichment and leadership development program that brings together outstanding high school students from around the world for two-week sessions on Yale’s campus or online.',
    eligibility: 'Typically ages 16-17, current sophomores or juniors in high school.',
    websiteUrl: 'https://globalscholars.yale.edu/',
    icon: Users,
    category: "Global Leadership",
    location: 'International', // Can be Online or in USA
    provider: 'Yale University',
    ageRequirement: '16-18',
    fundingLevel: 'Paid Program', // Need-based financial aid available
    focusArea: 'Global Leadership',
    programDuration: '2-4 Weeks',
    partner: 'Yale University',
    coverage: "Academic sessions, lectures, workshops. Fee covers tuition, housing, meals for on-campus. Aid available.",
    deadline: 'Early January (check website)'
  },
];

const ageOptions: { value: ProgramAgeFilter; label: string }[] = [
  { value: 'All', label: 'All Ages/Grades' },
  { value: 'Under 16', label: 'Under 16' },
  { value: '16-18', label: '16-18' },
  { value: '18+', label: '18+' },
];

const fundingOptions: { value: ProgramFundingFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Levels' },
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Scholarship', label: 'Partial Scholarship' },
  { value: 'Paid Program', label: 'Paid Program' },
  { value: 'Varies', label: 'Varies' },
];

const focusAreaOptions: { value: ProgramFocusAreaFilter; label: string }[] = [
  { value: 'All', label: 'All Focus Areas' },
  { value: 'STEM', label: 'STEM' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Language', label: 'Language' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Test Prep', label: 'Test Prep' },
  { value: 'College Prep', label: 'College Prep' },
  { value: 'University Experience', label: 'University Experience' },
  { value: 'Tech & Coding', label: 'Tech & Coding' },
  { value: 'Global Leadership', label: 'Global Leadership' },
  { value: 'STEM / Engineering', label: 'STEM / Engineering' },
  { value: 'Various', label: 'Various/Multi-disciplinary' },
];

const durationOptions: { value: ProgramDurationFilter; label: string }[] = [
  { value: 'All', label: 'All Durations' },
  { value: '1 Week', label: '1 Week' },
  { value: '2-4 Weeks', label: '2-4 Weeks' },
  { value: '1 Month+', label: '1 Month+' },
  { value: 'Academic Year', label: 'Academic Year' }, // Less common for summer programs but possible for longer engagements
  { value: 'Varies', label: 'Varies' },
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
  const [selectedAge, setSelectedAge] = useState<ProgramAgeFilter>('All');
  const [selectedFunding, setSelectedFunding] = useState<ProgramFundingFilter>('All');
  const [selectedFocusArea, setSelectedFocusArea] = useState<ProgramFocusAreaFilter>('All');
  const [selectedDuration, setSelectedDuration] = useState<ProgramDurationFilter>('All');


  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPrograms = useMemo(() => {
    return summerProgramsData.filter(program => {
      const locationMatch = selectedLocation === 'All' || program.location === selectedLocation;
      const ageMatch = selectedAge === 'All' || (program.ageRequirement && program.ageRequirement === selectedAge);
      const fundingMatch = selectedFunding === 'All' || (program.fundingLevel && program.fundingLevel === selectedFunding);
      const focusAreaMatch = selectedFocusArea === 'All' || (program.focusArea && (Array.isArray(program.focusArea) ? program.focusArea.includes(selectedFocusArea) : program.focusArea === selectedFocusArea));
      const durationMatch = selectedDuration === 'All' || (program.programDuration && program.programDuration === selectedDuration);
      
      return locationMatch && ageMatch && fundingMatch && focusAreaMatch && durationMatch;
    });
  }, [selectedLocation, selectedAge, selectedFunding, selectedFocusArea, selectedDuration]);

  const clearFilters = () => {
    setSelectedLocation('All');
    setSelectedAge('All');
    setSelectedFunding('All');
    setSelectedFocusArea('All');
    setSelectedDuration('All');
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Experience the World: Summer Programs</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover exciting summer programs. Use the filters to find learning and cultural experiences.
        </p>
      </div>
      
      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-0 md:px-0">
        <Card className="p-4 md:p-6 shadow-md">
          <CardHeader className="p-0 pb-4 mb-4 border-b">
            <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Programs</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value as LocationFilter)}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                {locationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedAge} onValueChange={(value) => setSelectedAge(value as ProgramAgeFilter)}>
              <SelectTrigger><SelectValue placeholder="Age/Grade" /></SelectTrigger>
              <SelectContent>
                {ageOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedFunding} onValueChange={(value) => setSelectedFunding(value as ProgramFundingFilter)}>
              <SelectTrigger><SelectValue placeholder="Funding Level" /></SelectTrigger>
              <SelectContent>
                {fundingOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedFocusArea} onValueChange={(value) => setSelectedFocusArea(value as ProgramFocusAreaFilter)}>
              <SelectTrigger><SelectValue placeholder="Focus Area" /></SelectTrigger>
              <SelectContent>
                {focusAreaOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedDuration} onValueChange={(value) => setSelectedDuration(value as ProgramDurationFilter)}>
              <SelectTrigger><SelectValue placeholder="Duration" /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={clearFilters} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Clear All Filters
          </Button>
        </Card>
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {program.icon ? <program.icon className="h-8 w-8 text-accent" /> : <Briefcase className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-xl font-headline leading-tight">{program.name}</CardTitle>
                </div>
                 <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {program.focusArea && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><BookOpen size={12}/>{Array.isArray(program.focusArea) ? program.focusArea.join(', ') : program.focusArea}</span>}
                    {program.location && <span className="bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={12}/>{program.location}</span>}
                    {program.programDuration && program.programDuration !== 'All' && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><CalendarDays size={12}/>{program.programDuration}</span>}
                    {program.fundingLevel && program.fundingLevel !== 'All' && <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign size={12}/>{program.fundingLevel}</span>}
                    {program.ageRequirement && program.ageRequirement !== 'All' && <span className="bg-muted/30 text-muted-foreground px-2 py-0.5 rounded-full">Age: {program.ageRequirement}</span>}
                </div>
                <CardDescription className="pt-3 text-sm">{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(program.name)}`}
                  alt={program.name}
                  data-ai-hint="students summer"
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                 {program.partner && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Landmark className="h-4 w-4 text-primary" />
                    <p><strong>Partner:</strong> {program.partner}</p>
                  </div>
                )}
                {program.coverage && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p><strong>Coverage:</strong> {program.coverage.length > 100 ? program.coverage.substring(0,100) + '...' : program.coverage}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-0.5">Eligibility:</h4>
                  <p className="text-muted-foreground">{program.eligibility}</p>
                </div>
                {program.deadline && (
                  <div className="flex items-center gap-2 text-muted-foreground pt-1">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <p><strong>Deadline:</strong> {program.deadline}</p>
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
         <p className="text-center text-muted-foreground text-lg py-8">No summer programs found matching your criteria. Try broadening your search or clearing some filters.</p>
      )}
    </div>
  );
}
