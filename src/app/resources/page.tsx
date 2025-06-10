
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Test Preparation Resources',
  description: 'Find resources for SAT, IELTS, and TOEFL exams to help you prepare effectively for your tests and manage your study journey.',
  keywords: ['SAT resources', 'IELTS resources', 'TOEFL resources', 'test preparation', 'study materials', 'exam prep'],
};

export default function ResourcesPage() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Test Preparation Resources</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A curated list of official and popular resources to help you excel in your SAT, IELTS, and TOEFL exams.
        </p>
      </div>

      {/* SAT Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">For the SAT (Scholastic Assessment Test)</CardTitle>
          </div>
          <CardDescription>
            The SAT tests reading, writing and language, and math. It&apos;s primarily used for college admissions in the United States.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official SAT Practice:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Khan Academy Official SAT Practice:</strong> This is hands-down the best free resource. It&apos;s developed in partnership with the College Board (creators of the SAT) and offers personalized practice, full-length practice tests, video lessons, and tips.
              </li>
              <li>
                <strong>The College Board Website:</strong> Provides free official full-length practice tests, daily practice questions, and detailed information about the test structure and content.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official Study Guides (Paperback):</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>&quot;The Official SAT Study Guide&quot; by College Board:</strong> Contains multiple full-length practice tests and detailed explanations directly from the test makers. Essential for understanding the test format and question types.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Popular Prep Books:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Barron&apos;s SAT:</strong> Known for challenging practice questions and comprehensive content review.</li>
              <li><strong>Kaplan SAT Prep Plus:</strong> Offers a good balance of content review, strategies, and practice tests.</li>
              <li><strong>Princeton Review SAT Premium Prep:</strong> Focuses on test-taking strategies and content drills.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* IELTS Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">For the IELTS (International English Language Testing System)</CardTitle>
          </div>
          <CardDescription>
            IELTS is an English language proficiency test for study, work, and migration, accepted globally. It has Academic and General Training versions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official IELTS Practice:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>British Council IELTS Website:</strong> Offers free practice tests, preparation materials, and tips directly from one of the co-creators of the test.
              </li>
              <li>
                <strong>IDP IELTS Website:</strong> Another co-creator, also provides free practice tests, sample questions, and preparation resources.
              </li>
              <li>
                <strong>Cambridge English (by Cambridge University Press & Assessment):</strong> Publishes official IELTS preparation books.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official Study Guides (Paperback/Digital):</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>&quot;Cambridge IELTS&quot; series (Books 1-18+):</strong> These are considered the gold standard. Each book contains four authentic past papers for the Academic module and two for the General Training module, plus full audio for listening tests. Absolutely essential.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Online Platforms & Courses:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>IELTS Liz:</strong> A popular website offering free lessons, tips, and practice exercises for all sections.</li>
              <li>
                <strong>E2 Test Prep:</strong> Offers comprehensive online courses, live classes, and personalized feedback for a fee, but often has free trial content.
              </li>
              <li>
                <strong>GregMat+ (for Writing/Speaking strategies):</strong> While primarily for GRE/GMAT, Greg&apos;s teaching style for verbal sections can be very helpful for IELTS writing and speaking strategies.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* TOEFL Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-primary" /> {/* Re-using Globe icon, consider a more specific one if available */}
            <CardTitle className="text-2xl font-headline">For the TOEFL (Test of English as a Foreign Language)</CardTitle>
          </div>
          <CardDescription>
            TOEFL is another widely accepted English language proficiency test, predominantly for academic settings, particularly in the United States.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official TOEFL Practice:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>ETS (Educational Testing Service) Official TOEFL Website:</strong> As the test creator, ETS provides free practice tests, sample questions, and detailed information about the test structure.
              </li>
              <li>
                <strong>TOEFL iBT Free Practice Test:</strong> Available directly on the ETS website.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Official Study Guides (Paperback/Digital):</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>&quot;The Official Guide to the TOEFL iBT Test&quot; by ETS:</strong> Contains full-length practice tests, explanations, and strategies from the test maker. A must-have.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Online Platforms & Courses:</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Magoosh TOEFL Prep:</strong> Offers video lessons, practice questions, full-length tests, and score prediction. Highly regarded for its comprehensive approach. (Paid, but good value).
              </li>
              <li><strong>Kaplan TOEFL iBT Prep Plus:</strong> Another popular option with content review and practice.</li>
              <li><strong>BestMyTest:</strong> Provides practice tests, lessons, and often has a good free trial.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* General Advice Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8 text-accent" />
            <CardTitle className="text-2xl font-headline">General Advice for All Exams</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong>Start with Official Materials:</strong> Always begin with resources from the test creators (College Board for SAT, British Council/IDP/Cambridge for IELTS, ETS for TOEFL) to understand the actual test format and question types.
            </li>
            <li>
              <strong>Take Practice Tests:</strong> Regularly take full-length practice tests under timed conditions to build stamina and identify weak areas.
            </li>
            <li>
              <strong>Focus on Weaknesses:</strong> Analyze your practice test results to pinpoint areas where you need the most improvement.
            </li>
            <li>
              <strong>Review Explanations:</strong> Don&apos;t just get the answer right or wrong; understand why it&apos;s right or wrong.
            </li>
            <li><strong>Develop a Study Schedule:</strong> Consistency is key.</li>
            <li><strong>Utilize Free Resources:</strong> Many websites and YouTube channels offer excellent free lessons and tips.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
