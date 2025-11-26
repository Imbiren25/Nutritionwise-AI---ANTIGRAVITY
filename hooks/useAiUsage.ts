import { useState, useCallback, useEffect } from 'react';
import { AiUsageStats } from '../types';

const AI_USAGE_STORAGE_KEY = 'nutritionWiseAiUsage';
const FREE_LIMIT = 3;
const REWARDED_LIMIT = 2;

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const initialUsage: AiUsageStats = {
    freeCount: 0,
    rewardedCount: 0,
    lastReset: getTodayDateString(),
};

export const useAiUsage = () => {
    const [usage, setUsage] = useState<AiUsageStats>(() => {
        try {
            const savedUsage = localStorage.getItem(AI_USAGE_STORAGE_KEY);
            if (savedUsage) {
                const parsed = JSON.parse(savedUsage) as AiUsageStats;
                // Check if the saved data is from a previous day
                if (parsed.lastReset !== getTodayDateString()) {
                    // Reset if it's a new day
                    localStorage.setItem(AI_USAGE_STORAGE_KEY, JSON.stringify(initialUsage));
                    return initialUsage; 
                }
                return parsed;
            }
        } catch (error) {
            console.error('Error reading AI usage from localStorage', error);
        }
        return initialUsage;
    });

    useEffect(() => {
        try {
            localStorage.setItem(AI_USAGE_STORAGE_KEY, JSON.stringify(usage));
        } catch (error) {
            console.error('Error saving AI usage to localStorage', error);
        }
    }, [usage]);

    const canGenerateFree = useCallback(() => {
        return usage.freeCount < FREE_LIMIT;
    }, [usage.freeCount]);

    const canGenerateRewarded = useCallback(() => {
        return usage.rewardedCount < REWARDED_LIMIT;
    }, [usage.rewardedCount]);

    const incrementFree = useCallback(() => {
        if (canGenerateFree()) {
            setUsage(prev => ({ ...prev, freeCount: prev.freeCount + 1 }));
        }
    }, [canGenerateFree]);

    const incrementRewarded = useCallback(() => {
        if (canGenerateRewarded()) {
            setUsage(prev => ({ ...prev, rewardedCount: prev.rewardedCount + 1 }));
        }
    }, [canGenerateRewarded]);
    
    const getUsageStats = () => ({
        ...usage,
        totalUsed: usage.freeCount + usage.rewardedCount,
        totalAllowed: FREE_LIMIT + REWARDED_LIMIT,
    });

    return {
        usage,
        canGenerateFree,
        canGenerateRewarded,
        incrementFree,
        incrementRewarded,
        getUsageStats,
    };
};
