
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
      console.log("[AuthContext] onAuthStateChanged triggered. currentUser:", currentUser?.uid || "No user");
      setLoading(true);
      setError(null);
      setUserProfile(null); 
      setIsAdmin(false);

      if (currentUser) {
        setUser(currentUser);
        console.log(`[AuthContext] User authenticated with UID: ${currentUser.uid}`);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log(`[AuthContext] Attempting to fetch profile from Firestore: users/${currentUser.uid}`);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile;
            console.log("[AuthContext] User profile FOUND in Firestore:", profileData);
            setUserProfile(profileData);
            if (profileData.role === 'admin') {
              setIsAdmin(true);
              console.log("[AuthContext] User IS ADMIN based on Firestore role.");
            } else {
              setIsAdmin(false);
              console.log(`[AuthContext] User is NOT ADMIN. Role found: '${profileData.role}'`);
            }
          } else {
            console.warn(`[AuthContext] User profile NOT FOUND in Firestore for UID: ${currentUser.uid}. This might be an issue if the user was created but their profile wasn't, or if it's a new social/phone login that hasn't completed profile creation yet.`);
            setError("User profile not found in database. If you just signed up with Google/Phone, this might resolve shortly or on next login.");
             // For new social/phone logins, profile might be created by login page logic after this runs.
             // No explicit profile creation here to avoid race conditions with login page logic.
          }
        } catch (e: any) {
          console.error("[AuthContext] Error fetching user profile:", e);
          setError(`Could not retrieve user profile: ${e.message}`);
        }
      } else {
        setUser(null);
        console.log("[AuthContext] No user authenticated.");
      }
      setLoading(false);
      console.log("[AuthContext] Auth state processed. Loading: false, isAdmin:", isAdmin);
    });

    return () => {
      console.log("[AuthContext] Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // isAdmin should not be in dependency array here, it's set within the effect

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

