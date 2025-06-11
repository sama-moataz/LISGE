
"use client";

import type { PreCollegeCourse, LocationFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { School2, Globe, MapPin, ExternalLink, BookOpen, Laptop, Filter, Info, CalendarDays, Landmark, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
    cost: "Not specified (check website)",
    partner: "American University in Cairo (AUC)",
    coverage: "College-level courses, social activities, trips, potential transferable credits.",
    deadline: "Varies (check AUC website)"
  },
  {
    id: 'guc-junior-talents',
    name: 'GUC "Junior Talents" Camps',
    institution: 'German University in Cairo (GUC)',
    description: 'Practical, hands-on camps for high school students (16-18) to explore talents in fields like Civil Engineering (e.g., "Build Out of the Box" camp). Provides early exposure to university disciplines.',
    eligibility: 'High school students (16-18).',
    websiteUrl: 'https://www.guc.edu.eg/',
    icon: School2, 
    category: "STEM / Engineering",
    location: 'Egypt',
    duration: "Varies (e.g., 3-day camps)",
    creditsTransferable: false,
    cost: "Not specified (check website)",
    partner: "German University in Cairo (GUC)",
    coverage: "Hands-on camps in various fields, early exposure to university disciplines.",
    deadline: "Varies (check GUC website)"
  },
  {
    id: 'jhu-pre-college',
    name: 'JHU Pre-College Summer Programs',
    institution: 'Johns Hopkins University (JHU)',
    description: 'Fast-paced, college-level learning for academically advanced high school students. On-campus and online options in fields like medicine, neuroscience, psychology. Earn academic credit.',
    eligibility: 'Academically advanced high school students. English proficiency may be required for international students.',
    websiteUrl: 'https://summer.jhu.edu/programs-courses/pre-college-programs/',
    icon: Globe,
    category: "STEM / Health Sciences / Psychology",
    location: 'International', 
    duration: "2-week sessions (June-August)",
    creditsTransferable: true,
    cost: "$1,950 USD per 1-credit program + $85 application fee. Financial aid available.",
    partner: "Johns Hopkins University",
    coverage: "College-level courses, potential academic credit. Financial aid available.",
    deadline: "Varies (typically Spring, check JHU website)"
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
    cost: "Varies (scholarships available, e.g., $7M annually)",
    partner: "CIEE",
    coverage: "Cultural immersion, academic programs, potential college credits. Scholarships available.",
    deadline: "Varies (check CIEE website)"
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' },
];

export default function PreCollegePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCourses = useMemo(() => {
    if (selectedLocation === 'All') {
      return preCollegeCoursesData;
    } else {
      return preCollegeCoursesData.filter(course => 
        course.location === selectedLocation || 
        (selectedLocation === 'Online' && course.location === 'International' && course.description.toLowerCase().includes('online')) || 
        (selectedLocation === 'Online' && course.location === 'Online')
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

      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-0 md:px-0">
        <Card className="p-4 md:p-6 shadow-md">
          <CardHeader className="p-0 pb-4 mb-4 border-b">
            <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Programs</CardTitle>
          </CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
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
        </Card>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {course.icon ? <course.icon className="h-8 w-8 text-accent" /> : <School2 className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-xl font-headline leading-tight">{course.name}</CardTitle>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{course.institution}</p>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {course.category && <span className="bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><BookOpen size={12}/>{course.category}</span>}
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={12}/>{course.location}</span>
                </div>
                <CardDescription className="pt-3 text-sm">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                 <Image 
                  src={`/images/precollege-${course.id}.jpg`}
                  alt={course.name}
                  data-ai-hint={course.location === 'Egypt' ? "egypt university" : "global study"}
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                {course.partner && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Landmark className="h-4 w-4 text-primary" />
                    <p><strong>Institution/Partner:</strong> {course.partner}</p>
                  </div>
                )}
                {course.coverage && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p><strong>Key Offerings:</strong> {course.coverage.length > 100 ? course.coverage.substring(0,100) + '...' : course.coverage}</p>
                  </div>
                )}
                {course.eligibility && (
                  <div>
                    <h4 className="font-semibold mb-0.5">Eligibility:</h4>
                    <p className="text-muted-foreground">{course.eligibility}</p>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <CalendarDays className="h-4 w-4 text-primary" />
                    <p><strong>Duration:</strong> {course.duration}</p>
                  </div>
                )}
                {course.creditsTransferable !== undefined && (
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p><strong>Credits Transferable:</strong> {course.creditsTransferable ? 'Yes' : 'No/Varies'}</p>
                  </div>
                )}
                {course.cost && (
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <p><strong>Cost:</strong> {course.cost}</p>
                  </div>
                )}
                {course.deadline && (
                  <div className="flex items-center gap-2 text-muted-foreground pt-1">
                    <CalendarDays className="h-4 w-4 text-primary" /> 
                    <p><strong>Deadline:</strong> {course.deadline}</p>
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

    