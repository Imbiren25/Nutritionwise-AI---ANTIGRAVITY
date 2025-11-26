import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameId, GameProfile, Achievement } from '../types/games';

interface GameContextType {
    profile: GameProfile;
    updateScore: (gameId: GameId, score: number) => void;
    completeLevel: (gameId: GameId, level: number, difficulty: 'easy' | 'medium' | 'hard') => void;
    unlockGame: (gameId: GameId) => void;
    unlockAchievement: (achievementId: string) => void;
}

const defaultProfile: GameProfile = {
    totalScore: 0,
    unlockedGames: ['nutri-tap', 'fiber-fall'], // First two games unlocked by default
    completedLevels: {
        'nutri-tap': { easy: 0, medium: 0, hard: 0 },
        'fiber-fall': { easy: 0, medium: 0, hard: 0 },
        'mindful-memory': { easy: 0, medium: 0, hard: 0 },
        'quiz-quest': { easy: 0, medium: 0, hard: 0 },
        'macro-master': { easy: 0, medium: 0, hard: 0 },
        'hydration-hero': { easy: 0, medium: 0, hard: 0 },
    },
    achievements: [],
    highScores: {
        'nutri-tap': 0,
        'fiber-fall': 0,
        'mindful-memory': 0,
        'quiz-quest': 0,
        'macro-master': 0,
        'hydration-hero': 0,
    },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<GameProfile>(defaultProfile);

    useEffect(() => {
        const savedProfile = localStorage.getItem('nutritionWiseGameProfile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                // Migration logic for old profiles could go here if needed
                // For now, we'll just use the parsed profile, assuming it matches the new structure or will be overwritten
                // Ideally, merge with defaultProfile to ensure new fields exist
                setProfile({ ...defaultProfile, ...parsed });
            } catch (e) {
                console.error('Failed to load game profile', e);
            }
        }
    }, []);

    const saveProfile = (newProfile: GameProfile) => {
        setProfile(newProfile);
        localStorage.setItem('nutritionWiseGameProfile', JSON.stringify(newProfile));
    };

    const updateScore = (gameId: GameId, score: number) => {
        const newProfile = { ...profile };
        newProfile.totalScore += score;
        if (score > (newProfile.highScores[gameId] || 0)) {
            newProfile.highScores[gameId] = score;
        }
        saveProfile(newProfile);
    };

    const completeLevel = (gameId: GameId, level: number, difficulty: 'easy' | 'medium' | 'hard') => {
        const newProfile = { ...profile };
        // Ensure the game entry exists (defensive coding)
        if (!newProfile.completedLevels[gameId]) {
            newProfile.completedLevels[gameId] = { easy: 0, medium: 0, hard: 0 };
        }

        if (level > newProfile.completedLevels[gameId][difficulty]) {
            newProfile.completedLevels[gameId][difficulty] = level;
        }
        saveProfile(newProfile);
    };

    const unlockGame = (gameId: GameId) => {
        if (!profile.unlockedGames.includes(gameId)) {
            const newProfile = { ...profile, unlockedGames: [...profile.unlockedGames, gameId] };
            saveProfile(newProfile);
        }
    };

    const unlockAchievement = (achievementId: string) => {
        if (!profile.achievements.includes(achievementId)) {
            const newProfile = { ...profile, achievements: [...profile.achievements, achievementId] };
            saveProfile(newProfile);
        }
    };

    return (
        <GameContext.Provider value={{ profile, updateScore, completeLevel, unlockGame, unlockAchievement }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
