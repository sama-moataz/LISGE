
"use client";

import type { ExchangeProgram, LocationFilter, AgeFilter, FundingFilter, RegionFilter, LevelFilter, FundingCountryFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Globe2, ExternalLink, Filter, RefreshCw, Landmark, CalendarDays, Info, MapPin, Users, GraduationCap, DollarSign, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const exchangeProgramsData: ExchangeProgram[] = [
  {
    id: 'yes-program',
    name: 'Kennedy-Lugar Youth Exchange and Study (YES) Program',
    description: 'Provides scholarships for high school students from countries with significant Muslim populations to spend up to one academic year in the United States.',
    eligibility: 'High school students aged 15-17, Egyptian nationality, min 80% grades.',
    websiteUrl: 'https://www.yesprograms.org/',
    icon: Users,
    category: "Cultural Exchange",
    location: 'International',
    ageRequirement: '16-18',
    fundingLevel: 'Fully Funded',
    destinationRegion: 'USA',
    targetLevel: 'High School',
    fundingCountry: 'USA',
    partner: 'U.S. Department of State',
    coverage: 'Full scholarship to spend one academic year in the U.S., living with a host family.',
    deadline: "May (Typical, for next academic year)",
    duration: "1 Academic Year"
  },
  {
    id: 'sics-program',
    name: 'Study in Canada Scholarships (SiCS)',
    description: 'Provides short-term exchange opportunities for students from select countries, including Egypt, to pursue studies or conduct research at Canadian post-secondary institutions.',
    eligibility: "Students from select countries (incl. Egypt) enrolled in a post-secondary institution.",
    websiteUrl: 'https://www.educanada.ca/scholarships-bourses/can/institutions/study-in-canada-sep-etudes-au-canada-pct.aspx?lang=eng',
    icon: GraduationCap,
    category: "Academic Exchange",
    location: 'International',
    ageRequirement: '18+',
    fundingLevel: 'Fully Funded', 
    destinationRegion: 'Canada',
    targetLevel: 'Research', 
    fundingCountry: 'Canada',
    partner: 'Global Affairs Canada',
    coverage: 'Fully funded research opportunities (4-6 months). Travel, living allowance, health insurance, visa fees.',
    deadline: "Varies by Canadian institution (typically early Spring)",
    duration: "4-6 Months"
  },
  {
    id: 'techgirls-program',
    name: 'TechGirls Program',
    description: 'An international summer exchange program designed to empower and inspire young women to pursue careers in science and technology.',
    eligibility: "Girls aged 15-17, citizen of participating country (incl. Egypt), strong English skills, commitment to community project.",
    websiteUrl: 'https://techgirlsglobal.org/',
    icon: Briefcase, 
    category: "STEM Exchange", 
    location: 'International',
    ageRequirement: '16-18',
    fundingLevel: 'Fully Funded',
    destinationRegion: 'USA',
    targetLevel: 'High School', 
    fundingCountry: 'USA',
    partner: 'U.S. Department of State',
    coverage: 'Three-week summer exchange in the U.S. focused on STEM, all program costs covered.',
    deadline: "December (Typical, check official site)",
    duration: "3 Weeks"
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' },
];

const ageOptions: { value: AgeFilter; label: string }[] = [
  { value: 'All', label: 'All Ages/Grades' },
  { value: 'Under 16', label: 'Under 16' },
  { value: '16-18', label: '16-18' },
  { value: '18+', label: '18+' },
];

const fundingOptions: { value: FundingFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Levels' },
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Scholarship', label: 'Partial Scholarship' },
  { value: 'Paid Program', label: 'Paid Program' },
  { value: 'Varies', label: 'Varies' },
];

const regionOptions: { value: RegionFilter; label: string }[] = [
  { value: 'All', label: 'All Destinations' },
  { value: 'USA', label: 'USA' },
  { value: 'Canada', label: 'Canada' },
  { value: 'UK', label: 'UK' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Egypt/MENA', label: 'Egypt/MENA' },
  { value: 'Global', label: 'Global (Multiple/Any)' },
  { value: 'Other', label: 'Other' },
];

const levelOptions: { value: LevelFilter; label: string }[] = [
  { value: 'All', label: 'All Levels/Types' },
  { value: 'High School', label: 'High School Program' },
  { value: 'Undergraduate', label: 'Undergraduate Exchange' },
  { value: 'Postgraduate', label: 'Postgraduate Exchange' },
  { value: 'Youth', label: 'Youth Program'},
  { value: 'Cultural Exchange', label: 'Cultural Exchange'},
  { value: 'Academic Exchange', label: 'Academic Exchange'},
  { value: 'STEM Exchange', label: 'STEM Exchange'},
  { value: 'Research', label: 'Research Exchange'},
  { value: 'Varies', label: 'Varies/Other' },
];

const fundingCountryOptions: { value: FundingCountryFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Countries' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'USA', label: 'USA' },
  { value: 'Germany', label: 'Germany' },
  { value: 'UK', label: 'UK' },
  { value: 'Canada', label: 'Canada' },
  { value: 'China', label: 'China' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Other', label: 'Other' },
];


export default function ExchangeProgramsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  const [selectedAge, setSelectedAge] = useState<AgeFilter>('All');
  const [selectedFunding, setSelectedFunding] = useState<FundingFilter>('All');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('All');
  const [selectedFundingCountry, setSelectedFundingCountry] = useState<FundingCountryFilter>('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPrograms = useMemo(() => {
    return exchangeProgramsData.filter(program => {
      const locationMatch = selectedLocation === 'All' || program.location === selectedLocation;
      const ageMatch = selectedAge === 'All' || (program.ageRequirement && program.ageRequirement === selectedAge);
      const fundingMatch = selectedFunding === 'All' || (program.fundingLevel && program.fundingLevel === selectedFunding);
      const regionMatch = selectedRegion === 'All' || (program.destinationRegion && program.destinationRegion === selectedRegion);
      const levelMatch = selectedLevel === 'All' || (program.targetLevel && program.targetLevel === selectedLevel);
      const fundingCountryMatch = selectedFundingCountry === 'All' || (program.fundingCountry && program.fundingCountry === selectedFundingCountry);
      return locationMatch && ageMatch && fundingMatch && regionMatch && levelMatch && fundingCountryMatch;
    });
  }, [selectedLocation, selectedAge, selectedFunding, selectedRegion, selectedLevel, selectedFundingCountry]);
  
  const clearFilters = () => {
    setSelectedLocation('All');
    setSelectedAge('All');
    setSelectedFunding('All');
    setSelectedRegion('All');
    setSelectedLevel('All');
    setSelectedFundingCountry('All');
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Discover Exchange Programs</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Broaden your horizons with transformative exchange experiences. Use filters to find your match.
        </p>
      </div>

      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-0 md:px-0">
        <Card className="shadow-md">
          <Accordion type="single" collapsible className="w-full" defaultValue="filters-exchange">
            <AccordionItem value="filters-exchange" className="border-b-0">
              <AccordionTrigger className="p-4 md:p-6 hover:no-underline">
                <div className="flex justify-between w-full items-center">
                  <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Exchange Programs</CardTitle>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value as LocationFilter)}>
                    <SelectTrigger><SelectValue placeholder="Location (Program Base)" /></SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedAge} onValueChange={(value) => setSelectedAge(value as AgeFilter)}>
                    <SelectTrigger><SelectValue placeholder="Age/Grade" /></SelectTrigger>
                    <SelectContent>
                      {ageOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedFunding} onValueChange={(value) => setSelectedFunding(value as FundingFilter)}>
                    <SelectTrigger><SelectValue placeholder="Funding Level" /></SelectTrigger>
                    <SelectContent>
                      {fundingOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as RegionFilter)}>
                    <SelectTrigger><SelectValue placeholder="Destination Region" /></SelectTrigger>
                    <SelectContent>
                      {regionOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as LevelFilter)}>
                    <SelectTrigger><SelectValue placeholder="Target Level/Type" /></SelectTrigger>
                    <SelectContent>
                      {levelOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedFundingCountry} onValueChange={(value) => setSelectedFundingCountry(value as FundingCountryFilter)}>
                    <SelectTrigger><SelectValue placeholder="Funding Country" /></SelectTrigger>
                    <SelectContent>
                      {fundingCountryOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={clearFilters} variant="outline" className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear All Filters
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
      
      {filteredPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {program.icon ? <program.icon className="h-8 w-8 text-accent" /> : <Globe2 className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-xl font-headline leading-tight">{program.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {program.targetLevel && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><GraduationCap size={12}/>{program.targetLevel}</span>}
                    {program.destinationRegion && <span className="bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={12}/>{program.destinationRegion}</span>}
                    {program.fundingLevel && <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign size={12}/>{program.fundingLevel}</span>}
                    {program.fundingCountry && <span className="bg-muted/30 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><Globe2 size={12}/>Fund: {program.fundingCountry}</span>}
                    {program.duration && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><CalendarDays size={12}/>{program.duration}</span>}
                </div>
                <CardDescription className="pt-3 text-sm">{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                 <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(program.name)}`}
                  alt={program.name}
                  data-ai-hint="students global"
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
                {program.eligibility && (
                  <div>
                    <h4 className="font-semibold mb-0.5">Eligibility:</h4>
                    <p className="text-muted-foreground">{program.eligibility.length > 120 ? program.eligibility.substring(0,120) + '...' : program.eligibility}</p>
                  </div>
                )}
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
        <p className="text-center text-muted-foreground text-lg py-8">No exchange programs found matching your criteria. Try broadening your search or clearing some filters.</p>
      )}
       <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          This is a selection of programs. Many more exist! Always verify details, dates, and application procedures on the official program websites.
        </p>
      </div>
    </div>
  );
}

    