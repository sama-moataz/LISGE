
"use client";

import type { Scholarship, ScholarshipAgeFilter, ScholarshipFundingFilter, ScholarshipRegionFilter, ScholarshipLevelFilter, FundingCountryFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Award, Filter, GraduationCap, RefreshCw, Landmark, CalendarDays, Info, MapPin, DollarSign, Globe, Loader2, ExternalLink, BookOpen, Building } from 'lucide-react'; // Added BookOpen, Building
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getScholarships } from '@/lib/firestoreService'; 
import IconByName from '@/components/IconByName'; 
import { useToast } from "@/hooks/use-toast";

// Static Scholarship Data - these will be displayed alongside Firestore data
const staticScholarshipsData: Scholarship[] = [
  {
    id: 'static-sawiris',
    name: 'Sawiris Foundation Scholarship (Static Example)',
    description: 'A prestigious scholarship by the Sawiris Foundation for Egyptian students for undergraduate and postgraduate studies in various fields, promoting excellence and social development.',
    eligibility: 'Egyptian nationals, demonstrating academic excellence, leadership potential, and financial need. Specific criteria vary by program (Undergrad/Postgrad).',
    websiteUrl: 'https://www.sawirisfoundation.org/sfsp/',
    icon: Award, // Direct Lucide icon component
    category: "Higher Education",
    location: 'International', // Can be studied internationally
    destinationRegion: 'Global',
    targetLevel: 'Undergraduate',
    fundingLevel: 'Fully Funded',
    partner: "Sawiris Foundation",
    coverage: "Tuition, living expenses, travel, health insurance.",
    deadline: "Varies (check official website)",
    imageUrl: '/images/scholarship-static-sawiris.jpg', // Placeholder path
    dataAiHint: "egyptian scholarship award",
  },
  {
    id: 'static-ched',
    name: 'CHED Scholarship (Static Example - For Egyptian Public Universities)',
    description: 'The Egyptian government, through the Ministry of Higher Education, offers various scholarships and grants for students enrolled in Egyptian public universities, often based on merit or specific fields of study.',
    eligibility: 'Egyptian students enrolled in public universities. Criteria vary widely based on the specific grant or scholarship program.',
    websiteUrl: 'https://mohesr.gov.eg/ar-eg/Pages/default.aspx', // General Ministry link
    icon: Building, // Direct Lucide icon component
    category: "Public University",
    location: 'Egypt',
    destinationRegion: 'Egypt/MENA',
    targetLevel: 'Undergraduate',
    fundingLevel: 'Varies',
    partner: "Ministry of Higher Education, Egypt",
    coverage: "Varies; can range from tuition waivers to stipends.",
    deadline: "Varies by university and program",
    imageUrl: '/images/scholarship-static-ched.jpg', // Placeholder path
    dataAiHint: "egypt university",
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
  { value: 'Egypt/MENA', label: 'Egypt/MENA' },
  { value: 'USA', label: 'USA' },
  { value: 'Europe', label: 'Europe' },
  { value: 'UK', label: 'UK'},
  { value: 'Canada', label: 'Canada'},
  { value: 'Asia', label: 'Asia' },
  { value: 'Global', label: 'Global (Multiple/Any)' },
  { value: 'Other', label: 'Other' },
];

const levelOptions: { value: ScholarshipLevelFilter; label: string }[] = [
  { value: 'All', label: 'All Levels/Types' },
  { value: 'High School', label: 'High School Program' },
  { value: 'Undergraduate', label: 'Undergraduate Degree' },
  { value: 'Postgraduate', label: 'Postgraduate Degree' },
  { value: 'Language', label: 'Language Course' },
  { value: 'Exchange', label: 'Exchange Program' },
  { value: 'Research', label: 'Research Grant/Fellowship'},
  { value: 'Youth', label: 'Youth Program'},
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


export default function ScholarshipsPage() {
  const [mounted, setMounted] = useState(false);
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedAge, setSelectedAge] = useState<ScholarshipAgeFilter>('All');
  const [selectedFunding, setSelectedFunding] = useState<ScholarshipFundingFilter>('All');
  const [selectedRegion, setSelectedRegion] = useState<ScholarshipRegionFilter>('All');
  const [selectedLevel, setSelectedLevel] = useState<ScholarshipLevelFilter>('All');
  const [selectedFundingCountry, setSelectedFundingCountry] = useState<FundingCountryFilter>('All');

  const fetchAndCombineScholarships = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firestoreScholarships = await getScholarships(); // Fetches Firestore data (sorted by createdAt desc)
      // Combine static data first, then Firestore data
      setAllScholarships([...staticScholarshipsData, ...firestoreScholarships]);
    } catch (err: any) {
      setError(err.message || "Failed to load scholarships.");
      toast({ title: "Error Loading Scholarships", description: err.message || "Could not fetch scholarship data.", variant: "destructive" });
      setAllScholarships([...staticScholarshipsData]); // Fallback to static data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAndCombineScholarships();
  }, []);


  const filteredScholarships = useMemo(() => {
    return allScholarships.filter(scholarship => {
      const ageMatch = selectedAge === 'All' || (scholarship.ageRequirement && scholarship.ageRequirement === selectedAge);
      const fundingMatch = selectedFunding === 'All' || (scholarship.fundingLevel && scholarship.fundingLevel === selectedFunding);
      const regionMatch = selectedRegion === 'All' || (scholarship.destinationRegion && scholarship.destinationRegion === selectedRegion) || (selectedRegion === 'Egypt/MENA' && scholarship.location === 'Egypt');
      const levelMatch = selectedLevel === 'All' || (scholarship.targetLevel && scholarship.targetLevel === selectedLevel);
      const fundingCountryMatch = selectedFundingCountry === 'All' || (scholarship.fundingCountry && scholarship.fundingCountry === selectedFundingCountry);
      return ageMatch && fundingMatch && regionMatch && levelMatch && fundingCountryMatch;
    });
  }, [allScholarships, selectedAge, selectedFunding, selectedRegion, selectedLevel, selectedFundingCountry]);

  const clearFilters = () => {
    setSelectedAge('All');
    setSelectedFunding('All');
    setSelectedRegion('All');
    setSelectedLevel('All');
    setSelectedFundingCountry('All');
  };
  
  if (!mounted || isLoading) { 
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading scholarships...</p>
        </div>
    );
  }

  if (error && allScholarships.length === staticScholarshipsData.length) { // Show error only if Firestore fetch failed
    return (
      <div className="text-center py-10">
        <p className="text-destructive text-lg">Error fetching dynamic scholarships: {error}</p>
        <p className="text-muted-foreground mb-2">Displaying default scholarships. Some listings may be unavailable.</p>
        <Button onClick={fetchAndCombineScholarships} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Unlock Your Potential: Top Scholarships</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore renowned scholarship programs. Use the filters to narrow your search.
        </p>
      </div>

      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-0 md:px-0">
        <Card className="shadow-md">
          <Accordion type="single" collapsible className="w-full" defaultValue="filters-scholarships">
            <AccordionItem value="filters-scholarships" className="border-b-0">
              <AccordionTrigger className="p-4 md:p-6 hover:no-underline">
                <div className="flex justify-between w-full items-center">
                  <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Scholarships</CardTitle>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                    <SelectTrigger><SelectValue placeholder="Destination Region" /></SelectTrigger>
                    <SelectContent>
                      {regionOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as ScholarshipLevelFilter)}>
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

      {filteredScholarships.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {scholarship.icon ? (
                     <scholarship.icon className="h-8 w-8 text-accent" />
                  ) : scholarship.iconName ? (
                    <IconByName name={scholarship.iconName} className="h-8 w-8 text-accent" fallbackIcon={Award} />
                  ) : (
                    <Award className="h-8 w-8 text-accent" />
                  )}
                  <CardTitle className="text-xl font-headline leading-tight">{scholarship.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                    {scholarship.targetLevel && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><GraduationCap size={12}/>{scholarship.targetLevel}</span>}
                    {scholarship.destinationRegion && <span className="bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={12}/>{scholarship.destinationRegion}</span>}
                    {scholarship.fundingLevel && <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign size={12}/>{scholarship.fundingLevel}</span>}
                    {scholarship.fundingCountry && <span className="bg-muted/30 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1"><Globe size={12}/>Fund: {scholarship.fundingCountry}</span>}
                </div>
                <CardDescription className="pt-3 text-sm">{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                  <Image
                    src={scholarship.imageUrl || `https://placehold.co/600x300.png?text=${encodeURIComponent(scholarship.name)}`}
                    alt={scholarship.name}
                    data-ai-hint={scholarship.dataAiHint || "education opportunity"}
                    width={600}
                    height={300}
                    className="rounded-md object-cover aspect-[2/1] mb-4"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x300.png?text=Image+Error`; }}
                  />
                {scholarship.partner && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Landmark className="h-4 w-4 text-primary" />
                    <p><strong>Partner:</strong> {scholarship.partner}</p>
                  </div>
                )}
                {scholarship.coverage && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p><strong>Coverage:</strong> {scholarship.coverage.length > 100 ? scholarship.coverage.substring(0,100) + '...' : scholarship.coverage}</p>
                  </div>
                )}
                {scholarship.eligibility && (
                  <div>
                    <h4 className="font-semibold mb-0.5">Eligibility:</h4>
                    <p className="text-muted-foreground">{scholarship.eligibility.length > 120 ? scholarship.eligibility.substring(0,120) + '...' : scholarship.eligibility}</p>
                  </div>
                )}
                {scholarship.deadline && (
                  <div className="flex items-center gap-2 text-muted-foreground pt-1">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <p><strong>Deadline:</strong> {scholarship.deadline}</p>
                  </div>
                )}
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
