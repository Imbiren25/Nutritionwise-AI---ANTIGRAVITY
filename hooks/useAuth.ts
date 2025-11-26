import { useState, useEffect, useCallback } from 'react';

// Detect if we are running on localhost (development / testing mode)
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../services/firebase';
import { User } from '../types';

const AUTH_STORAGE_KEY = 'nutritionWiseUser';

// Helper function to convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Try to get additional user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || '',
    email: firebaseUser.email || '',
    college: userData?.college || '',
    course: userData?.course || '',
    batch: userData?.batch || '',
    avatarUrl: firebaseUser.photoURL || userData?.avatarUrl || '',
  };
};

const demoUser: User = {
  uid: 'demo-uid',
  name: 'Biren',
  email: 'student@example.com',
  college: 'NHLMMC',
  course: 'MBBS',
  batch: '2025',
  avatarUrl: ''
};

export const useAuth = () => {
  // Demo fallback when Firebase is not configured, failed to initialize, or running on localhost (testing mode)
  if (!firebaseReady || isLocalhost) {
    console.log('useAuth: Running in Demo Mode (Localhost/No Firebase)');
    const [user, setUser] = useState<User | null>(() => {
      if (isLocalhost) return demoUser;
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
      } catch {
        return null;
      }
    });

    useEffect(() => {
      try {
        if (user) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch { }
    }, [user]);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
      console.log('useAuth: Attempting demo login with', email);
      if (email.toLowerCase() === demoUser.email.toLowerCase() && password === 'password') {
        setUser(demoUser);
        return { success: true, message: 'Logged in (demo mode).' };
      }
      return { success: false, message: 'Invalid credentials (demo mode).' };
    }, []);

    const signUp = useCallback(async (): Promise<{ success: boolean; message: string }> => {
      return { success: false, message: 'Sign up is disabled in demo mode.' };
    }, []);

    const logout = useCallback(async () => {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);

    const updateUser = useCallback(async (updatedData: Partial<User>) => {
      setUser(prev => (prev ? { ...prev, ...updatedData } : prev));
    }, []);

    const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
      if (email === demoUser.email) {
        return { success: true, message: 'Password reset email sent (demo mode).' };
      }
      return { success: false, message: 'Email not found (demo mode).' };
    }, []);

    return { user, login, logout, updateUser, signUp: signUp as any, resetPassword, loading: false };
  }

  // Firebase-backed implementation when ready
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setLoading(false);
    });

    const cachedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (cachedUser && !user) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch { }
    }

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Allow demo login ONLY on localhost if explicitly requested
    if (isLocalhost && email.toLowerCase() === demoUser.email.toLowerCase() && password === 'password') {
      console.log('useAuth: Demo login fallback triggered (Localhost)');
      setUser(demoUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      return { success: true, message: 'Logged in (demo mode).' };
    }

    try {
      await signInWithEmailAndPassword(auth!, email, password);
      return { success: true, message: 'Login successful!' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : error.code === 'auth/wrong-password'
            ? 'Incorrect password.'
            : error.message || 'Login failed. Please try again.'
      };
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });
      await sendEmailVerification(firebaseUser);
      const userData: User = { uid: firebaseUser.uid, name, email, college: '', course: '', batch: '', avatarUrl: '' };
      await setDoc(doc(db!, 'users', firebaseUser.uid), userData);
      return { success: true, message: 'Account created! Please check your email to verify your account.' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : error.code === 'auth/weak-password'
            ? 'Password should be at least 6 characters.'
            : error.message || 'Sign up failed. Please try again.'
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth!);
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
      await setDoc(doc(db!, 'users', user.uid), updatedData, { merge: true });
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      if (updatedData.name && auth!.currentUser) {
        await updateProfile(auth!.currentUser, { displayName: updatedData.name });
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  }, [user]);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordResetEmail(auth!, email);
      return { success: true, message: 'Password reset email sent! Check your inbox.' };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : error.message || 'Failed to send reset email. Please try again.'
      };
    }
  }, []);

  return { user, login, logout, updateUser, signUp, resetPassword, loading };
};