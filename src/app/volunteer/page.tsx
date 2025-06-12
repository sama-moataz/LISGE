
"use client";

import type { VolunteerOpportunity, LocationFilter } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { HeartHandshake, Globe, MapPin, ExternalLink, Building, Users, Leaf, Filter, Info, CalendarDays, Landmark, DollarSign, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVolunteerOpportunities } from '@/lib/firestoreService';
import IconByName from '@/components/IconByName';
import { useToast } from "@/hooks/use-toast";

const staticVolunteerOpportunitiesData: VolunteerOpportunity[] = [
  {
    id: 'aiesec-giza',
    name: 'Global Classroom Teacher (AIESEC Giza)',
    organization: 'AIESEC in Giza (Arkan Future College)',
    description: 'Contribute to SDG #4 (Quality Education) by helping youth achieve literacy and numeracy.',
    eligibility: 'English proficiency required. Open to youth aged 18-30 (general AIESEC criteria).',
    websiteUrl: 'https://aiesec.org/global-volunteer', 
    icon: Users,
    category: "Education",
    location: 'Egypt',
    duration: "6 weeks",
    cost: "Approx. 790.16 USD (food & accommodation often provided/subsidized)",
    sdgFocus: "SDG #4: Quality Education",
    partner: "AIESEC & Arkan Future College",
    coverage: "Volunteer placement, potential for accommodation/food subsidies.",
    deadline: "Ongoing (check AIESEC portal)",
    dataAiHint: "teaching students classroom"
  },
  {
    id: 'volunteerworld-women-nuweiba',
    name: 'Women Empowerment Supporter - Bedouin Community',
    organization: 'Volunteer World (Habiba Community)',
    description: 'Help restore women-run food gardens through daily gardening activities, empowering female farmers in Nuweiba.',
    eligibility: '18+',
    websiteUrl: 'https://www.volunteerworld.com/volunteer-abroad/egypt',
    icon: HeartHandshake,
    category: "Community Development",
    location: 'Egypt',
    duration: "1-12 weeks",
    cost: "From 319 € per week (includes housing, food, Wi-Fi)",
    partner: "Habiba Community (via Volunteer World)",
    coverage: "Housing, food, Wi-Fi included in program fee.",
    deadline: "Varies (check Volunteer World)",
    dataAiHint: "women gardening community"
  },
  {
    id: 'volunteerworld-regen-agri-sinai',
    name: 'Regenerative Agriculture in Sinai Desert',
    organization: 'Volunteer World (Habiba Community)',
    description: 'Work to restore degraded landscapes in South Sinai through regenerative agriculture practices.',
    eligibility: '18+',
    websiteUrl: 'https://www.volunteerworld.com/volunteer-abroad/egypt',
    icon: Leaf,
    category: "Environmental Conservation",
    location: 'Egypt',
    duration: "1-12 weeks",
    cost: "From 319 € per week (includes housing, food, Wi-Fi)",
    partner: "Habiba Community (via Volunteer World)",
    coverage: "Housing, food, Wi-Fi included in program fee.",
    deadline: "Varies (check Volunteer World)",
    dataAiHint: "desert agriculture environment"
  },
  {
    id: 'aiesec-global-general',
    name: 'AIESEC Global Volunteer Program (Various Fields)',
    organization: 'AIESEC International',
    description: 'Cross-cultural experiences for youth (18-30) focusing on UN SDGs in numerous countries.',
    eligibility: 'Aged 18-30.',
    websiteUrl: 'https://aiesec.org/global-volunteer',
    icon: Globe,
    category: "Various SDGs",
    location: 'International',
    duration: "6-8 weeks",
    cost: "Program fee (e.g. ~785 USD) + travel. Food/accommodation often included.",
    partner: "AIESEC",
    coverage: "Cross-cultural volunteer placement, food/accommodation often included in program fee.",
    deadline: "Ongoing (check AIESEC portal for specific projects)",
    dataAiHint: "global volunteering students"
  },
  {
    id: 'baheya-foundation',
    name: 'Volunteer at Baheya Foundation',
    organization: 'Baheya Foundation for Early Detection & Treatment of Breast Cancer',
    description: 'Support the Baheya Foundation in their mission for early detection and treatment of breast cancer. Opportunities may include patient support, administrative tasks, or event assistance.',
    eligibility: 'Varies by role (Check Baheya website for specific requirements)',
    websiteUrl: 'https://baheya.org/en/volunteer',
    icon: HeartHandshake,
    category: "Healthcare Support",
    location: 'Egypt',
    duration: "Varies",
    cost: "Typically no cost for volunteering (verify any specific program details)",
    sdgFocus: "SDG #3: Good Health and Well-being",
    partner: "Baheya Foundation",
    coverage: "Gain experience in the healthcare sector, contribute to a vital community cause.",
    deadline: "Ongoing/Varies (check website)",
    dataAiHint: "hospital volunteer healthcare"
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' }, // Added Online for consistency, though static data doesn't use it yet
];


export default function VolunteerPage() {
  const [mounted, setMounted] = useState(false);
  const [firestoreOpportunities, setFirestoreOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  
  const fetchDynamicOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    console.log("[VolunteerPage] fetchDynamicOpportunities: Starting fetch...");
    try {
      const dynamicData = await getVolunteerOpportunities();
      console.log("[VolunteerPage] fetchDynamicOpportunities: Received dynamic data:", dynamicData.length, "items");
      setFirestoreOpportunities(dynamicData);
    } catch (err: any) {
      console.error("[VolunteerPage] fetchDynamicOpportunities: Error fetching opportunities:", err);
      setError(err.message || "Failed to load dynamic volunteer opportunities.");
      toast({ title: "Error Loading Opportunities", description: err.message || "Could not fetch opportunity data.", variant: "destructive" });
      setFirestoreOpportunities([]);
    } finally {
      setIsLoading(false);
      console.log("[VolunteerPage] fetchDynamicOpportunities: Fetch complete. Loading set to false.");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDynamicOpportunities();
  }, []);

  const combinedAndFilteredOpportunities = useMemo(() => {
    console.log("[VolunteerPage] useMemo: Calculating combinedAndFilteredOpportunities. Static count:", staticVolunteerOpportunitiesData.length, "Firestore count:", firestoreOpportunities.length);
    
    const dynamicOpportunityIds = new Set(firestoreOpportunities.map(p => p.id));
    const uniqueStaticOpportunities = staticVolunteerOpportunitiesData.filter(p => !dynamicOpportunityIds.has(p.id));
    const allOpportunities = [...uniqueStaticOpportunities, ...firestoreOpportunities];
    console.log("[VolunteerPage] useMemo: Total opportunities before filtering (static + unique dynamic):", allOpportunities.length);
    
    const filtered = allOpportunities.filter(op => {
      const locationMatch = selectedLocation === 'All' || op.location === selectedLocation;
      return locationMatch;
    });
    console.log("[VolunteerPage] useMemo: Total opportunities AFTER filtering:", filtered.length, "Filters:", {selectedLocation});
    return filtered;
  }, [firestoreOpportunities, selectedLocation]);

  const clearFilters = () => {
    setSelectedLocation('All');
  };

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Make a Difference: Volunteer Opportunities</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore impactful volunteer programs. Use the filter to narrow your search.
        </p>
      </div>

      <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:-mx-0 md:px-0">
        <Card className="p-4 md:p-6 shadow-md">
           <CardHeader className="p-0 pb-4 mb-4 border-b">
            <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filter Opportunities</CardTitle>
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
            <Button onClick={clearFilters} variant="outline" className="w-full sm:w-auto">
              <MapPin className="mr-2 h-4 w-4" /> Clear Location Filter
            </Button>
          </div>
        </Card>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading opportunities...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-6">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchDynamicOpportunities} className="mt-2">Try Again</Button>
        </div>
      )}

      {!isLoading && combinedAndFilteredOpportunities.length === 0 && !error && (
         <p className="text-center text-muted-foreground text-lg py-8">No volunteer opportunities found matching your criteria. Try broadening your search.</p>
      )}

      {!isLoading && combinedAndFilteredOpportunities.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {combinedAndFilteredOpportunities.map((opportunity) => {
            const commonIconProps = { className: "h-8 w-8 text-accent" };
            let iconToRender;

            if (opportunity.iconName) {
              iconToRender = <IconByName name={opportunity.iconName} {...commonIconProps} fallbackIcon={HeartHandshake} />;
            } else if (opportunity.icon) {
              const StaticIcon = opportunity.icon;
              iconToRender = <StaticIcon {...commonIconProps} />;
            } else {
              iconToRender = <HeartHandshake {...commonIconProps} />;
            }

            let displayImageUrl = opportunity.imageUrl;
            const isStaticProgram = staticVolunteerOpportunitiesData.some(sp => sp.id === opportunity.id);

            if (!displayImageUrl && isStaticProgram) {
                displayImageUrl = `/images/volunteer-${opportunity.id}.jpg`;
            } else if (!displayImageUrl) {
                displayImageUrl = `https://placehold.co/600x300.png?text=${encodeURIComponent(opportunity.name.substring(0,15))}`;
            }
            
            const dataAiHint = opportunity.dataAiHint || opportunity.name.toLowerCase().split(' ').slice(0,2).join(' ');

            return (
              <Card key={opportunity.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {iconToRender}
                    <CardTitle className="text-xl font-headline leading-tight">{opportunity.name}</CardTitle>
                  </div>
                   <div className="flex flex-wrap gap-2 text-xs">
                      {opportunity.category && <span className="bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full">{opportunity.category}</span>}
                       <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin size={12}/>{opportunity.location}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground pt-1">{opportunity.organization}</p>
                  <CardDescription className="pt-2 text-sm">{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm">
                  <Image 
                    src={displayImageUrl}
                    alt={opportunity.name}
                    data-ai-hint={dataAiHint}
                    width={600}
                    height={300}
                    className="rounded-md object-cover aspect-[2/1] mb-4"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x300.png?text=Image+Error`; }}
                  />
                  {opportunity.partner && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Landmark className="h-4 w-4 text-primary" />
                      <p><strong>Partner:</strong> {opportunity.partner}</p>
                    </div>
                  )}
                  {opportunity.coverage && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p><strong>Coverage:</strong> {opportunity.coverage.length > 100 ? opportunity.coverage.substring(0,100) + '...' : opportunity.coverage}</p>
                    </div>
                  )}
                  {opportunity.eligibility && (
                    <div>
                      <h4 className="font-semibold mb-0.5">Eligibility:</h4>
                      <p className="text-muted-foreground">{opportunity.eligibility}</p>
                    </div>
                  )}
                  {opportunity.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                       <CalendarDays className="h-4 w-4 text-primary" />
                      <p><strong>Duration:</strong> {opportunity.duration}</p>
                    </div>
                  )}
                  {opportunity.cost && (
                     <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <p><strong>Cost:</strong> {opportunity.cost}</p>
                    </div>
                  )}
                  {opportunity.sdgFocus && (
                     <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      <p><strong>SDG Focus:</strong> {opportunity.sdgFocus}</p>
                    </div>
                  )}
                   {opportunity.deadline && (
                    <div className="flex items-center gap-2 text-muted-foreground pt-1">
                      <CalendarDays className="h-4 w-4 text-primary" /> 
                      <p><strong>Deadline:</strong> {opportunity.deadline}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group">
                    <Link href={opportunity.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit Official Website <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          This is a selection of opportunities. Many more exist! Always verify details and application procedures on the official program websites.
        </p>
      </div>
    </div>
  );
}
    

    