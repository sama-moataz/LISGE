
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
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log(`[Signup] User created in Auth with UID: ${firebaseUser.uid}`);

      // Update Firebase Auth profile (optional, but good for display name)
      await updateAuthProfile(firebaseUser, { displayName: name });
      console.log(`[Signup] Firebase Auth profile updated with name: ${name}`);

      // Create user document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userProfileData = {
        uid: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(), // Also set lastLoginAt on signup
        photoURL: firebaseUser.photoURL || null,
      };
      console.log("[Signup] Creating user profile in Firestore:", userProfileData);
      await setDoc(userDocRef, userProfileData);
      console.log("[Signup] User profile successfully created in Firestore.");

      toast({
        title: "Account Created!",
        description: "Welcome to LISGE Hub.",
      });
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
      console.error("[Signup] Error:", err);
      toast({
        title: "Signup Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
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
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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
            {error && <p className="text-sm text-destructive py-1">{error}</p>}
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
