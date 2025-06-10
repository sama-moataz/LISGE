
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckSquare, Target, Users, Calendar, Clock, Brain, Edit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Effective Study Tips for Academic Success',
  description: 'Discover smart strategies and insights to enhance your learning, manage your time effectively, and achieve academic excellence.',
  keywords: ['study tips', 'learning strategies', 'time management', 'academic success', 'exam preparation'],
};

const studyTips = [
  {
    id: '1',
    title: 'Create a Study Schedule',
    content: 'Plan your study sessions in advance. Allocate specific time slots for different subjects or topics. A consistent schedule helps build a routine and ensures you cover all necessary material. Use a planner or digital calendar to keep track.',
    icon: Calendar,
  },
  {
    id: '2',
    title: 'Set Clear Goals',
    content: 'Define what you want to achieve in each study session. Setting specific, measurable, achievable, relevant, and time-bound (SMART) goals can help you stay focused and motivated. Break down large tasks into smaller, manageable ones.',
    icon: Target,
  },
  {
    id: '3',
    title: 'Find Your Optimal Study Environment',
    content: 'Identify a quiet, comfortable, and distraction-free space where you can concentrate. This could be a library, a dedicated room at home, or a quiet coffee shop. Ensure you have good lighting and all necessary materials.',
    icon: Edit, // Using Edit as a placeholder for environment/setup
  },
  {
    id: '4',
    title: 'Practice Active Learning',
    content: 'Engage actively with the material instead of passively reading. This can include summarizing concepts in your own words, teaching the material to someone else, working through practice problems, or creating flashcards.',
    icon: Brain,
  },
  {
    id: '5',
    title: 'Take Regular Breaks',
    content: 'Studying for long hours without breaks can lead to burnout and reduced productivity. Use techniques like the Pomodoro Technique (e.g., 25 minutes of study followed by a 5-minute break) to stay fresh and maintain focus.',
    icon: Clock,
  },
  {
    id: '6',
    title: 'Utilize Different Study Methods',
    content: 'Experiment with various study techniques to find what works best for you. This could include visual aids, mnemonic devices, concept mapping, or group study. Tailor your methods to the subject matter.',
    icon: Lightbulb,
  },
  {
    id: '7',
    title: 'Test Yourself Regularly',
    content: 'Quiz yourself on the material frequently. This helps reinforce learning and identify areas where you need more review. Use past papers, create your own questions, or use online quizzing tools.',
    icon: CheckSquare,
  },
  {
    id: '8',
    title: 'Collaborate with Peers',
    content: 'Studying with classmates can be beneficial. Discussing concepts, solving problems together, and explaining ideas to others can deepen your understanding and provide different perspectives. Ensure group study sessions stay focused.',
    icon: Users,
  },
];

export default function StudyTipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Effective Study Tips for Academic Success</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Equip yourself with smart strategies and insights for academic excellence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyTips.map((tip) => (
          <Card key={tip.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {tip.icon ? <tip.icon className="h-8 w-8 text-accent" /> : <Lightbulb className="h-8 w-8 text-accent" />}
                <CardTitle className="text-xl font-headline leading-tight">{tip.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{tip.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="text-center mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="text-muted-foreground">
          Remember, consistency and finding what works best for you are key to successful studying!
        </p>
      </div>
    </div>
  );
}
