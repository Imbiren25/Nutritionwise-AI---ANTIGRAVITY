export type GameId =
    | 'nutri-tap'
    | 'fiber-fall'
    | 'mindful-memory'
    | 'quiz-quest'
    | 'macro-master'
    | 'hydration-hero';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
    levelNumber: number;
    targetScore: number;
    timeLimit?: number; // in seconds
    difficulty: Difficulty;
    config: any; // Game-specific configuration
}

export interface GameState {
    isPlaying: boolean;
    isPaused: boolean;
    isGameOver: boolean;
    score: number;
    level: number;
    lives: number;
    timeLeft: number;
}

export interface GameProfile {
    totalScore: number;
    unlockedGames: GameId[];
    completedLevels: Record<GameId, { easy: number; medium: number; hard: number; }>; // Max level completed per game and difficulty
    achievements: string[];
    highScores: Record<GameId, number>;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (profile: GameProfile) => boolean;
}
