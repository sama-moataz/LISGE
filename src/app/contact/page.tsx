
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, MessageCircle, HelpCircle, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const recipientEmail = "your_email@example.com"; // Replace with actual email
  const emailSubject = "Inquiry from LISGE User";
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Get Personalized Guidance</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Reach out to LISGE for advice and support on your academic and global journey.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Mail className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">Contact LISGE</CardTitle>
          <CardDescription>
            I'm here to help you navigate your options and make informed decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg">
            If you have questions about scholarships, study strategies, summer programs, or need general advice on your academic path, feel free to reach out.
          </p>
          
          <div className="p-6 bg-accent/10 rounded-lg">
            <h3 className="text-xl font-semibold text-accent-foreground mb-3 flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6"/>
              How I Can Help:
            </h3>
            <ul className="list-disc list-inside text-left space-y-1 text-muted-foreground mx-auto max-w-md">
              <li>Providing insights on specific scholarship applications.</li>
              <li>Sharing effective study techniques and resources.</li>
              <li>Guiding you through the process of finding and applying for summer programs.</li>
              <li>Offering general mentorship based on my experiences.</li>
            </ul>
          </div>

          <p className="text-lg">
            The best way to get in touch is via email. Please be as specific as possible with your questions so I can provide the most relevant advice.
          </p>

          <Button asChild size="lg" className="group w-full sm:w-auto">
            <Link href={mailtoLink}>
              <MessageCircle className="mr-2 h-5 w-5" /> Send an Email <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            (This will open your default email client)
          </p>
          <p className="text-sm text-muted-foreground pt-4">
            Alternatively, you could consider setting up a Google Form for inquiries if email volume becomes high. For now, direct email is preferred.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
