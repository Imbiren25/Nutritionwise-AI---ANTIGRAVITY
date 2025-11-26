export type ErrorCategory = 'network' | 'auth' | 'quota' | 'validation' | 'unknown';

export interface AppError {
    code: string;
    message: string;
    category: ErrorCategory;
    originalError?: any;
    timestamp: number;
}

export const categorizeError = (error: any): ErrorCategory => {
    if (!navigator.onLine) return 'network';

    const msg = error?.message?.toLowerCase() || '';
    const code = error?.code?.toLowerCase() || '';

    if (msg.includes('network') || msg.includes('offline') || code.includes('unavailable')) return 'network';
    if (msg.includes('permission') || code.includes('permission-denied') || code.includes('unauthenticated')) return 'auth';
    if (msg.includes('quota') || code.includes('resource-exhausted')) return 'quota';

    return 'unknown';
};

export const getUserFriendlyErrorMessage = (error: any): string => {
    const category = categorizeError(error);

    switch (category) {
        case 'network':
            return "You are currently offline. Changes will be saved when you reconnect.";
        case 'auth':
            return "You don't have permission to save. Please try logging in again.";
        case 'quota':
            return "Service is busy. Please try again in a moment.";
        case 'validation':
            return "Please check your input and try again.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
};

export const createAppError = (error: any): AppError => {
    return {
        code: error?.code || 'UNKNOWN',
        message: error?.message || 'Unknown error',
        category: categorizeError(error),
        originalError: error,
        timestamp: Date.now()
    };
};
