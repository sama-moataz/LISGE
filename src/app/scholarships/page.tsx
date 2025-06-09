
import type { Scholarship } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Award, BookOpen, Users, Globe, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const scholarships: Scholarship[] = [
  {
    id: 'uwc',
    name: 'UWC (United World Colleges)',
    description: 'A global education movement that makes education a force to unite people, nations and cultures for peace and a sustainable future.',
    eligibility: 'Typically ages 16-19, varies by national committee.',
    websiteUrl: 'https://www.uwc.org/',
    icon: Globe,
    category: "International Baccalaureate"
  },
  {
    id: 'rise',
    name: 'Rise for the World',
    description: 'Rise is a program that finds promising young people and provides them with opportunities that allow them to work together to serve others over their lifetimes.',
    eligibility: 'Ages 15-17 at time of application.',
    websiteUrl: 'https://www.risefortheworld.org/',
    icon: Award,
    category: "Global Talent Program"
  },
  {
    id: 'yes',
    name: 'Kennedy-Lugar Youth Exchange and Study (YES) Program',
    description: 'Provides scholarships for high school students from countries with significant Muslim populations to spend up to one academic year in the United States.',
    eligibility: 'High school students, age requirements vary by country.',
    websiteUrl: 'https://www.yesprograms.org/',
    icon: Users,
    category: "Cultural Exchange"
  },
  {
    id: 'aspire',
    name: 'Aspire Institute Leaders Program',
    description: 'A fully-funded leadership development program for first-generation college students and recent graduates from underserved backgrounds globally.',
    eligibility: 'First-generation college students/recent grads, 18-29 years old.',
    websiteUrl: 'https://www.aspireleaders.org/',
    icon: BookOpen,
    category: "Leadership Development"
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Unlock Your Potential: Top Scholarships</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore these renowned scholarship programs designed for international students.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {scholarship.icon && <scholarship.icon className="h-8 w-8 text-accent" />}
                <CardTitle className="text-2xl font-headline">{scholarship.name}</CardTitle>
              </div>
              {scholarship.category && <p className="text-sm text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{scholarship.category}</p>}
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
    </div>
  );
}
