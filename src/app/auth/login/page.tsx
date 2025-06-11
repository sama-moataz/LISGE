
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LogIn, Loader2, Mail, KeyRound } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLoginSuccess = async (userId: string, userEmail: string | null) => {
    console.log(`[LoginSuccess] Handling for UID: ${userId}, Email: ${userEmail}`);
    try {
      const userDocRef = doc(db, "USERS", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("[LoginSuccess] Existing user. Updating lastLoginAt in USERS collection.");
        await setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        toast({ title: "Login Successful!", description: "Welcome back to LISGE Hub." });
      } else {
         // This case should ideally not happen for email/password sign-ins if signup is robust
         console.warn(`[LoginSuccess] Profile not found in USERS collection for user UID: ${userId}. Creating a basic profile.`);
         const basicProfile: UserProfile = {
            uid: userId,
            email: userEmail,
            name: userEmail ? userEmail.split('@')[0] : "User", // Basic name from email
            role: 'user',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            photoURL: null,
         };
         await setDoc(userDocRef, basicProfile);
         toast({ title: "Login Successful!", description: "Welcome to LISGE Hub. Your profile has been set up." });
      }

      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (dbError: any) {
      console.error("[LoginSuccess] Error during Firestore operation: ", dbError);
      toast({ title: "Login Error", description: `Could not finalize login with database: ${dbError.message}`, variant: "destructive" });
      // Fallback redirect even if Firestore fails, as auth was successful.
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log(`[Login Page] Attempting email login with: ${email}`); // Added log
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleLoginSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (err: any) {
      let friendlyMessage = "Failed to login. Please check your credentials.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        friendlyMessage = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/user-disabled') {
        friendlyMessage = "This account has been disabled. Please contact support.";
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
      }
      setError(friendlyMessage);
      toast({ title: "Login Failed", description: friendlyMessage, variant: "destructive" });
      console.error("[Login Page] Email Login Error:", err.code, err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <LogIn className="h-8 w-8 text-primary" /> Login
          </CardTitle>
          <CardDescription>Access your LISGE Hub account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1"><Mail size={14}/>Email</Label>
              <Input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1"><KeyRound size={14}/>Password</Label>
              <Input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Login with Email
            </Button>
          </form>

          {error && <p className="text-sm text-destructive py-1 text-center">{error}</p>}
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
