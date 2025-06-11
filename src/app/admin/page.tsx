
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin'); // Redirect to login if not logged in
    } else if (!loading && user && !isAdmin) {
      router.push('/'); // Redirect to home if logged in but not admin
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading admin status...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback or during brief state transitions:
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
                <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </CardContent>
         </Card>
      </div>
    );
  }

  // If loading is false, user exists, and isAdmin is true
  return (
    <div className="space-y-8">
      <div className="text-center">
        <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome, Admin {user?.displayName || user?.email}! Manage LISGE content here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards for admin actions */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Manage Scholarships</CardTitle>
            <CardDescription>Add, edit, or remove scholarship listings.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <Button asChild><Link href="/admin/scholarships">Go to Scholarships</Link></Button> */}
            <p className="text-sm text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Manage Programs</CardTitle>
            <CardDescription>Update summer and exchange program details.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* <Button asChild><Link href="/admin/programs">Go to Programs</Link></Button> */}
            <p className="text-sm text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Manage Study Tips</CardTitle>
            <CardDescription>Add or modify study tips.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
      </div>
      {/* More admin sections can be added here */}
    </div>
  );
}
