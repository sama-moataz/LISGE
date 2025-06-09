
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lightbulb, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0">
           <Image
            src="https://placehold.co/1200x400.png"
            alt="Global experiences"
            data-ai-hint="students global education"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary-foreground bg-primary/80 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
            LISGE: Your Gateway to <br className="sm:hidden" /> Leadership, Scholarships, and Global Experiences
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-foreground/90">
            Welcome to LISGE Hub! We are dedicated to empowering students, especially teenagers in Egypt, by providing comprehensive resources on scholarships, study strategies, and transformative summer programs. Explore your potential and embark on your journey to global success.
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
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <GraduationCap className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl">Scholarships</CardTitle>
            <CardDescription>Discover life-changing scholarship opportunities to fund your international education.</CardDescription>
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
            <CardDescription>Explore enriching summer programs abroad to broaden your horizons.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-primary group">
              <Link href="/programs">
                Find Programs <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
