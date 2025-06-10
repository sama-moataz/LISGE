
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
    default: 'LISGE: Global Scholars’ Hub', // Updated
    template: '%s | LISGE',
  },
  description: "LISGE helps students discover scholarships, tips, and resources to excel locally and internationally.", // Updated
  keywords: ['scholarships', 'student guide', 'Egypt', 'international studies', 'LISGE', 'global scholars'], // Updated
  authors: [{ name: 'LISGE Team' }], // Using Next.js 'authors' field
  openGraph: {
    title: 'LISGE: Global Scholars’ Hub', // Updated
    description: "Find top scholarships, study tips, and guidance tailored for local and international students.", // Updated
    url: 'https://lisge.vercel.app', // Updated
    siteName: 'LISGE',
    images: [ // Added image based on prompt
      {
        url: 'https://lisge.vercel.app/preview.jpg',
        width: 1200, // Example width
        height: 630, // Example height
        alt: 'LISGE: Global Scholars’ Hub Preview',
      },
    ],
    locale: 'en_US',
    type: 'website', // Updated
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LISGE: Global Scholars’ Hub', // Updated
    description: "Empowering students to reach global excellence.", // Updated
    images: ['https://lisge.vercel.app/preview.jpg'], // Added image based on prompt
    // site: '@yourtwitterhandle', // Optional: Add if you have a Twitter handle
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
  verification: {
    google: 'Q1TYmGvh5VJruZjBNl-IIRHU4CHxKexvRmApp3jaNp0',
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
