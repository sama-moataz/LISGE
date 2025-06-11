
// This page is deprecated and its functionality is being moved to /dashboard for admin users.
// Users will be redirected from /admin to /dashboard or /auth/login.
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRedirectPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete
    }

    if (!user) {
      router.replace('/auth/login?redirect=/dashboard'); // If not logged in, go to login, then dashboard
    } else if (isAdmin) {
      router.replace('/dashboard'); // If admin, go to dashboard (which will show admin view)
    } else {
      router.replace('/'); // If logged in but not admin, go to homepage
    }
  }, [user, isAdmin, loading, router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}
