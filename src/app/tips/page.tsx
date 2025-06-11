
"use client";

import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckSquare, Target, Users, Calendar, Clock, Brain, Edit, Loader2, ServerCrash } from 'lucide-react';
import type { StudyTip } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { getStudyTips } from '@/lib/firestoreService';
import IconByName from '@/components/IconByName';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// export const metadata: Metadata = { // Metadata should be handled by Next.js's generateMetadata if dynamic
//   title: 'Effective Study Tips for Academic Success',
//   description: 'Discover smart strategies and insights to enhance your learning, manage your time effectively, and achieve academic excellence.',
//   keywords: ['study tips', 'learning strategies', 'time management', 'academic success', 'exam preparation'],
// };

const staticStudyTips: StudyTip[] = [
  {
    id: 'static-1',
    title: 'Create a Study Schedule',
    content: 'Plan your study sessions in advance. Allocate specific time slots for different subjects or topics. A consistent schedule helps build a routine and ensures you cover all necessary material. Use a planner or digital calendar to keep track.',
    icon: Calendar,
    dataAiHint: "planning schedule"
  },
  {
    id: 'static-2',
    title: 'Set Clear Goals',
    content: 'Define what you want to achieve in each study session. Setting specific, measurable, achievable, relevant, and time-bound (SMART) goals can help you stay focused and motivated. Break down large tasks into smaller, manageable ones.',
    icon: Target,
    dataAiHint: "goals achievement"
  },
  {
    id: 'static-3',
    title: 'Find Your Optimal Study Environment',
    content: 'Identify a quiet, comfortable, and distraction-free space where you can concentrate. This could be a library, a dedicated room at home, or a quiet coffee shop. Ensure you have good lighting and all necessary materials.',
    icon: Edit, 
    dataAiHint: "study environment"
  },
  {
    id: 'static-4',
    title: 'Practice Active Learning',
    content: 'Engage actively with the material instead of passively reading. This can include summarizing concepts in your own words, teaching the material to someone else, working through practice problems, or creating flashcards.',
    icon: Brain,
    dataAiHint: "active learning brain"
  },
  {
    id: 'static-5',
    title: 'Take Regular Breaks',
    content: 'Studying for long hours without breaks can lead to burnout and reduced productivity. Use techniques like the Pomodoro Technique (e.g., 25 minutes of study followed by a 5-minute break) to stay fresh and maintain focus.',
    icon: Clock,
    dataAiHint: "time break"
  },
  {
    id: 'static-6',
    title: 'Utilize Different Study Methods',
    content: 'Experiment with various study techniques to find what works best for you. This could include visual aids, mnemonic devices, concept mapping, or group study. Tailor your methods to the subject matter.',
    icon: Lightbulb, // Static icon
    dataAiHint: "study methods idea"
  },
  {
    id: 'static-7',
    title: 'Test Yourself Regularly',
    content: 'Quiz yourself on the material frequently. This helps reinforce learning and identify areas where you need more review. Use past papers, create your own questions, or use online quizzing tools.',
    icon: CheckSquare,
    dataAiHint: "test quiz"
  },
  {
    id: 'static-8',
    title: 'Collaborate with Peers',
    content: 'Studying with classmates can be beneficial. Discussing concepts, solving problems together, and explaining ideas to others can deepen your understanding and provide different perspectives. Ensure group study sessions stay focused.',
    icon: Users,
    dataAiHint: "group study collaboration"
  },
];

export default function StudyTipsPage() {
  const [dynamicTips, setDynamicTips] = useState<StudyTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tipsFromDb = await getStudyTips();
        setDynamicTips(tipsFromDb);
      } catch (err: any) {
        console.error("Failed to fetch dynamic study tips:", err);
        setError("Could not load additional study tips at this time. Showing defaults.");
        toast({
          title: "Loading Error",
          description: "Could not fetch latest study tips. Displaying standard tips.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTips();
  }, [toast]);

  const allTips = useMemo(() => {
    // Simple concatenation, can be refined for de-duplication or ordering if needed
    return [...staticStudyTips, ...dynamicTips];
  }, [dynamicTips]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Effective Study Tips for Academic Success</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Equip yourself with smart strategies and insights for academic excellence.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading latest tips...</p>
        </div>
      )}

      {!isLoading && error && allTips.length === staticStudyTips.length && ( 
        <div className="text-center py-6">
           <ServerCrash className="h-12 w-12 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error}</p>
        </div>
      )}
      
      {!isLoading && allTips.length === 0 && !error && (
         <p className="text-center text-muted-foreground text-lg py-8">No study tips available at the moment. Please check back later.</p>
      )}

      {allTips.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTips.map((tip) => {
            const TipIcon = tip.iconName ? IconByName : (tip.icon || Lightbulb);
            const iconProps = tip.iconName ? { name: tip.iconName } : {};
            const imageUrl = tip.imageUrl || `https://placehold.co/600x300.png?text=${encodeURIComponent(tip.title.substring(0,20))}`;
            const dataAiHint = tip.dataAiHint || tip.title.toLowerCase().split(' ').slice(0,2).join(' ');


            return (
              <Card key={tip.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <TipIcon {...iconProps} className="h-8 w-8 text-accent" fallbackIcon={Lightbulb} />
                    <CardTitle className="text-xl font-headline leading-tight">{tip.title}</CardTitle>
                  </div>
                  {tip.category && <p className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full inline-block">{tip.category}</p>}
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  {tip.imageUrl !== null && ( // Render image only if imageUrl is explicitly not null (allows empty string to be skipped for placeholders)
                     <Image
                        src={imageUrl}
                        alt={tip.title}
                        data-ai-hint={dataAiHint}
                        width={600}
                        height={300}
                        className="rounded-md object-cover aspect-[2/1] mb-3"
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/600x300.png?text=Image+Error`; }}
                      />
                  )}
                  <p className="text-muted-foreground text-sm">{typeof tip.content === 'string' ? tip.content : 'Rich content, view details.'}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
       <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          Remember, consistency and finding what works best for you are key to successful studying!
        </p>
      </div>
    </div>
  );
}

// Example for generateMetadata if you need dynamic metadata
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: 'Effective Study Tips for Academic Success | LISGE',
//     description: 'Discover smart strategies and insights to enhance your learning, manage your time effectively, and achieve academic excellence.',
//   };
// }
