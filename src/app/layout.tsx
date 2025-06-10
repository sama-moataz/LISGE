
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: 'LISGE - Local and International Scholars\' Guide to Excellence',
    template: '%s | LISGE',
  },
  description: "LISGE (Local and International Scholars' Guide to Excellence) empowers Egyptian students with resources on scholarships, study tips, summer programs, volunteer opportunities, and pre-college courses.",
  keywords: ['LISGE', 'scholarships Egypt', 'study abroad Egypt', 'summer programs Egypt', 'volunteer Egypt', 'pre-college Egypt', 'student guidance Egypt'],
  openGraph: {
    title: 'LISGE - Local and International Scholars\' Guide to Excellence',
    description: "Empowering Egyptian students with resources for academic and personal growth.",
    url: 'https://[YOUR_DOMAIN_HERE]', 
    siteName: 'LISGE',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LISGE - Local and International Scholars\' Guide to Excellence',
    description: "Empowering Egyptian students with resources for academic and personal growth.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
          <CookieConsentBanner />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
