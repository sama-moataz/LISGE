
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleAuthProvider, RecaptchaVerifier } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LogIn, Loader2, Mail, KeyRound, Smartphone, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image'; // For Google icon

// Declare reCAPTCHA verifier at the module level
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'email' | 'google' | 'phone' | 'otp' | false>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && auth) { // Ensure auth is initialized
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // Can be 'normal' or 'invisible'
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved", response);
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({ title: "reCAPTCHA Expired", description: "Please try sending the OTP again.", variant: "destructive" });
        }
      });
    }
    // Clean up reCAPTCHA widget when component unmounts
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, [toast]);


  const handleLoginSuccess = async (userId: string, userEmail: string | null) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      toast({ title: "Login Successful!", description: "Welcome back to LISGE Hub." });
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (dbError) {
      console.error("Error updating lastLoginAt: ", dbError);
      toast({ title: "Login Successful (but profile update failed)", description: "Could not update your last login time.", variant: "destructive" });
      router.push('/dashboard'); // Proceed even if Firestore update fails
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading('email');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleLoginSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading('google');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      // Check if user exists in Firestore, if not, create them
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
          photoURL: user.photoURL,
        });
      }
      await handleLoginSuccess(user.uid, user.email);
    } catch (err: any) {
      setError(err.message || "Failed to login with Google.");
      toast({ title: "Google Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading('phone');
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult; // Store for OTP verification
      setOtpSent(true);
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Ensure phone number is correct and reCAPTCHA is working.");
      toast({ title: "Phone Login Failed", description: err.message, variant: "destructive" });
      console.error("Phone auth error:", err);
       // Reset reCAPTCHA if it exists
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(function(widgetId) {
          // @ts-ignore grecaptcha is available globally via Firebase
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading('otp');
    try {
      if (window.confirmationResult) {
        const userCredential = await window.confirmationResult.confirm(otp);
        // User signed in successfully.
        // Potentially create/update user doc in Firestore if phone-only signup
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
            uid: user.uid,
            name: user.phoneNumber || "Phone User", // Placeholder name
            email: null, // No email for phone auth unless collected separately
            role: 'user',
            createdAt: serverTimestamp(),
            photoURL: null, // Or a default avatar
            phoneNumber: user.phoneNumber,
            });
        }
        await handleLoginSuccess(user.uid, user.email); // user.email will be null here
      } else {
        throw new Error("OTP confirmation result not found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
      toast({ title: "OTP Verification Failed", description: err.message, variant: "destructive" });
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
          {/* reCAPTCHA container for phone auth */}
          <div id="recaptcha-container"></div>

          {!otpSent ? (
            <>
              {/* Email/Password Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1"><Mail size={14}/>Email</Label>
                  <Input
                    id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required disabled={!!loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1"><KeyRound size={14}/>Password</Label>
                  <Input
                    id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required disabled={!!loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading === 'email' || !!loading && loading !== 'email'}>
                  {loading === 'email' ? <Loader2 className="animate-spin mr-2" /> : null}
                  Login with Email
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              {/* Google Login Button */}
              <Button variant="outline" onClick={handleGoogleLogin} className="w-full" disabled={loading === 'google' || !!loading && loading !== 'google'}>
                {loading === 'google' ? <Loader2 className="animate-spin mr-2" /> :  <Image src="/google-icon.svg" alt="Google" width={18} height={18} className="mr-2" data-ai-hint="google logo"/>}
                Sign in with Google
              </Button>

              {/* Phone Login Form */}
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1"><Smartphone size={14}/>Phone Number</Label>
                  <Input
                    id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 123 456 7890 (include country code)" required disabled={!!loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading === 'phone' || !!loading && loading !== 'phone'}>
                  {loading === 'phone' ? <Loader2 className="animate-spin mr-2" /> : null}
                  Send OTP
                </Button>
              </form>
            </>
          ) : (
            // OTP Submission Form
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">Enter OTP sent to {phoneNumber}</p>
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-1"><MessageSquare size={14}/>OTP Code</Label>
                <Input
                  id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456" required maxLength={6} disabled={!!loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading === 'otp' || !!loading && loading !== 'otp'}>
                {loading === 'otp' ? <Loader2 className="animate-spin mr-2" /> : null}
                Verify OTP & Login
              </Button>
              <Button variant="link" onClick={() => setOtpSent(false)} className="w-full text-sm" disabled={!!loading}>
                Change phone number or method
              </Button>
            </form>
          )}

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
