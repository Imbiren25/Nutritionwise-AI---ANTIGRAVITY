
import { useState, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

interface UseSyncProps {
    addNotification: (notification: { title: string; message: string; }) => void;
    showSnackbar: (message: string, type?: 'success' | 'error') => void;
    onSync?: () => Promise<void>;
}

export const useSync = ({ addNotification, showSnackbar, onSync }: UseSyncProps) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState('Never');
    const [showConflictModal, setShowConflictModal] = useState(false);

    const syncNow = useCallback(async () => {
        setIsSyncing(true);
        setShowConflictModal(false);
        analyticsService.logEvent('sync_started', { count: 1 });

        try {
            // Perform actual cloud sync if provided
            if (onSync) {
                await onSync();
            }

            // Simulate a small delay for better UX if sync is too fast
            await new Promise(resolve => setTimeout(resolve, 800));

            setLastSynced(new Date().toLocaleTimeString());
            showSnackbar('Data synced to cloud successfully.');
            analyticsService.logEvent('sync_completed', { count: 1 });
        } catch (error) {
            console.error('Sync failed:', error);
            showSnackbar('Sync failed. Please check your connection.', 'error');
            analyticsService.logEvent('sync_failed', { reason: 'cloud_error' });
        } finally {
            setIsSyncing(false);
        }
    }, [addNotification, showSnackbar, onSync]);

    const resolveConflict = useCallback((strategy: 'local' | 'server') => {
        analyticsService.logEvent('sync_conflict_resolved', { resolution: strategy });
        setShowConflictModal(false);
        // Simulate completing the sync after resolution
        setIsSyncing(true);
        setTimeout(() => {
            setLastSynced(new Date().toLocaleTimeString());
            setIsSyncing(false);
            showSnackbar('Conflict resolved and data synced.');
        }, 1000);
    }, [showSnackbar]);


    return { isSyncing, lastSynced, syncNow, showConflictModal, resolveConflict };
};
