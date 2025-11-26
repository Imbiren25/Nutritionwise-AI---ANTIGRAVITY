import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { CompletedReport, AIResponse } from '../types';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Determine if Firebase is configured
const requiredKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId
];

let firebaseReady = requiredKeys.every(Boolean);

// Initialize Firebase safely
import { getPerformance, FirebasePerformance, trace } from 'firebase/performance';

// ... existing imports ...

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let perf: FirebasePerformance | undefined;

if (firebaseReady) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    const enableAnalytics = import.meta.env.PROD && typeof window !== 'undefined' && !!firebaseConfig.measurementId && ['nutritionwise.rf.gd', 'NUTRITIONWISEAPP.rf.gd', 'nutritionwiseai.rf.gd'].includes(window.location.hostname);
    analytics = enableAnalytics ? getAnalytics(app) : undefined;

    // Initialize Performance Monitoring
    // We only want this in production or if explicitly testing it, but usually safe to init if app is valid
    if (typeof window !== 'undefined') {
      perf = getPerformance(app);
    }

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    firebaseReady = false;
    app = undefined;
    auth = undefined;
    db = undefined;
    perf = undefined;
  }
} else {
  console.warn('Firebase is not configured. Auth features will be in demo mode.');
}

export { app, auth, db, analytics, perf, firebaseReady };

// Helper for retry logic
const retryOperation = async <T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Don't retry if it's a permission error or validation error
      if (error?.code === 'permission-denied' || error?.code === 'unauthenticated') {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

export const saveReport = async (userId: string, report: CompletedReport): Promise<string> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    let t;
    if (perf) {
      t = trace(perf, 'save_report');
      t.start();
    }

    try {
      const ref = await addDoc(collection(db!, 'reports'), {
        userId,
        type: report.type,
        respondentName: report.respondentName,
        completionDate: report.completionDate,
        data: report.data,
        aiResponse: report.aiResponse || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (t) t.stop();
      return ref.id;
    } catch (error) {
      if (t) t.stop();
      throw error;
    }
  });
};

export const getUserReports = async (userId: string): Promise<CompletedReport[]> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    let t;
    if (perf) {
      t = trace(perf, 'get_user_reports');
      t.start();
    }

    try {
      const q = query(
        collection(db!, 'reports'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          respondentName: data.respondentName,
          completionDate: data.completionDate,
          data: data.data,
          aiResponse: data.aiResponse
        } as CompletedReport;
      });

      if (t) t.stop();
      return reports;
    } catch (error) {
      if (t) t.stop();
      throw error;
    }
  });
};

// Drafts
export const saveAssessmentDraft = async (userId: string, data: any): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    await setDoc(doc(db!, 'drafts', `assessment_${userId}`), {
      userId,
      type: 'assessment',
      data,
      updatedAt: serverTimestamp()
    });
  });
};

export const getAssessmentDraft = async (userId: string): Promise<any | null> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    const docRef = doc(db!, 'drafts', `assessment_${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  });
};

export const saveInventoryDraft = async (userId: string, data: any): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    await setDoc(doc(db!, 'drafts', `inventory_${userId}`), {
      userId,
      type: 'inventory',
      data,
      updatedAt: serverTimestamp()
    });
  });
};

export const getInventoryDraft = async (userId: string): Promise<any | null> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    const docRef = doc(db!, 'drafts', `inventory_${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  });
};

export const deleteReport = async (userId: string, reportId: string): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    await deleteDoc(doc(db!, 'reports', reportId));
  });
};

export const updateReport = async (userId: string, reportId: string, updatedData: Partial<CompletedReport>): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured');

  return retryOperation(async () => {
    await updateDoc(doc(db!, 'reports', reportId), {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  });
};