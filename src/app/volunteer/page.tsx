
"use client";

import type { Metadata } from 'next';
import type { VolunteerOpportunity, LocationFilter } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { HeartHandshake, Globe, MapPin, ExternalLink, Building, Users, Leaf, Filter } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export const metadata: Metadata = { // Metadata must be static
//   title: 'Volunteer Opportunities for Students',
//   description: 'Find impactful volunteer programs. Filter by location to make a difference with LISGE.',
//   keywords: ['volunteer opportunities', 'AIESEC Egypt', 'Volunteer World Egypt', 'international volunteering', 'student volunteering', 'community service'],
// };

const volunteerOpportunitiesData: VolunteerOpportunity[] = [
  {
    id: 'aiesec-giza',
    name: 'Global Classroom Teacher (AIESEC Giza)',
    organization: 'AIESEC in Giza (Arkan Future College)',
    description: 'Contribute to SDG #4 (Quality Education) by helping youth achieve literacy and numeracy.',
    eligibility: 'English proficiency required. Open to youth aged 18-30 (general AIESEC criteria).',
    websiteUrl: 'https://aiesec.org/global-volunteer', // Example, use specific link if available
    icon: Users,
    category: "Education",
    location: 'Egypt',
    duration: "6 weeks",
    cost: "Approx. 790.16 USD (food & accommodation often provided/subsidized)",
    sdgFocus: "SDG #4: Quality Education"
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
    cost: "From 319 € per week (includes housing, food, Wi-Fi)"
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
    cost: "From 319 € per week (includes housing, food, Wi-Fi)"
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
    cost: "Program fee (e.g. ~785 USD) + travel. Food/accommodation often included."
  },
];

const locationOptions: { value: LocationFilter; label: string }[] = [
  { value: 'All', label: 'All Locations' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
];


export default function VolunteerPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>('All');
  const [filteredOpportunities, setFilteredOpportunities] = useState<VolunteerOpportunity[]>(volunteerOpportunitiesData);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedLocation === 'All') {
      setFilteredOpportunities(volunteerOpportunitiesData);
    } else {
      setFilteredOpportunities(
        volunteerOpportunitiesData.filter((op) => op.location === selectedLocation)
      );
    }
  }, [selectedLocation]);

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

      {filteredOpportunities.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {opportunity.icon ? <opportunity.icon className="h-8 w-8 text-accent" /> : <HeartHandshake className="h-8 w-8 text-accent" />}
                  <CardTitle className="text-2xl font-headline">{opportunity.name}</CardTitle>
                </div>
                 <div className="flex flex-wrap gap-2 text-sm">
                    {opportunity.category && <p className="text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{opportunity.category}</p>}
                     <p className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-full inline-block">{opportunity.location}</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground pt-1">{opportunity.organization}</p>
                <CardDescription className="pt-2 text-base">{opportunity.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <Image 
                  src={`https://placehold.co/600x300.png?text=${encodeURIComponent(opportunity.name)}`}
                  alt={opportunity.name}
                   data-ai-hint={opportunity.location === 'Egypt' ? "Egypt community" : "global impact"}
                  width={600}
                  height={300}
                  className="rounded-md object-cover aspect-[2/1] mb-4"
                />
                {opportunity.eligibility && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Eligibility:</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.eligibility}</p>
                  </div>
                )}
                {opportunity.duration && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Duration:</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.duration}</p>
                  </div>
                )}
                {opportunity.cost && (
                   <div>
                    <h3 className="font-semibold text-md mb-1">Cost:</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.cost}</p>
                  </div>
                )}
                {opportunity.sdgFocus && (
                   <div>
                    <h3 className="font-semibold text-md mb-1">SDG Focus:</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.sdgFocus}</p>
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
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-8">No volunteer opportunities found matching your criteria. Try broadening your search.</p>
      )}
      <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          This is a selection of opportunities. Many more exist! Always verify details and application procedures on the official program websites.
        </p>
      </div>
    </div>
  );
}
