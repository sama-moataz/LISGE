
"use client";

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("[AuthContext] onAuthStateChanged triggered. currentUser UID:", currentUser?.uid || "No user (currentUser is null)");
      setLoading(true);
      setError(null);
      setUserProfile(null); 
      setIsAdmin(false);

      if (currentUser) {
        setUser(currentUser);
        console.log(`[AuthContext] User authenticated with UID (from AuthStateChanged): ${currentUser.uid}, Email: ${currentUser.email}`);
        try {
          const userDocRef = doc(db, 'USERS', currentUser.uid);
          console.log(`[AuthContext] Attempting to fetch profile from Firestore: USERS/${currentUser.uid}`);
          
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile;
            console.log("[AuthContext] User profile FOUND in Firestore:", JSON.stringify(profileData, null, 2));
            
            // Verify UID match between auth and Firestore doc if paranoia strikes
            if (profileData.uid !== currentUser.uid) {
                console.error(`[AuthContext] CRITICAL MISMATCH: Auth UID (${currentUser.uid}) does not match Firestore document UID (${profileData.uid})!`);
                setError("User profile UID mismatch. Please contact support.");
                // Potentially clear user state here or force logout
            } else {
                setUserProfile(profileData);
                if (profileData.role === 'Admin') {
                  setIsAdmin(true);
                  console.log("[AuthContext] User IS ADMIN based on Firestore role 'Admin'.");
                } else {
                  setIsAdmin(false);
                  console.log(`[AuthContext] User is NOT ADMIN. Role found: '${profileData.role}' (Expected 'Admin').`);
                }
            }
          } else {
            console.warn(`[AuthContext] User profile NOT FOUND in Firestore at path USERS/${currentUser.uid}. This means userDocSnap.exists() is false.`);
            setError(`User profile not found in database for UID ${currentUser.uid}. If you just signed up, this might resolve shortly or on next login attempt. Ensure profile creation on signup is robust.`);
          }
        } catch (e: any) {
          console.error("[AuthContext] Error fetching user profile from Firestore:", e);
          console.error(`[AuthContext] Firestore error details: Code - ${e.code}, Message - ${e.message}`);
          setError(`Could not retrieve user profile: ${e.message}. Check Firestore rules and connectivity.`);
        }
      } else {
        setUser(null);
        console.log("[AuthContext] No user authenticated (currentUser from onAuthStateChanged was null).");
      }
      setLoading(false);
      console.log("[AuthContext] Auth state processing complete. Loading: false, isAdmin:", isAdmin, "User:", user?.uid, "UserProfile:", userProfile?.uid);
    });

    return () => {
      console.log("[AuthContext] Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
