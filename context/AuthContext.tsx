// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebaseService';
import { UserProfile } from '../types';
import { getVietnameseErrorMessage } from '../utils/firebaseErrors';

const defaultProfile: UserProfile = {
  name: 'Bạn mới',
  goal: 'healthy',
  dietaryNotes: '',
  cookingTime: 30,
};

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // Create default profile for existing users who don't have one yet (migration)
          const migrationProfile: UserProfile = {
            ...defaultProfile,
            name: user.email?.split('@')[0] || 'User',
            email: user.email!,
          };
          await setDoc(userDocRef, migrationProfile);
          setUserProfile(migrationProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newProfile: UserProfile = {
        ...defaultProfile,
        name: name,
        email: userCredential.user.email!,
      };
      await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
      // Set profile in state immediately to avoid race condition and UI flicker.
      setUserProfile(newProfile);
    } catch (err: any) {
      const vietnameseError = getVietnameseErrorMessage(err);
      setError(vietnameseError);
      throw err;
    } finally {
        setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        const vietnameseError = getVietnameseErrorMessage(err);
        setError(vietnameseError);
        throw err;
      } finally {
        setLoading(false);
      }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      let profile: UserProfile;
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      } else {
        profile = {
          ...defaultProfile,
          name: user.displayName || user.email?.split('@')[0] || 'Nguoi dung',
          email: user.email || '',
        };
        await setDoc(userDocRef, profile);
      }

      setUserProfile(profile);
    } catch (err: any) {
      const vietnameseError = getVietnameseErrorMessage(err);
      setError(vietnameseError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const vietnameseError = getVietnameseErrorMessage(err);
      setError(vietnameseError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profile: UserProfile) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, profile, { merge: true });
      setUserProfile(profile);
    } else {
      throw new Error("Không có người dùng nào đang đăng nhập để lưu hồ sơ.");
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    saveProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};




