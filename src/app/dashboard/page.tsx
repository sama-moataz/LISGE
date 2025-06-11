
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import Link from 'next/link'; // Added import for Link
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, UserCircle, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { format } from 'date-fns'; // For formatting timestamps
import type { Timestamp } from 'firebase/firestore'; // Import Timestamp type

export default function DashboardPage() {
  const { user, userProfile, isAdmin, loading, error: authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error (e.g., show a toast notification)
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (authError) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-destructive">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{authError}</p>
                <p className="text-muted-foreground mb-4">Please try logging in again.</p>
                <Button asChild>
                    <Link href="/auth/login?redirect=/dashboard">Go to Login</Link>
                </Button>
            </CardContent>
         </Card>
      </div>
    );
  }

  if (!user || !userProfile) {
    // This case should ideally be handled by the useEffect redirect,
    // but acts as a fallback or during brief state transitions.
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying session, redirecting if necessary...</p>
      </div>
    );
  }
  
  const getAvatarFallback = (name: string | null | undefined, email: string | null | undefined, uid?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    if (uid) return uid.substring(0,2).toUpperCase();
    return "U";
  };

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    try {
      // Firestore Timestamps have a toDate() method
      if (timestamp && typeof timestamp.toDate === 'function') {
        return format((timestamp as Timestamp).toDate(), "MMMM d, yyyy 'at' h:mm a");
      }
      // If it's already a Date object or a parseable string/number
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return format(date, "MMMM d, yyyy 'at' h:mm a");
      }
      return 'Invalid Date';
    } catch (e) {
      console.warn("Failed to format timestamp:", timestamp, e);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary shadow-md">
            <AvatarImage src={userProfile.photoURL || `https://avatar.iran.run/public/boy?username=${userProfile.email || userProfile.uid}`} alt={userProfile.name || 'User Avatar'} />
            <AvatarFallback>{getAvatarFallback(userProfile.name, userProfile.email, userProfile.uid)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">
            Welcome, {userProfile.name || userProfile.email?.split('@')[0] || userProfile.phoneNumber || 'User'}!
          </CardTitle>
          <CardDescription>
            {isAdmin ? (
              <span className="flex items-center justify-center gap-1 text-accent-foreground font-semibold">
                <ShieldCheck size={18} className="text-accent" /> Administrator Dashboard
              </span>
            ) : (
              "Your Personal LISGE Hub Dashboard"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Email:</strong> {userProfile.email || 'Not provided'}</div>
            {userProfile.phoneNumber && <div><strong>Phone:</strong> {userProfile.phoneNumber}</div>}
            <div><strong>Role:</strong> <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${isAdmin ? 'bg-accent/20 text-accent-foreground' : 'bg-primary/10 text-primary'}`}>{userProfile.role}</span></div>
            <div><strong>Joined:</strong> {formatTimestamp(userProfile.createdAt)}</div>
            <div><strong>Last Login:</strong> {formatTimestamp(userProfile.lastLoginAt)}</div>
            <div><strong>UID:</strong> {userProfile.uid}</div>
          </div>
          <div className="border-t pt-4 mt-4">
            {isAdmin ? (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Admin Tools</h3>
                <p className="text-muted-foreground mb-2">
                  Manage LISGE content sections from here. (Functionality Coming Soon)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" disabled>Manage Scholarships</Button>
                  <Button variant="outline" disabled>Manage Study Tips</Button>
                  <Button variant="outline" disabled>Manage Summer Programs</Button>
                  <Button variant="outline" disabled>Manage Exchange Programs</Button>
                  <Button variant="outline" disabled>Manage Volunteer Opps</Button>
                  <Button variant="outline" disabled>Manage Pre-College Courses</Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Your Space</h3>
                <p className="text-muted-foreground">
                  This is your user dashboard. Personalized features like saved items or recommendations will appear here in the future!
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
           <Button variant="destructive" onClick={handleLogout} size="sm">
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
