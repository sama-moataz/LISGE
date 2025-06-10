
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckSquare, Target, Users, Calendar } from 'lucide-react'; // Using generic icons

export const metadata: Metadata = {
  title: 'SAT/PSAT Study Plan Guide',
  description: 'Learn how to create an effective study plan for the SAT or PSAT. Set goals, understand your strengths, and choose study activities.',
  keywords: ['SAT study plan', 'PSAT study plan', 'test preparation', 'study goals', 'College Board', 'Khan Academy'],
};

export default function StudyTipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Creating Your SAT/PSAT Study Plan</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          So you&apos;ve got an SAT or PSAT-related assessment coming up, and it&apos;s time to start studying. What do you do now? We recommend creating a study plan to keep you on track. This page will give you the tools to create one of your own.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Target className="h-7 w-7 text-primary" />
            Set Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">If you&apos;re just getting started:</h3>
            <p className="mb-4">
              The most important thing you can do is understand your own strengths and challenge areas. Knowing this information will help you identify the areas where you could use the most skill review. There are a few ways to check your knowledge:
            </p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong>Bluebook™ practice test:</strong> This is the best and most accurate way to ensure you&apos;re measuring your knowledge of the skills on the actual test. It&apos;s also a valuable introduction to the Bluebook testing app, which you&apos;ll use both for practice tests and on test day. Plus, when you practice in Bluebook, your practice scores will be available in My Practice, where you&apos;ll find helpful information about your performance on different content areas so you can target your practice more effectively.
              </li>
              <li>
                <strong>Khan Academy® diagnostic:</strong> For a skill check outside of Bluebook, take Khan Academy&apos;s SAT Course Challenge for both the Reading and Writing Test and the Math Test. These challenges will give you a snapshot of your performance on different content areas, which you can use to decide what you want to study.
              </li>
              <li>
                <strong>In-school test review:</strong> You may know the areas where you need to study just from the tests you&apos;ve already taken in school. Review your old tests from your math classes and your English or language arts classes and see if you notice any skill gaps you can boost. If you&apos;re feeling stuck, check out our page with more information about what different questions look like on the test to help you identify the skills you need to work on. This method will help you start studying right away so you can be more prepared when you take the diagnostic or practice test.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">If you&apos;ve already taken a practice test or an assessment in the SAT Suite:</h3>
            <p className="mb-4">
              You&apos;re off to a great start! Your results from a previous practice test or assessment are the most helpful tool to create your study plan. Keep your practice scores in My Practice or your official score report from your assessment handy, and check out these study activities to put your results to use:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Skill Booster</li>
              <li>Question Bank Review</li>
              <li>Khan Academy Review</li>
            </ul>
            <p className="mt-4">
              Once you feel like you&apos;ve boosted your challenge areas, take another practice test and see how you&apos;ve improved. We recommend spacing your practice tests out by at least two weeks if your study schedule allows.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-primary" />
            Choose Your Study Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            When you&apos;re creating a study plan, it&apos;s important to consider how much time you can spend studying each day. These activities will help you build a plan that works for you. This list isn&apos;t meant to set a particular order for your practice, so feel free to pick and choose the activities that fit your schedule.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
