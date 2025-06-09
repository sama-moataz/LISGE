
import type { Metadata } from 'next';
import type { SummerProgram } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plane, Users, MapPin, Code2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Summer Programs for Students',
  description: 'Explore exciting summer programs like EducationUSA CCC, Girls Who Code, Brown Pre-College, and Yale Young Global Scholars. Find unique learning and cultural experiences with LISGE.',
  keywords: ['summer programs', 'EducationUSA CCC', 'Girls Who Code', 'Brown Pre-College', 'Yale Young Global Scholars', 'student summer camps', 'academic summer programs'],
};

const summerPrograms: SummerProgram[] = [
  {
    id: 'ccc',
    name: 'EducationUSA Competitive College Club (CCC)',
    description: 'A program designed to assist high-achieving Egyptian students in applying to U.S. colleges and universities. Provides guidance, workshops, and resources.',
    eligibility: 'High school students, typically in grades 10-11.',
    websiteUrl: 'https://educationusa.state.gov/find-advising-center/egypt-cairo',
    icon: Plane,
    category: "College Prep"
  },
  {
    id: 'gwc',
    name: 'Girls Who Code Summer Immersion Program',
    description: 'A free 2-week virtual program for high school girls and non-binary students to learn coding and get exposure to tech jobs.',
    eligibility: 'Girls and non-binary students in grades 9-12 (US-focused, but virtual access may be possible).',
    websiteUrl: 'https://girlswhocode.com/programs/summer-immersion-program',
    icon: Code2,
    category: "Tech & Coding"
  },
  {
    id: 'brown-precollege',
    name: 'Brown Pre-College Programs',
    description: 'Offers a wide range of summer programs for high school students to experience college-level academics at Brown University.',
    eligibility: 'High school students, specific grade levels vary by program.',
    websiteUrl: 'https://precollege.brown.edu/',
    icon: MapPin,
    category: "University Experience"
  },
  {
    id: 'yaleygs',
    name: 'Yale Young Global Scholars (YYGS)',
    description: 'An academic enrichment and leadership development program that brings together outstanding high school students from around the world for two-week sessions on Yale’s campus or online.',
    eligibility: 'Typically ages 16-17, current sophomores or juniors in high school.',
    websiteUrl: 'https://globalscholars.yale.edu/',
    icon: Users,
    category: "Global Leadership"
  },
];

export default function SummerProgramsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Experience the World: Summer Programs Abroad</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover exciting summer programs that offer unique learning and cultural experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {summerPrograms.map((program) => (
          <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
               <div className="flex items-center gap-3 mb-2">
                {program.icon && <program.icon className="h-8 w-8 text-accent" />}
                <CardTitle className="text-2xl font-headline">{program.name}</CardTitle>
              </div>
              {program.category && <p className="text-sm text-accent-foreground bg-accent/20 px-2 py-1 rounded-full inline-block">{program.category}</p>}
              <CardDescription className="pt-2 text-base">{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Image 
                src={`https://placehold.co/600x300.png?text=${encodeURIComponent(program.name)}`}
                alt={program.name}
                data-ai-hint="students summer"
                width={600}
                height={300}
                className="rounded-md object-cover aspect-[2/1] mb-4"
              />
              <div>
                <h3 className="font-semibold text-md mb-1">Eligibility:</h3>
                <p className="text-sm text-muted-foreground">{program.eligibility}</p>
              </div>
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
    </div>
  );
}
