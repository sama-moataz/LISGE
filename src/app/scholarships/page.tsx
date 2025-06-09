
"use client";

import type { Metadata } from 'next';
import type { Scholarship, LocationFilter } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Award, BookOpen, Users, Globe, ExternalLink, Filter } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export const metadata: Metadata = { // Metadata must be static in App Router or generated via generateMetadata
//   title: 'Scholarships for Egyptian Students',
//   description: 'Discover top scholarships like UWC, Rise, YES Program, and Aspire Institute. Find opportunities for local and international study to fund your education with LISGE.',
//   keywords: ['scholarships', 'UWC', 'Rise Program', 'YES Program', 'Aspire Institute', 'international scholarships', 'Egyptian students scholarships'],
// };

const scholarshipsData: Scholarship[] = [
  {
    id: 'uwc',
    name: 'UWC (United World Colleges)',
    description: 'A global education movement that makes education a force to unite people, nations and cultures for peace and a sustainable future.',
    eligibility: 'Typically ages 16-19, varies by national committee.',
    websiteUrl: 'https://www.uwc.org/',
    icon: Globe,
    category: "International Baccalaureate",
    location: 'Global',
  },
  {
    id: 'rise',
    name: 'Rise for the World',
    description: 'Rise is a program that finds promising young people and provides them with opportunities that allow them to work together to serve others over their lifetimes.',
    eligibility: 'Ages 15-17 at time of application.',
    websiteUrl: 'https://www.risefortheworld.org/',
    icon: Award,
    category: "Global Talent Program",
    location: 'Global',
  },
  {
    id: 'yes',
    name: 'Kennedy-Lugar Youth Exchange and Study (YES) Program',
    description: 'Provides scholarships for high school students from countries with significant Muslim populations to spend up to one academic year in the United States.',
    eligibility: 'High school students, age requirements vary by country.',
    websiteUrl: 'https://www.yesprograms.org/',
    icon: Users,
    category: "Cultural Exchange",
    location: 'International', // Specifically US, so "International"
  },
  {
    id: 'aspire',
    name: 'Aspire Institute Leaders Program',
    description: 'A fully-funded leadership development program for first-generation college students and recent graduates from underserved backgrounds globally.',
    eligibility: 'First-generation college students/recent grads, 18-29 years old.',
    websiteUrl: 'https://www.aspireleaders.org/',
    icon: BookOpen,
    category: "Leadership Development",
    location: 'Global',
  },
  // Add more scholarships from the document, ensuring 'location' is set correctly.
  // Example for an Egypt-based scholarship (assuming data from the user's doc):
  {
    id: 'hei-local',
    name: 'HEI Local Scholarships (Private Universities)',
    description: 'Scholarships for Egyptian public school graduates to pursue programs in Egyptian private universities. Focus on agribusiness, engineering, economics, IT.',
    eligibility: 'Egyptian public school graduates. Economically disadvantaged.',
    websiteUrl: 'https://educationusa.state.gov/find-advising-center/egypt-cairo', // General link, specific program link might be better
    icon: Award,
    category: "Higher Education",
    location: 'Egypt',
  },
   {
    id: 'guc-thanaweya-amma',
    name: 'GUC National Top Ranked Thanaweya Amma Scholarship',
    description: 'Full scholarship for Egyptian citizens ranked top 10 nationally in Al-Thanaweya Al-Amma. Covers study fees, accommodation (if outside Cairo), transportation, etc.',
    eligibility: 'Top 10 Thanaweya Amma. Pass GUC admission. Maintain 3.00 CGPA.',
    websiteUrl: 'https://www.guc.edu.eg/',
    icon: GraduationCap,
    category: "Full Scholarship",
    location: 'Egypt',
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Global', label: 'Global (Multiple Countries)' },
];

export default function ScholarshipsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>(scholarshipsData);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedLocation === 'All') {
      setFilteredScholarships(scholarshipsData);
    } else {
      setFilteredScholarships(
        scholarshipsData.filter((scholarship) => scholarship.location === selectedLocation)
      );
    }
  }, [selectedLocation]);
  
  if (!mounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Unlock Your Potential: Top Scholarships</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore renowned scholarship programs. Use the filter to narrow your search.
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

      {filteredScholarships.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {scholarship.icon ? <scholarship.icon className="h-8 w-8 text-accent" /> : <Award className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-2xl font-headline">{scholarship.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    {scholarship.category && <p className="text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{scholarship.category}</p>}
                    <p className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-full inline-block">{scholarship.location}</p>
                </div>
                <CardDescription className="pt-2 text-base">{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(scholarship.name)}`}
                  alt={scholarship.name}
                  data-ai-hint="education opportunity"
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                <div>
                  <h3 className="font-semibold text-md mb-1">Eligibility:</h3>
                  <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full group">
                  <Link href={scholarship.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit Official Website <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-8">No scholarships found matching your criteria. Try broadening your search.</p>
      )}
    </div>
  );
}
