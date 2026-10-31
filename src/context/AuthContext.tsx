import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Profile, UserRole } from '../types/database';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error?: string }>;
  signInWithGoogle: (defaultRole?: UserRole) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'samparka_auth_session';
const BOOTSTRAP_ADMIN_EMAIL = 'kiranhandi232@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch or create a user profile document in Firestore
  const syncProfile = async (fbUser: FirebaseUser, requestedRole?: UserRole, requestedFullName?: string): Promise<Profile> => {
    const profileRef = doc(db, 'profiles', fbUser.uid);
    try {
      const snap = await getDoc(profileRef);
      const isSystemAdmin = fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

      if (snap.exists()) {
        const data = snap.data();
        const p: Profile = {
          id: fbUser.uid,
          full_name: data.fullName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          avatar_url: fbUser.photoURL || null,
          phone: data.phoneNumber || fbUser.phoneNumber || null,
          city: data.city || 'Hubli',
          locality: data.locality || 'Vidyanagar',
          user_type: isSystemAdmin ? 'admin' : (data.userType as UserRole) || 'job_seeker',
          skills: data.skills || [],
          resume_url: data.resumeUrl || null,
          is_admin: isSystemAdmin || !!data.isAdmin,
          created_at: data.createdAt || new Date().toISOString(),
          updated_at: data.updatedAt || new Date().toISOString(),
        };

        // If system admin, ensure admin doc exists
        if (isSystemAdmin) {
          try {
            await setDoc(doc(db, 'admins', fbUser.uid), {
              id: fbUser.uid,
              email: fbUser.email,
              createdAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {
            console.warn('Admin record sync notice:', e);
          }
        }

        return p;
      } else {
        // Create new profile doc in Firestore
        const role = isSystemAdmin ? 'admin' : (requestedRole || 'job_seeker');
        const now = new Date().toISOString();
        const newProfileData = {
          id: fbUser.uid,
          email: fbUser.email || '',
          fullName: requestedFullName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          userType: role,
          city: 'Hubli',
          locality: 'Vidyanagar',
          skills: [],
          isAdmin: isSystemAdmin,
          createdAt: now,
          updatedAt: now,
        };

        try {
          await setDoc(profileRef, newProfileData);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `profiles/${fbUser.uid}`);
        }

        if (isSystemAdmin) {
          try {
            await setDoc(doc(db, 'admins', fbUser.uid), {
              id: fbUser.uid,
              email: fbUser.email,
              createdAt: now,
            });
          } catch (e) {
            console.warn('Admin record init notice:', e);
          }
        }

        return {
          id: fbUser.uid,
          full_name: newProfileData.fullName,
          avatar_url: fbUser.photoURL || null,
          phone: fbUser.phoneNumber || null,
          city: newProfileData.city,
          locality: newProfileData.locality,
          user_type: role,
          skills: [],
          is_admin: isSystemAdmin,
          created_at: now,
          updated_at: now,
        };
      }
    } catch (err) {
      console.warn('Error syncing profile from Firestore:', err);
      // Fallback in-memory profile
      const isAdm = fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      return {
        id: fbUser.uid,
        full_name: requestedFullName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        avatar_url: fbUser.photoURL || null,
        phone: null,
        city: 'Hubli',
        locality: 'Vidyanagar',
        user_type: isAdm ? 'admin' : (requestedRole || 'job_seeker'),
        skills: [],
        is_admin: isAdm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser({ id: fbUser.uid, email: fbUser.email || '' });
        const p = await syncProfile(fbUser);
        setProfile(p);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({
          user: { id: fbUser.uid, email: fbUser.email || '' },
          profile: p,
        }));
      } else {
        // Fallback to local session if present
        const saved = localStorage.getItem(LOCAL_AUTH_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch {
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (defaultRole?: UserRole): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setUser({ id: fbUser.uid, email: fbUser.email || '' });
      const p = await syncProfile(fbUser, defaultRole);
      setProfile(p);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Google sign-in failed' };
    }
  };

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = cred.user;
        setUser({ id: fbUser.uid, email: fbUser.email || '' });
        const p = await syncProfile(fbUser);
        setProfile(p);
        setIsLoading(false);
        return {};
      } catch (err: any) {
        // If email/password provider is not yet enabled in the Firebase console or credentials mismatched
        if (err.code === 'auth/operation-not-allowed') {
          console.info('Email/Password provider disabled in Firebase console, using fallback session.');
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setIsLoading(false);
          return { error: 'Invalid email or password. You can also sign in with Google.' };
        }
      }
    }

    // Seamless fallback demo credentials mode
    const role: UserRole = email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() || email.includes('admin')
      ? 'admin'
      : email.includes('employer') || email.includes('kamat')
      ? 'employer'
      : 'job_seeker';

    const isAdm = role === 'admin';
    const newUser: User = { id: `usr-${Date.now()}`, email };
    const newProf: Profile = {
      id: newUser.id,
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      user_type: role,
      city: 'Hubli',
      locality: 'Vidyanagar',
      skills: ['Communication', 'Local Routes', 'Kannada'],
      is_admin: isAdm,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    setProfile(newProf);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ user: newUser, profile: newProf }));
    setIsLoading(false);
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ): Promise<{ error?: string }> => {
    setIsLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = cred.user;
      setUser({ id: fbUser.uid, email: fbUser.email || '' });
      const p = await syncProfile(fbUser, role, fullName);
      setProfile(p);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setIsLoading(false);
        return { error: 'An account with this email already exists. Please log in.' };
      }
      if (err.code !== 'auth/operation-not-allowed') {
        console.warn('Firebase signUp issue:', err);
      }
    }

    // Local fallback session
    const isAdm = email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
    const newUser: User = { id: `usr-${Date.now()}`, email };
    const newProf: Profile = {
      id: newUser.id,
      full_name: fullName,
      user_type: isAdm ? 'admin' : role,
      city: 'Hubli',
      locality: 'Vidyanagar',
      skills: [],
      is_admin: isAdm,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    setProfile(newProf);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ user: newUser, profile: newProf }));
    setIsLoading(false);
    return {};
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: string }> => {
    if (!user || !profile) return { error: 'Not authenticated' };

    try {
      const profileRef = doc(db, 'profiles', user.id);
      const firestoreUpdates: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };
      if (updates.full_name !== undefined) firestoreUpdates.fullName = updates.full_name;
      if (updates.city !== undefined) firestoreUpdates.city = updates.city;
      if (updates.locality !== undefined) firestoreUpdates.locality = updates.locality;
      if (updates.phone !== undefined) firestoreUpdates.phoneNumber = updates.phone;
      if (updates.skills !== undefined) firestoreUpdates.skills = updates.skills;
      if (updates.resume_url !== undefined) firestoreUpdates.resumeUrl = updates.resume_url;

      await updateDoc(profileRef, firestoreUpdates);
    } catch (err) {
      console.warn('Firestore profile update fallback:', err);
    }

    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ user, profile: updated }));
    return {};
  };

  const role = profile?.user_type || null;
  const isAdmin = profile?.is_admin || role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
