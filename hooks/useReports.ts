import { useState, useEffect, useCallback } from 'react';
import { CompletedReport } from '../types';
import { saveReport, getUserReports, firebaseReady } from '../services/firebase';

const REPORTS_STORAGE_KEY = 'nutritionWiseCompletedReports';

export const useReports = (userId?: string) => {
  const [reports, setReports] = useState<CompletedReport[]>(() => {
    try {
      const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
      console.error('Error reading reports from localStorage', error);
      return [];
    }
  });

  // Fetch reports from Firestore when userId is available
  useEffect(() => {
    const fetchReports = async () => {
      if (userId && firebaseReady) {
        try {
          const firestoreReports = await getUserReports(userId);
          if (firestoreReports.length > 0) {
            // Merge with local reports or replace? For now, let's replace to ensure consistency with DB
            // But we might want to keep local ones that aren't synced yet?
            // Simpler approach: Use Firestore as source of truth if available
            setReports(firestoreReports);
            localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(firestoreReports));
          }
        } catch (error) {
          console.error('Error fetching reports from Firestore:', error);
        }
      }
    };

    fetchReports();
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports to localStorage', error);
    }
  }, [reports]);

  const addReport = useCallback(async (report: CompletedReport) => {
    // Optimistic update
    setReports(prevReports => [report, ...prevReports]);

    // Save to Firestore if user is logged in
    if (userId && firebaseReady) {
      try {
        await saveReport(userId, report);
      } catch (error) {
        console.error('Error saving report to Firestore:', error);
        // TODO: Handle offline sync or retry
      }
    }
  }, [userId]);

  const clearReports = useCallback(() => {
    setReports([]);
    localStorage.removeItem(REPORTS_STORAGE_KEY);
  }, []);

  const deleteReport = useCallback(async (reportId: string) => {
    // Optimistic update
    setReports(prevReports => prevReports.filter(r => r.id !== reportId));

    // Delete from Firestore if user is logged in
    if (userId && firebaseReady) {
      try {
        const { deleteReport: deleteFromFirestore } = await import('../services/firebase');
        await deleteFromFirestore(userId, reportId);
      } catch (error) {
        console.error('Error deleting report from Firestore:', error);
        // Revert on error
        const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (savedReports) {
          setReports(JSON.parse(savedReports));
        }
      }
    }
  }, [userId]);

  const updateReport = useCallback(async (reportId: string, updatedData: Partial<CompletedReport>) => {
    // Optimistic update
    setReports(prevReports =>
      prevReports.map(r => r.id === reportId ? { ...r, ...updatedData } : r)
    );

    // Update in Firestore if user is logged in
    if (userId && firebaseReady) {
      try {
        const { updateReport: updateInFirestore } = await import('../services/firebase');
        await updateInFirestore(userId, reportId, updatedData);
      } catch (error) {
        console.error('Error updating report in Firestore:', error);
        // Revert on error
        const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (savedReports) {
          setReports(JSON.parse(savedReports));
        }
      }
    }
  }, [userId]);

  return { reports, addReport, clearReports, deleteReport, updateReport };
};