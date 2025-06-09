import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

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
    url: 'https://[YOUR_DOMAIN_HERE]', // Replace with your actual domain
    siteName: 'LISGE',
    // images: [ // Add a default OG image if you have one
    //   {
    //     url: 'https://[YOUR_DOMAIN_HERE]/og-image.png',
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LISGE - Local and International Scholars\' Guide to Excellence',
    description: "Empowering Egyptian students with resources for academic and personal growth.",
    // site: '@yourtwitterhandle', // Replace with your Twitter handle if you have one
    // creator: '@yourtwitterhandle', // Replace with your Twitter handle if you have one
    // images: ['https://[YOUR_DOMAIN_HERE]/twitter-image.png'], // Replace with your Twitter image
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
  // icons: { // Add favicon information here if you have favicons
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest', // If you have a PWA manifest
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
        </ThemeProvider>
      </body>
    </html>
  );
}
