
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lightbulb, Briefcase, HeartHandshake, School2, Globe2, Library } from "lucide-react"; // Added Library

export const metadata: Metadata = {
  title: 'Home | LISGE - Your Guide to Academic Excellence',
  description: "Welcome to LISGE! We empower Egyptian students with resources on scholarships, study tips, summer programs, exchange programs, volunteer work, pre-college courses, and test preparation. Start your journey to global success.",
};

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
        {/* Background image div removed from here */}
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary-foreground bg-primary/80 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
            LISGE
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-foreground/90 bg-background/70 dark:bg-black/50 backdrop-blur-sm py-3 px-4 rounded-md">
            Explore different scholarships, exchange programs, summer programs, and pre-college programs.
          </p>
          <div className="space-x-0 space-y-4 sm:space-x-4 sm:space-y-0">
            <Button asChild size="lg" className="group">
              <Link href="/scholarships">
                Explore Scholarships <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/tips">
                Get Study Tips <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Sections Preview */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <GraduationCap className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Scholarships</CardTitle>
            <CardDescription>Discover life-changing scholarship opportunities to fund your education.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/scholarships">
                View Scholarships <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Globe2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Exchange Programs</CardTitle>
            <CardDescription>Embark on cultural and academic exchange journeys around the world.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/exchange-programs">
                Explore Exchanges <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Lightbulb className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Study Tips</CardTitle>
            <CardDescription>Equip yourself with smart strategies and insights for academic excellence.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/tips">
                Learn Study Tips <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Briefcase className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Summer Programs</CardTitle>
            <CardDescription>Explore enriching summer programs to broaden your horizons.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/programs">
                Find Programs <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <HeartHandshake className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Volunteer Opportunities</CardTitle>
            <CardDescription>Find meaningful ways to contribute to your community and gain experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/volunteer">
                Discover Volunteering <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <School2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Pre-College Courses</CardTitle>
            <CardDescription>Prepare for university with introductory courses and academic experiences.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/pre-college">
                Explore Pre-College <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <Library className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Test Prep Resources</CardTitle>
            <CardDescription>Find materials and guidance for SAT, IELTS, TOEFL, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/resources">
                View Resources <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
