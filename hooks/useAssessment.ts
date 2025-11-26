import { useState, useEffect, useCallback } from 'react';
import { AssessmentData } from '../types';
import { SyncService } from '../services/syncService';
import { getAssessmentDraft, saveAssessmentDraft, firebaseReady } from '../services/firebase';

const initialAssessmentData: AssessmentData = {
  respondentContext: { isSelf: true, relationToRespondent: 'Self' },
  sectionA: { name: '', age: 1, sex: 'Male', maritalStatus: 'Single', educationStatus: 'Primary' },
  sectionB: { weight: 0, height: 0, muac: 0, bmi: 0, bmiCategory: 'N/A' },
  sectionC: { hofName: '', hofRelation: '', hofEducation: 'Primary', hofOccupation: 'Unskilled' },
  sectionD: { location: 'Urban - Non Slum' },
  sectionE: { income: 0, ses: 'N/A' },
  sectionF: {
    waterSource: 'Tap',
    cookingFuel: 'LPG',
    dietaryPattern: 'Vegetarian',
    marketAccess: 'Daily',
    storageFacilities: 'None',
    electricity: 'Reliable',
    perishablesFrequency: 'Daily',
    foodSafetyConcerns: '',
  },
  sectionG: {
    activityLevel: 'Light Exercise',
    physiologicalState: 'NPNL',
    occupation: '',
    waterIntake: 0,
    foodAllergies: '',
    medicalConditions: '',
  },
  sectionH: { isTypicalDay: 'Yes', dayType: 'Normal' },
  sectionI: { meals: { earlyMorning: [], breakfast: [], midMorning: [], lunch: [], eveningSnack: [], dinner: [], lateNight: [] } },
  sectionJ: {
    nutrientIntake: { energy: 0, protein: 0, fat: 0, carbs: 0, iron: 0, calcium: 0, vitaminA: 0, b12: 0, zinc: 0, fiber: 0 },
    rdaComparison: { energy: 0, protein: 0, fat: 0, carbs: 0, iron: 0, calcium: 0, vitaminA: 0, b12: 0, zinc: 0, fiber: 0 },
  },
};

const ASSESSMENT_STORAGE_KEY = 'nutritionWiseAssessmentDraft';
const DRAFT_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface useAssessmentProps {
  addNotification: (notification: { title: string; message: string; }) => void;
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
  userId?: string;
}

export const useAssessment = ({ addNotification, showSnackbar, userId }: useAssessmentProps) => {
  const [data, setData] = useState<AssessmentData>(() => {
    try {
      const savedItem = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (savedItem) {
        const { data: savedData, timestamp } = JSON.parse(savedItem);
        if (Date.now() - timestamp < DRAFT_EXPIRATION_MS) {
          return savedData;
        }
        addNotification({ title: 'Draft Expired', message: 'Your 24-hour recall draft was older than 30 days and has been deleted.' });
      }
      return initialAssessmentData;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialAssessmentData;
    }
  });

  // Initialize SyncService
  const [syncService] = useState(() => new SyncService<AssessmentData>(
    async (assessmentData) => {
      if (userId && firebaseReady) {
        await saveAssessmentDraft(userId, assessmentData);
      }
    }
  ));

  const [syncStatus, setSyncStatus] = useState(syncService.getState().status);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Subscribe to SyncService updates
  useEffect(() => {
    const unsubscribe = syncService.subscribe((state) => {
      setSyncStatus(state.status);
      if (state.lastSynced) {
        setLastSynced(new Date(state.lastSynced));
      }
      if (state.status === 'error' && state.error) {
        showSnackbar(`Sync Error: ${state.error}`, 'error');
      }
    });

    return () => {
      unsubscribe();
      syncService.cleanup();
    };
  }, [syncService, showSnackbar]);

  // Load from Firestore on mount if user is logged in
  useEffect(() => {
    const loadFromCloud = async () => {
      if (userId && firebaseReady) {
        try {
          const cloudDraft = await getAssessmentDraft(userId);
          if (cloudDraft) {
            setData(cloudDraft);
            localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify({ data: cloudDraft, timestamp: Date.now() }));
            setLastSynced(new Date());
          }
        } catch (error) {
          console.error('Error loading assessment draft from cloud:', error);
        }
      }
    };
    loadFromCloud();
  }, [userId]);

  // Save to localStorage and queue cloud sync on every change
  useEffect(() => {
    try {
      const itemToSave = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(itemToSave));

      // Queue auto-save to cloud
      if (userId) {
        syncService.queueUpdate(data);
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [data, userId, syncService]);

  const updateData = useCallback(<K extends keyof AssessmentData>(section: K, sectionData: Partial<AssessmentData[K]>) => {
    setData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...sectionData,
      },
    }));
  }, []);

  const resetAssessment = useCallback(() => {
    setData(initialAssessmentData);
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    // We might want to clear cloud draft too, but let's keep it safe for now or maybe clear it?
    // For now, just reset local state.
  }, []);

  const saveToCloud = useCallback(async () => {
    if (!userId) return;
    await syncService.forceSync();
  }, [userId, syncService]);

  return {
    data,
    updateData,
    resetAssessment,
    saveToCloud,
    syncStatus,
    lastSynced
  };
};
