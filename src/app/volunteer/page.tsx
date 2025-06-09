
import type { Metadata } from 'next';
import type { VolunteerOpportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { HeartHandshake, Globe, MapPin, ExternalLink, Building, Users, Leaf } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Volunteer Opportunities for Students',
  description: 'Find impactful volunteer programs in Egypt and worldwide with LISGE. Explore opportunities with AIESEC, Volunteer World, and more to make a difference.',
  keywords: ['volunteer opportunities', 'AIESEC Egypt', 'Volunteer World Egypt', 'international volunteering', 'student volunteering', 'community service'],
};

const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: 'aiesec-giza',
    name: 'Global Classroom Teacher',
    organization: 'AIESEC in Giza (Arkan Future College)',
    description: 'Contribute to SDG #4 (Quality Education) by helping youth achieve literacy and numeracy. Activities include quizzes, buddy systems, creative math, book clubs, and teaching basic vocabulary in a new language.',
    eligibility: 'English proficiency required. Open to youth aged 18-30 (general AIESEC criteria).',
    websiteUrl: 'https://aiesec.org/global-volunteer',
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
    description: 'Help restore women-run food gardens through daily gardening activities, empowering female farmers in the Bedouin community of Nuweiba.',
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
    description: 'Work to restore degraded landscapes in South Sinai through regenerative agriculture practices, aiming to correct past environmental mistakes.',
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
    name: 'Global Volunteer Program (Various Fields)',
    organization: 'AIESEC International',
    description: 'Cross-cultural experiences for youth (18-30) focusing on UN SDGs. Projects in education, environment, etc., in numerous countries. Develop leadership skills and make a global impact.',
    eligibility: 'Aged 18-30.',
    websiteUrl: 'https://aiesec.org/global-volunteer',
    icon: Globe,
    category: "Various SDGs",
    location: 'International',
    duration: "6-8 weeks",
    cost: "Program fee (e.g. ~785 USD) + travel. Food/accommodation often included."
  },
];

export default function VolunteerPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Make a Difference: Volunteer Opportunities</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore impactful volunteer programs in Egypt and around the world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {volunteerOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {opportunity.icon ? <opportunity.icon className="h-8 w-8 text-accent" /> : <HeartHandshake className="h-8 w-8 text-accent" />}
                <CardTitle className="text-2xl font-headline">{opportunity.name}</CardTitle>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{opportunity.organization}</p>
              {opportunity.category && <p className="text-sm text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block mt-1">{opportunity.category} - {opportunity.location}</p>}
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
      <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          This is a selection of opportunities. Many more exist! Always verify details and application procedures on the official program websites.
        </p>
      </div>
    </div>
  );
}
