
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BookCheck, Award as AwardIcon, Volleyball } from 'lucide-react';


export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">My Journey: From Giza to Global Aspirations</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Learn more about the story and motivation behind LISGE.
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md border-4 border-primary">
              <Image
                src="https://placehold.co/200x200.png"
                alt="My Personal Photo"
                data-ai-hint="person portrait student"
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl font-headline text-primary">Founder of LISGE</CardTitle>
              <p className="text-muted-foreground mt-1">Passionate about empowering students through shared knowledge.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            Hello! I'm the founder of LISGE (Local and International Scholars' Guide to Excellence), and my journey has been one of dedication, learning, and a desire to give back. Growing up in Giza, Egypt, I always strived for excellence, both academically and in my extracurricular pursuits.
          </p>
          <p>
            Academically, I have consistently been a top student, driven by a thirst for knowledge and a passion for challenging myself. This drive led me to participate in programs like DECI (Distinguished Egyptian Cambridge Innovators), where I reached Level 2, honing my critical thinking and innovation skills. I also had the privilege of attending the KOSEN Summer Seminar in Japan, an experience that broadened my horizons and exposed me to different educational approaches and cultures.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="flex items-start p-4 bg-accent/10 rounded-lg">
              <Trophy className="h-8 w-8 text-accent mr-4 shrink-0" />
              <div>
                <h3 className="font-semibold text-xl font-headline">Academic Excellence</h3>
                <p className="text-muted-foreground text-base">Consistently a top student, driven by a passion for learning and problem-solving.</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-accent/10 rounded-lg">
              <BookCheck className="h-8 w-8 text-accent mr-4 shrink-0" />
              <div>
                <h3 className="font-semibold text-xl font-headline">DECI Level 2 & KOSEN</h3>
                <p className="text-muted-foreground text-base">Gained invaluable skills in innovation and global perspectives through these prestigious programs.</p>
              </div>
            </div>
             <div className="flex items-start p-4 bg-accent/10 rounded-lg">
              <Volleyball className="h-8 w-8 text-accent mr-4 shrink-0" />
              <div>
                <h3 className="font-semibold text-xl font-headline">Al Ahly Volleyball Player</h3>
                <p className="text-muted-foreground text-base">Developed discipline, teamwork, and leadership as a volleyball player for Al Ahly SC.</p>
              </div>
            </div>
             <div className="flex items-start p-4 bg-accent/10 rounded-lg">
              <AwardIcon className="h-8 w-8 text-accent mr-4 shrink-0" />
              <div>
                <h3 className="font-semibold text-xl font-headline">Motivation for LISGE</h3>
                <p className="text-muted-foreground text-base">Inspired to create a platform to help other students navigate their paths to success.</p>
              </div>
            </div>
          </div>

          <p>
            Beyond academics, I was a dedicated volleyball player for Al Ahly Sporting Club, one of Egypt's most prestigious sports clubs. This experience taught me the importance of discipline, teamwork, resilience, and leadership – qualities that are invaluable in any field.
          </p>
          <p>
            My motivation for creating LISGE stems from my own experiences. I understand the challenges and opportunities that young students in Egypt face. I believe that with the right information and guidance, every student can achieve their dreams of leadership, secure international scholarships, and gain enriching global experiences. LISGE is my way of sharing what I've learned and creating a supportive community for ambitious students.
          </p>
          <p>
            Thank you for visiting, and I hope LISGE becomes a valuable resource on your journey!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
