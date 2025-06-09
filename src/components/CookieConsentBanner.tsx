
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShieldCheck, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'lisge_cookie_consent_accepted';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    // This effect should only run on the client
    if (typeof window !== 'undefined') {
      const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consentGiven) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4 bg-background border-t border-border shadow-lg transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1 sm:mt-0" />
          <div>
            <h2 id="cookie-consent-title" className="text-lg font-semibold text-foreground">Our Use of Local Storage</h2>
            <p id="cookie-consent-description" className="text-sm text-muted-foreground">
              We use local storage to remember your preferences (like your theme choice) and improve your experience.
              By continuing to use this site, you acknowledge this. You can read more in our{' '}
              <Link href="/privacy-policy" className="underline hover:text-primary">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={handleAccept} size="sm">
            Accept & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
