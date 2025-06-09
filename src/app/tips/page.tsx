
import type { StudyTip } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, BookOpenText, Clock, MessageSquareText, Target, Search, Users, CheckSquare, Languages, Briefcase } from 'lucide-react';

const initialStudyTips: StudyTip[] = [
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

const expertRecommendations: StudyTip[] = [
  {
    id: 'proactive-research',
    title: 'Proactive Research and Application',
    content: 'Given the competitive nature and varying deadlines of scholarships and programs, begin your research early. Regularly check official websites of institutions (e.g., GUC, AUC, Nile University), governmental bodies (e.g., U.S. Embassy in Egypt, Ministry of Higher Education), and international platforms (e.g., Bachelorsportal.com, Volunteer World, AIESEC) for the most current information.',
    icon: Search,
  },
  {
    id: 'holistic-development',
    title: 'Focus on Holistic Development',
    content: 'Beyond academic grades, cultivate a strong profile demonstrating leadership potential, extracurricular involvement, community service, and English language proficiency. Many scholarships and programs emphasize these qualities, recognizing their importance for future success.',
    icon: Users,
  },
  {
    id: 'leverage-programs',
    title: 'Leverage Pre-College and Summer Programs',
    content: 'Participate in pre-college courses or summer academic programs to gain early exposure to university-level studies and specialized fields. These experiences can clarify academic interests, enhance skills, and strengthen university applications.',
    icon: Briefcase,
  },
  {
    id: 'strategic-volunteering',
    title: 'Explore Volunteerism Strategically',
    content: 'Engage with reputable volunteer organizations, both locally and internationally, that align with personal interests and career aspirations. Volunteering offers invaluable practical experience, networking opportunities, and a chance to contribute meaningfully to society.',
    icon: Target,
  },
  {
    id: 'english-proficiency',
    title: 'Prioritize English Language Proficiency',
    content: 'A strong command of English is a recurring requirement for many international scholarships and exchange programs, as well as a significant asset for local opportunities. Invest in improving English language skills through dedicated training or immersive experiences.',
    icon: Languages,
  },
  {
    id: 'comprehensive-support',
    title: 'Seek Comprehensive Support',
    content: 'Utilize the resources offered by advising centers (e.g., EducationUSA via AMIDEAST), program coordinators (e.g., AIESEC, CIEE), and university admissions offices. These resources can provide guidance on eligibility, application processes, visa requirements, and financial assistance.',
    icon: CheckSquare,
  },
  {
    id: 'long-term-pathways',
    title: 'Consider Long-Term Academic Pathways',
    content: 'For those aspiring to study abroad, especially in countries like Germany where undergraduate scholarships may be limited, consider short-term summer courses as a strategic first step. These can build a profile and enhance eligibility for future graduate-level opportunities.',
    icon: Lightbulb,
  },
];

const allStudyTips = [...initialStudyTips, ...expertRecommendations];

export default function StudyTipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Smart Strategies for Academic Success</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gain valuable insights and practical tips to excel in your studies and applications.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {allStudyTips.map((tip) => (
          <AccordionItem value={tip.id} key={tip.id} className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                {tip.icon ? <tip.icon className="h-6 w-6 text-primary" /> : <Lightbulb className="h-6 w-6 text-primary" />}
                <span className="font-headline">{tip.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-base text-muted-foreground">
              {typeof tip.content === 'string' ? <p>{tip.content}</p> : tip.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
