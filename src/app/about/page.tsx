// This page has been removed.
// Content related to DECI and KOSEN was previously on this page.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About LISGE', // Generic title as page is functionally removed
  robots: {
    noindex: true, // Ensure this removed page is not indexed
    nofollow: true,
  }
};

export default function AboutPage() {
  // Returning null effectively removes the page content.
  // A more robust solution might involve a redirect or a custom 404
  // if direct navigation to /about is a concern.
  return null;
}
