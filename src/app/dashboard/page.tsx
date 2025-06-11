
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { format, isValid } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";


export default function DashboardPage() {
  const { user, userProfile, isAdmin, loading, error: authError } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      console.log("[Dashboard] No user found and not loading, redirecting to login.");
      router.push('/auth/login?redirect=/dashboard');
    }
    if (!loading && authError) {
        console.error("[Dashboard] AuthContext error:", authError);
        toast({
            title: "Authentication Error",
            description: authError || "There was an issue with your session. Please log in again.",
            variant: "destructive",
        });
    }
  }, [user, loading, router, authError, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/');
    } catch (error: any) {
      console.error("[Dashboard] Logout error:", error);
      toast({ title: "Logout Error", description: error.message || "Failed to log out.", variant: "destructive" });
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

  if (authError && !userProfile) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-destructive">Access Error</CardTitle>
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
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying session, redirecting if necessary...</p>
        <p className="text-sm text-muted-foreground mt-2">(Ensure you are logged in and profile data is available)</p>
      </div>
    );
  }
  
  console.log("[Dashboard] Rendering with userProfile:", userProfile, "isAdmin:", isAdmin);

  const getAvatarFallback = (name: string | null | undefined, email: string | null | undefined, uid?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    if (uid) return uid.substring(0,2).toUpperCase();
    return "U";
  };

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    try {
      let dateToFormat: Date;
      if (timestamp && typeof timestamp.toDate === 'function') {
        dateToFormat = (timestamp as Timestamp).toDate();
      } else if (timestamp instanceof Date) {
        dateToFormat = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        dateToFormat = new Date(timestamp);
      } else {
        console.warn("[Dashboard] Timestamp is of unexpected type:", typeof timestamp, timestamp);
        return 'Invalid Date Object';
      }
      
      if (isValid(dateToFormat)) {
        return format(dateToFormat, "MMMM d, yyyy 'at' h:mm a");
      }
      console.warn("[Dashboard] Formatted date is invalid. Original timestamp:", timestamp, "Parsed date:", dateToFormat);
      return 'Invalid Date';
    } catch (e) {
      console.warn("[Dashboard] Failed to format timestamp:", timestamp, e);
      return 'Formatting Error';
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
                  Manage LISGE content sections from here.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                     <Link href="/admin/scholarships">Manage Scholarships</Link>
                  </Button>
                  <Button asChild variant="outline">
                     <Link href="/admin/tips">Manage Study Tips</Link>
                  </Button>
                  <Button asChild variant="outline">
                     <Link href="/admin/programs">Manage Summer Programs</Link>
                  </Button>
                  <Button asChild variant="outline">
                     <Link href="/admin/exchange-programs">Manage Exchange Programs</Link>
                  </Button>
                  <Button asChild variant="outline">
                     <Link href="/admin/volunteer">Manage Volunteer Opps</Link>
                  </Button>
                  <Button asChild variant="outline">
                     <Link href="/admin/pre-college">Manage Pre-College Courses</Link>
                  </Button>
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
