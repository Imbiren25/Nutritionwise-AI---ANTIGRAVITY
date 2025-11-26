import { AppError, createAppError, getUserFriendlyErrorMessage } from '../utils/errorHandling';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SyncState {
    status: SyncStatus;
    lastSynced: number | null;
    error: string | null;
    pendingChanges: boolean;
}

type SaveFunction<T> = (data: T) => Promise<void>;

export class SyncService<T> {
    private saveFunction: SaveFunction<T>;
    private debounceMs: number;
    private timeoutId: NodeJS.Timeout | null = null;
    private listeners: ((state: SyncState) => void)[] = [];
    private state: SyncState = {
        status: 'idle',
        lastSynced: null,
        error: null,
        pendingChanges: false
    };
    private pendingData: T | null = null;
    private isOffline: boolean = !navigator.onLine;

    constructor(saveFunction: SaveFunction<T>, debounceMs: number = 3000) {
        this.saveFunction = saveFunction;
        this.debounceMs = debounceMs;

        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    private handleOnline = () => {
        this.isOffline = false;
        if (this.pendingData) {
            this.forceSync();
        }
    };

    private handleOffline = () => {
        this.isOffline = true;
        this.updateState({ error: getUserFriendlyErrorMessage({ message: 'offline' }) });
    };

    public queueUpdate(data: T) {
        this.pendingData = data;
        this.updateState({ status: 'saving', pendingChanges: true, error: null });

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        if (this.isOffline) {
            this.updateState({ error: "Offline - changes queued" });
            return;
        }

        this.timeoutId = setTimeout(() => {
            this.performSync();
        }, this.debounceMs);
    }

    public async forceSync() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        await this.performSync();
    }

    private async performSync() {
        if (!this.pendingData) return;

        try {
            this.updateState({ status: 'saving', error: null });
            await this.saveFunction(this.pendingData);
            this.pendingData = null;
            this.updateState({
                status: 'saved',
                lastSynced: Date.now(),
                pendingChanges: false
            });
        } catch (error) {
            const appError = createAppError(error);
            this.updateState({
                status: 'error',
                error: getUserFriendlyErrorMessage(error)
            });
            console.error("Sync failed:", appError);
        }
    }

    public subscribe(listener: (state: SyncState) => void) {
        this.listeners.push(listener);
        listener(this.state);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private updateState(updates: Partial<SyncState>) {
        this.state = { ...this.state, ...updates };
        this.listeners.forEach(l => l(this.state));
    }

    public getState(): SyncState {
        return this.state;
    }

    public cleanup() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}
