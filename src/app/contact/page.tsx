
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, User, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact LISGE for Personalized Guidance',
  description: 'Reach out to LISGE for advice on scholarships, study strategies, summer programs, or general academic path inquiries. Use the form below to send a message.',
  keywords: ['contact LISGE', 'student guidance form', 'scholarship advice', 'study help Egypt'],
};

export default function ContactPage() {
  const formspreeEndpoint = "https://formspree.io/f/mrbkpjnp";

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Get in Touch</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have questions or need guidance? Fill out the form below, and I'll get back to you as soon as possible.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Mail className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">Send a Message</CardTitle>
          <CardDescription>
            I'm here to help you navigate your options and make informed decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formspreeEndpoint} method="POST" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" /> Name
              </Label>
              <Input type="text" name="name" id="name" placeholder="Your Full Name" required className="bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
              </Label>
              <Input type="email" name="email" id="email" placeholder="your.email@example.com" required className="bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" /> Message
              </Label>
              <Textarea name="message" id="message" rows={5} placeholder="Your questions, inquiries, or how I can help..." required className="bg-background" />
            </div>

            <Button type="submit" size="lg" className="w-full group">
              Send Message <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground text-sm p-4 bg-secondary/50 rounded-lg">
        <p>Your message will be sent via Formspree. Please allow some time for a response.</p>
        <p>If you encounter any issues with the form, you can also reach out directly to <a href="mailto:samamoataz73@gmail.com" className="text-primary hover:underline">samamoataz73@gmail.com</a>.</p>
      </div>
    </div>
  );
}
