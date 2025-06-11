
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
      console.log("[AuthContext] onAuthStateChanged triggered. currentUser?.uid:", currentUser?.uid || "No user (currentUser is null). Resetting state.");
      setLoading(true);
      setError(null); // Reset error on auth state change
      setUserProfile(null); // Reset profile on auth state change
      setIsAdmin(false); // Reset admin status

      if (currentUser) {
        setUser(currentUser);
        const currentAuthUid = currentUser.uid;
        console.log(`[AuthContext] User IS AUTHENTICATED with Firebase Auth. UID: ${currentAuthUid}, Email: ${currentUser.email}`);
        
        try {
          const userDocPath = `USERS/${currentAuthUid}`;
          const userDocRef = doc(db, userDocPath);
          console.log(`[AuthContext] Attempting to fetch Firestore profile from: ${userDocPath}`);
          
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile; // Assume UserProfile structure for now
            console.log(`[AuthContext] User profile FOUND in Firestore at ${userDocPath}. Raw data:`, JSON.stringify(profileData, null, 2));
            
            // Validate essential fields in profileData
            if (!profileData) { // Should not happen if exists() is true, but defensive check
                console.error(`[AuthContext] CRITICAL: userDocSnap.exists() was true for ${userDocPath}, but userDocSnap.data() returned falsy:`, profileData);
                setError(`User profile data for ${currentAuthUid} is unexpectedly empty/null despite document existing. Contact support.`);
            } else if (typeof profileData.uid !== 'string' || profileData.uid.trim() === '') {
              console.error(`[AuthContext] CRITICAL: User profile data at ${userDocPath} is MISSING 'uid' field or 'uid' is not a non-empty string. profileData.uid: '${profileData.uid}'. Auth UID: ${currentAuthUid}. This indicates a problem with profile creation/update.`);
              setError(`User profile data is corrupted: 'uid' field is missing or invalid for user ${currentAuthUid}. Please contact support or try to re-login. If you just signed up, the profile might not have been fully created.`);
            } else if (profileData.uid !== currentAuthUid) {
                console.error(`[AuthContext] CRITICAL MISMATCH: Auth UID (${currentAuthUid}) does not match Firestore document's 'uid' field (${profileData.uid}) at ${userDocPath}!`);
                setError("User profile UID mismatch. Please contact support.");
            } else {
                console.log(`[AuthContext] UID match successful (Auth UID: ${currentAuthUid}, Firestore doc UID field: ${profileData.uid}). Setting userProfile.`);
                setUserProfile(profileData);
                if (profileData.role === 'Admin') {
                  setIsAdmin(true);
                  console.log("[AuthContext] User IS ADMIN based on Firestore role 'Admin'.");
                } else {
                  setIsAdmin(false);
                  console.log(`[AuthContext] User is NOT ADMIN. Role found: '${profileData.role}' (Expected 'Admin' for admin privileges).`);
                }
            }
          } else {
            console.warn(`[AuthContext] User profile NOT FOUND in Firestore at path ${userDocPath}. userDocSnap.exists() is false.`);
            setError(`User profile not found in database for UID ${currentAuthUid}. If you just signed up, this might resolve shortly or on next login attempt. Ensure profile creation on signup is robust.`);
            // The login page has a fallback to create a basic profile, which might resolve this.
          }
        } catch (e: any) {
          console.error(`[AuthContext] Error fetching user profile from Firestore for UID ${currentAuthUid}:`, e);
          console.error(`[AuthContext] Firestore error details: Code - ${e.code}, Message - ${e.message}`);
          setError(`Could not retrieve user profile: ${e.message}. Check Firestore rules and connectivity.`);
        }
      } else {
        setUser(null); // Clear user if no one is authenticated
        console.log("[AuthContext] No user authenticated (currentUser from onAuthStateChanged was null). All user-specific state cleared.");
      }
      setLoading(false);
      console.log("[AuthContext] Auth state processing complete. Loading: false. Final states -> isAdmin:", isAdmin, "user UID:", user?.uid, "userProfile UID:", userProfile?.uid);
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
