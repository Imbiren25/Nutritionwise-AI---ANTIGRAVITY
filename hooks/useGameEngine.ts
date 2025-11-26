import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LevelConfig, GameId } from '../types/games';
import { useGame } from '../context/GameContext';

interface UseGameEngineProps {
    gameId: GameId;
    initialLives?: number;
    initialTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    startingLevel?: number;
    onGameOver?: (score: number, level: number) => void;
    onLevelComplete?: (score: number, level: number) => void;
}

export const useGameEngine = ({
    gameId,
    initialLives = 3,
    initialTime = 60,
    difficulty = 'easy',
    startingLevel = 1,
    onGameOver,
    onLevelComplete
}: UseGameEngineProps) => {
    const { updateScore, completeLevel } = useGame();

    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
        score: 0,
        level: startingLevel,
        lives: initialLives,
        timeLeft: initialTime,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            isGameOver: false,
            lives: initialLives,
            timeLeft: initialTime,
            score: 0,
            level: startingLevel,
        }));
    }, [initialLives, initialTime, startingLevel]);

    const pauseGame = useCallback(() => {
        setGameState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
    }, []);

    const resumeGame = useCallback(() => {
        setGameState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
    }, []);

    const endGame = useCallback(() => {
        setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
        if (timerRef.current) clearInterval(timerRef.current);

        // Update global state
        updateScore(gameId, gameState.score);
        if (onGameOver) onGameOver(gameState.score, gameState.level);
    }, [gameState.score, gameState.level, gameId, updateScore, onGameOver]);

    const nextLevel = useCallback(() => {
        completeLevel(gameId, gameState.level, difficulty);
        if (onLevelComplete) onLevelComplete(gameState.score, gameState.level);

        setGameState(prev => ({
            ...prev,
            level: prev.level + 1,
            timeLeft: initialTime, // Reset time for new level
        }));
    }, [gameState.level, gameState.score, gameId, initialTime, difficulty, completeLevel, onLevelComplete]);

    const addScore = useCallback((points: number) => {
        setGameState(prev => ({ ...prev, score: prev.score + points }));
    }, []);

    const loseLife = useCallback(() => {
        setGameState(prev => {
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
                endGame();
                return { ...prev, lives: 0 };
            }
            return { ...prev, lives: newLives };
        });
    }, [endGame]);

    // Timer Logic
    useEffect(() => {
        if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
            timerRef.current = setInterval(() => {
                setGameState(prev => {
                    const newTime = prev.timeLeft - 1;
                    if (newTime <= 0) {
                        endGame();
                        return { ...prev, timeLeft: 0 };
                    }
                    return { ...prev, timeLeft: newTime };
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, endGame]);

    return {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        endGame,
        nextLevel,
        addScore,
        loseLife,
        setGameState // Expose for custom updates if needed
    };
};
