import { useState, useEffect, useCallback } from 'react';
import { StockInventoryData } from '../types';
import { SyncService } from '../services/syncService';
import { getInventoryDraft, saveInventoryDraft, firebaseReady } from '../services/firebase';

const initialStockInventoryData: StockInventoryData = {
  sectionA: { name: '', age: 0, sex: 'Male', maritalStatus: 'Single', educationStatus: 'Primary' },
  sectionB: { hofName: '', hofRelation: '', hofEducation: 'Primary', hofOccupation: 'Unskilled' },
  sectionC: { location: 'Urban - Non Slum' },
  sectionD: { income: 0, ses: 'N/A' },
  sectionE: { familyMembers: [], totalCU: 0 },
  sectionF: {
    cereals: [],
    pulses: [],
    oils: [],
    vegetables: [],
    fruits: [],
    dairy: [],
    eggs: [],
    meat: [],
    snacks: [],
    sugars: [],
    condiments: [],
  },
  sectionG: {
    daysFoodLasts: 0,
    dietaryDiversityScore: 0,
    foodInsecurityRisk: 'Low',
  },
};

const INVENTORY_STORAGE_KEY = 'nutritionWiseInventoryDraft';
const DRAFT_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days


interface useStockInventoryProps {
  addNotification: (notification: { title: string; message: string; }) => void;
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
  userId?: string;
}


export const useStockInventory = ({ addNotification, showSnackbar, userId }: useStockInventoryProps) => {
  const [data, setData] = useState<StockInventoryData>(() => {
    try {
      const savedItem = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedItem) {
        const { data: savedData, timestamp } = JSON.parse(savedItem);
        if (Date.now() - timestamp < DRAFT_EXPIRATION_MS) {
          return savedData;
        }
        addNotification({ title: 'Draft Expired', message: 'Your stock inventory draft was older than 30 days and has been deleted.' });
      }
      return initialStockInventoryData;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialStockInventoryData;
    }
  });

  // Initialize SyncService
  const [syncService] = useState(() => new SyncService<StockInventoryData>(
    async (inventoryData) => {
      if (userId && firebaseReady) {
        await saveInventoryDraft(userId, inventoryData);
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
          const cloudDraft = await getInventoryDraft(userId);
          if (cloudDraft) {
            setData(cloudDraft);
            localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify({ data: cloudDraft, timestamp: Date.now() }));
            setLastSynced(new Date());
          }
        } catch (error) {
          console.error('Error loading inventory draft from cloud:', error);
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
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(itemToSave));

      // Queue auto-save to cloud
      if (userId) {
        syncService.queueUpdate(data);
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [data, userId, syncService]);

  const updateData = useCallback(<K extends keyof StockInventoryData>(section: K, sectionData: Partial<StockInventoryData[K]>) => {
    setData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...sectionData,
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setData(initialStockInventoryData);
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    // We might want to clear cloud draft too
  }, []);

  const saveToCloud = useCallback(async () => {
    if (!userId) return;
    await syncService.forceSync();
  }, [userId, syncService]);

  return {
    data,
    updateData,
    reset,
    saveToCloud,
    syncStatus,
    lastSynced
  };
};
