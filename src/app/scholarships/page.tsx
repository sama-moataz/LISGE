
"use client";

import type { Scholarship, ScholarshipAgeFilter, ScholarshipFundingFilter, ScholarshipRegionFilter, ScholarshipTypeFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Award, BookOpen, Users, Globe, ExternalLink, Filter, GraduationCap, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    ageRequirement: '16-18',
    fundingLevel: 'Varies',
    destinationRegion: 'Global',
    scholarshipType: 'High School',
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
    ageRequirement: '16-18', // Simplified from 15-17 for filter
    fundingLevel: 'Fully Funded',
    destinationRegion: 'Global',
    scholarshipType: 'High School',
  },
  {
    id: 'yes',
    name: 'Kennedy-Lugar Youth Exchange and Study (YES) Program',
    description: 'Provides scholarships for high school students from countries with significant Muslim populations to spend up to one academic year in the United States.',
    eligibility: 'High school students, age requirements vary by country. (Typically 15-17)',
    websiteUrl: 'https://www.yesprograms.org/',
    icon: Users,
    category: "Cultural Exchange",
    location: 'International',
    ageRequirement: '16-18', // Simplified
    fundingLevel: 'Fully Funded',
    destinationRegion: 'USA',
    scholarshipType: 'Exchange',
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
    ageRequirement: '18+',
    fundingLevel: 'Fully Funded',
    destinationRegion: 'Global',
    scholarshipType: 'Undergraduate', // Can also be post-grad
  },
  {
    id: 'hei-local',
    name: 'HEI Local Scholarships (Private Universities)',
    description: 'Scholarships for Egyptian public school graduates to pursue programs in Egyptian private universities. Focus on agribusiness, engineering, economics, IT.',
    eligibility: 'Egyptian public school graduates. Economically disadvantaged.',
    websiteUrl: 'https://educationusa.state.gov/find-advising-center/egypt-cairo',
    icon: Award,
    category: "Higher Education",
    location: 'Egypt',
    ageRequirement: '18+', // Assuming for university
    fundingLevel: 'Varies', // Often full, but can vary
    destinationRegion: 'Egypt/MENA',
    scholarshipType: 'Undergraduate',
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
    ageRequirement: '18+', // Assuming for university
    fundingLevel: 'Fully Funded',
    destinationRegion: 'Egypt/MENA',
    scholarshipType: 'Undergraduate',
  },
  {
    id: 'daad-summer',
    name: 'DAAD University Summer Courses (Germany)',
    description: 'Language & Regional Studies courses in Germany. One-time payment of €1,134 + allowances. Enhances profile for future Master\'s scholarships.',
    eligibility: 'Egyptian undergraduate students. Approx. deadline Dec.',
    websiteUrl: 'https://www.daad.eg/en/find-funding/scholarship-database/',
    icon: Globe,
    category: "Language & Regional Studies",
    location: 'International',
    ageRequirement: '18+',
    fundingLevel: 'Partial Scholarship', // It's a grant, not full tuition
    destinationRegion: 'Europe',
    scholarshipType: 'Language',
  },
];

const ageOptions: { value: ScholarshipAgeFilter; label: string }[] = [
  { value: 'All', label: 'All Ages/Grades' },
  { value: 'Under 16', label: 'Under 16' },
  { value: '16-18', label: '16-18' },
  { value: '18+', label: '18+' },
];

const fundingOptions: { value: ScholarshipFundingFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Levels' },
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Scholarship', label: 'Partial Scholarship' },
  { value: 'No Funding', label: 'No Funding' },
  { value: 'Varies', label: 'Varies' },
];

const regionOptions: { value: ScholarshipRegionFilter; label: string }[] = [
  { value: 'All', label: 'All Destinations' },
  { value: 'USA', label: 'USA' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Egypt/MENA', label: 'Egypt/MENA' },
  { value: 'Global', label: 'Global (Multiple/Any)' },
  { value: 'Other', label: 'Other' },
];

const typeOptions: { value: ScholarshipTypeFilter; label: string }[] = [
  { value: 'All', label: 'All Types' },
  { value: 'High School', label: 'High School Program' },
  { value: 'Undergraduate', label: 'Undergraduate Degree' },
  { value: 'Language', label: 'Language Course' },
  { value: 'Exchange', label: 'Exchange Program' },
  { value: 'Varies', label: 'Varies/Other' },
];


export default function ScholarshipsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedAge, setSelectedAge] = useState<ScholarshipAgeFilter>('All');
  const [selectedFunding, setSelectedFunding] = useState<ScholarshipFundingFilter>('All');
  const [selectedRegion, setSelectedRegion] = useState<ScholarshipRegionFilter>('All');
  const [selectedType, setSelectedType] = useState<ScholarshipTypeFilter>('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredScholarships = useMemo(() => {
    return scholarshipsData.filter(scholarship => {
      const ageMatch = selectedAge === 'All' || (scholarship.ageRequirement && scholarship.ageRequirement === selectedAge);
      const fundingMatch = selectedFunding === 'All' || (scholarship.fundingLevel && scholarship.fundingLevel === selectedFunding);
      const regionMatch = selectedRegion === 'All' || (scholarship.destinationRegion && scholarship.destinationRegion === selectedRegion) || (selectedRegion === 'Egypt/MENA' && scholarship.location === 'Egypt');
      const typeMatch = selectedType === 'All' || (scholarship.scholarshipType && scholarship.scholarshipType === selectedType);
      return ageMatch && fundingMatch && regionMatch && typeMatch;
    });
  }, [selectedAge, selectedFunding, selectedRegion, selectedType]);
  
  const clearFilters = () => {
    setSelectedAge('All');
    setSelectedFunding('All');
    setSelectedRegion('All');
    setSelectedType('All');
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Unlock Your Potential: Top Scholarships</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore renowned scholarship programs. Use the filters to narrow your search.
        </p>
      </div>

      <Card className="p-4 md:p-6 shadow-md">
        <CardHeader className="p-0 pb-4 mb-4 border-b">
          <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Scholarships</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Select value={selectedAge} onValueChange={(value) => setSelectedAge(value as ScholarshipAgeFilter)}>
            <SelectTrigger><SelectValue placeholder="Age/Grade" /></SelectTrigger>
            <SelectContent>
              {ageOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedFunding} onValueChange={(value) => setSelectedFunding(value as ScholarshipFundingFilter)}>
            <SelectTrigger><SelectValue placeholder="Funding Level" /></SelectTrigger>
            <SelectContent>
              {fundingOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as ScholarshipRegionFilter)}>
            <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
            <SelectContent>
              {regionOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ScholarshipTypeFilter)}>
            <SelectTrigger><SelectValue placeholder="Scholarship Type" /></SelectTrigger>
            <SelectContent>
              {typeOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={clearFilters} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </Card>

      {filteredScholarships.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {scholarship.icon ? <scholarship.icon className="h-8 w-8 text-accent" /> : <Award className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-2xl font-headline">{scholarship.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {scholarship.scholarshipType && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{scholarship.scholarshipType}</span>}
                    {scholarship.destinationRegion && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{scholarship.destinationRegion}</span>}
                    {scholarship.fundingLevel && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{scholarship.fundingLevel}</span>}
                    {scholarship.ageRequirement && scholarship.ageRequirement !== 'All' && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Age: {scholarship.ageRequirement}</span>}
                </div>
                <CardDescription className="pt-3 text-base">{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
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
        <p className="text-center text-muted-foreground text-lg py-8">No scholarships found matching your criteria. Try broadening your search or clearing some filters.</p>
      )}
    </div>
  );
}
