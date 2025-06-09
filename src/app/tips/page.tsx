
import type { StudyTip } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, BookOpenText, Clock, MessageSquareText, BrainCircuit, CheckCircle } from 'lucide-react';

const studyTips: StudyTip[] = [
  {
    id: 'brag-file',
    title: 'Building Your Academic Brag File',
    content: 'Your academic brag file is a collection of all your achievements, awards, certificates, and notable projects. Keep it updated! This will be invaluable when applying for scholarships, programs, or universities. Include transcripts, recommendation letters (or requests), essays you\'re proud of, and records of extracurricular activities.',
    icon: BookOpenText,
  },
  {
    id: 'time-management',
    title: 'Mastering Time Management',
    content: 'Effective time management is crucial for academic success. Use tools like calendars and to-do lists. Prioritize tasks using methods like the Eisenhower Matrix (Urgent/Important). Break down large assignments into smaller, manageable steps. Don\'t forget to schedule breaks to avoid burnout.',
    icon: Clock,
  },
  {
    id: 'english-boost',
    title: 'Boosting Your English for International Tests',
    content: 'For tests like TOEFL or IELTS, consistent practice is key. Expand your vocabulary daily, practice reading academic texts, listen to English podcasts or lectures, and practice speaking and writing regularly. Consider joining study groups or finding a language partner.',
    icon: MessageSquareText,
  },
];

export default function StudyTipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Smart Strategies for Academic Success</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gain valuable insights and practical tips to excel in your studies.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {studyTips.map((tip) => (
          <AccordionItem value={tip.id} key={tip.id} className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                {tip.icon ? <tip.icon className="h-6 w-6 text-primary" /> : <Lightbulb className="h-6 w-6 text-primary" />}
                <span className="font-headline">{tip.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-base text-muted-foreground">
              {tip.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
