
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UserPlus, Loader2, Mail, KeyRound, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from '@/types';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ title: "Signup Failed", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      toast({ title: "Signup Failed", description: "Password should be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    console.log(`[Signup Page] Attempting signup for email: ${email}`);
    let firebaseUser; 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      console.log(`[Signup Page] User CREATED in Firebase Auth. UID: ${firebaseUser.uid}, Email: ${firebaseUser.email}`);

      // Update Firebase Auth profile (displayName)
      try {
        await updateAuthProfile(firebaseUser, { displayName: name });
        console.log(`[Signup Page] Firebase Auth profile updated with displayName: ${name} for UID: ${firebaseUser.uid}`);
      } catch (authProfileError: any) {
        console.warn(`[Signup Page] Non-critical: Failed to update Firebase Auth profile displayName for UID: ${firebaseUser.uid}. Error: ${authProfileError.message}`);
        // Continue with Firestore profile creation even if Auth profile update fails slightly
      }

      // Create user profile in Firestore
      const userDocRef = doc(db, "USERS", firebaseUser.uid); 
      const userProfileData: UserProfile = {
        uid: firebaseUser.uid, // CRITICAL: Ensure UID is stored in the document
        name: name.trim() || (firebaseUser.email ? firebaseUser.email.split('@')[0] : "New User"),
        email: firebaseUser.email,
        role: 'user', 
        createdAt: serverTimestamp() as any, // Cast to any to satisfy TS, Firestore handles it
        lastLoginAt: serverTimestamp() as any, 
        photoURL: firebaseUser.photoURL || null,
      };
      
      console.log(`[Signup Page] Preparing to create Firestore document at USERS/${firebaseUser.uid} with data:`, JSON.stringify(userProfileData));

      try {
        await setDoc(userDocRef, userProfileData);
        console.log(`[Signup Page] Firestore document CREATED successfully at USERS/${firebaseUser.uid}.`);

        toast({
          title: "Account Created!",
          description: "Welcome to LISGE Hub. Redirecting to dashboard...",
        });
        router.push('/dashboard'); 

      } catch (firestoreError: any) {
        console.error(`[Signup Page] CRITICAL: Firebase Auth user ${firebaseUser?.uid} created, BUT FAILED to create Firestore profile at USERS/${firebaseUser?.uid}. Error:`, firestoreError);
        const profileCreationErrorMessage = `Account authentication was successful, but we encountered an issue setting up your profile in our database (Error: ${firestoreError.message}). ` +
                                            `Please try logging in. If the problem persists, contact support with your email and this UID: ${firebaseUser?.uid || 'N/A'}.`;
        setError(profileCreationErrorMessage); // Display error on signup page
        toast({
          title: "Signup Incomplete",
          description: profileCreationErrorMessage,
          variant: "destructive",
          duration: 15000, // Longer duration for this critical error
        });
        // DO NOT redirect if Firestore profile creation fails.
      }

    } catch (authError: any) { // Handles errors from createUserWithEmailAndPassword
      let friendlyMessage = "Failed to create account. Please try again.";
      if (authError.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email address is already registered. Please try logging in or use a different email.";
      } else if (authError.code === 'auth/weak-password') {
        friendlyMessage = "The password is too weak. Please choose a stronger password.";
      } else if (authError.code === 'auth/invalid-email') {
        friendlyMessage = "The email address is not valid. Please enter a valid email.";
      }
      setError(friendlyMessage);
      toast({
        title: "Signup Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
      console.error("[Signup Page] Firebase Auth Error (createUserWithEmailAndPassword):", authError.code, authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <UserPlus className="h-8 w-8 text-primary" /> Create Account
          </CardTitle>
          <CardDescription>Join LISGE to explore your potential.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1"><User size={14}/>Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1"><Mail size={14}/>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1"><KeyRound size={14}/>Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min. 6 characters)"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1"><KeyRound size={14}/>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive py-1 text-center whitespace-pre-wrap">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
