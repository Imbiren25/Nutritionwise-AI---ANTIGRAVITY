import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { GAME_ITEMS, GameItem } from '../shared/gameData';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';
import { Card } from '../../ui/Card';

interface NutriTapProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

interface ActiveItem {
    id: number;
    item: GameItem;
    expiresAt: number;
}

const NutriTap: React.FC<NutriTapProps> = ({ config, onExit }) => {
    const {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        endGame,
        nextLevel,
        addScore,
        loseLife
    } = useGameEngine({
        gameId: 'nutri-tap',
        initialTime: Math.round(45 * config.timeMultiplier),
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const gridSize = config.difficulty === 'hard' ? 16 : 9; // 4x4 for hard, 3x3 otherwise
    const [activeItems, setActiveItems] = useState<Map<number, ActiveItem>>(new Map());
    const [feedback, setFeedback] = useState<{ id: number, type: 'good' | 'bad', text: string } | null>(null);

    // Sound effects
    const playSound = useCallback((type: 'good' | 'bad' | 'spawn') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new (AudioContext as any)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'good') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'bad') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else {
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    }, []);

    // Game Loop
    useEffect(() => {
        if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

        const spawnInterval = setInterval(() => {
            setActiveItems(prev => {
                const newMap = new Map(prev);
                const now = Date.now();

                // Remove expired
                for (const [key, val] of newMap.entries()) {
                    if (now > val.expiresAt) {
                        newMap.delete(key);
                    }
                }

                // Spawn new
                if (newMap.size < gridSize / 2) {
                    const emptySlots = Array.from({ length: gridSize }, (_, i) => i).filter(i => !newMap.has(i));
                    if (emptySlots.length > 0) {
                        const slot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
                        const isBomb = Math.random() < (0.2 + (config.level * 0.01)); // Bomb chance increases with level
                        const pool = GAME_ITEMS.filter(i => isBomb ? !i.isHealthy : i.isHealthy);
                        const item = pool[Math.floor(Math.random() * pool.length)];

                        const duration = Math.max(1000, 3000 / config.speedMultiplier);

                        newMap.set(slot, {
                            id: Date.now(),
                            item,
                            expiresAt: now + duration
                        });
                        playSound('spawn');
                    }
                }
                return newMap;
            });
        }, 800 / config.speedMultiplier);

        return () => clearInterval(spawnInterval);
    }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, config.speedMultiplier, config.level, gridSize, playSound]);

    const handleTap = (slotIndex: number) => {
        if (gameState.isPaused || gameState.isGameOver) return;

        const active = activeItems.get(slotIndex);
        if (!active) return;

        if (active.item.isHealthy) {
            addScore(10);
            playSound('good');
            setFeedback({ id: slotIndex, type: 'good', text: '+10' });

            // Level up check
            if (gameState.score > 0 && gameState.score % 150 === 0) {
                nextLevel();
            }
        } else {
            loseLife();
            playSound('bad');
            setFeedback({ id: slotIndex, type: 'bad', text: '-1 ❤️' });
        }

        setActiveItems(prev => {
            const newMap = new Map(prev);
            newMap.delete(slotIndex);
            return newMap;
        });

        setTimeout(() => setFeedback(null), 500);
    };

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft > 0) {
        return (
            <GameShell
                title="Nutri-Tap"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">👆🍎💣</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Nutri-Tap
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Tap the healthy foods! Avoid the junk food bombs!
                        </p>
                    </div>
                    <Button size="lg" onClick={startGame} className="text-xl px-10 py-7 rounded-2xl shadow-lg hover:scale-105 transition-all">
                        Start Game
                    </Button>
                </div>
            </GameShell>
        );
    }

    return (
        <GameShell
            title="Nutri-Tap"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div className="flex items-center justify-center h-full p-4">
                <div className={cn(
                    "grid gap-3 w-full max-w-md aspect-square",
                    gridSize === 16 ? "grid-cols-4" : "grid-cols-3"
                )}>
                    {Array.from({ length: gridSize }).map((_, i) => {
                        const active = activeItems.get(i);
                        const isFeedback = feedback?.id === i;

                        return (
                            <button
                                key={i}
                                onClick={() => handleTap(i)}
                                disabled={!active || gameState.isPaused}
                                className={cn(
                                    "relative rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-all duration-100 touch-manipulation",
                                    "bg-muted/30 border-2 border-transparent",
                                    active && "bg-white shadow-lg border-b-4 scale-95",
                                    active?.item.isHealthy ? "border-green-200 hover:border-green-400" : active ? "border-red-200 hover:border-red-400" : ""
                                )}
                            >
                                {active && (
                                    <span className="animate-in zoom-in duration-200 drop-shadow-md">
                                        {active.item.icon}
                                    </span>
                                )}
                                {isFeedback && (
                                    <div className={cn(
                                        "absolute inset-0 flex items-center justify-center font-bold text-xl animate-out fade-out slide-out-to-top-10 duration-500 z-10",
                                        feedback.type === 'good' ? "text-green-600" : "text-red-600"
                                    )}>
                                        {feedback.text}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </GameShell>
    );
};

export default NutriTap;
