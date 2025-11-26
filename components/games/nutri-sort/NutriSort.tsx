import React, { useState, useEffect, useCallback } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { FOOD_ITEMS, CATEGORIES, FoodItem, FoodCategory } from './data';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';
import { Card } from '../../ui/Card';
import Badge from '../../ui/Badge';

interface NutriSortProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        targetMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

const NutriSort: React.FC<NutriSortProps> = ({ config, onExit }) => {
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
        gameId: 'macro-master',
        initialTime: Math.round(60 * config.timeMultiplier),
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [streak, setStreak] = useState(0);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [shake, setShake] = useState(false);

    // Sound effects (using Web Audio API)
    const playSound = useCallback((type: 'correct' | 'wrong' | 'streak' | 'pop') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'streak') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    }, []);

    const spawnItem = useCallback(() => {
        if (gameState.isPaused) return;
        const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
        setCurrentItem(randomItem);
        setFeedback(null);
        playSound('pop');
    }, [gameState.isPaused, playSound]);

    useEffect(() => {
        if (gameState.isPlaying && !gameState.isPaused && !currentItem) {
            spawnItem();
        }
    }, [gameState.isPlaying, gameState.isPaused, currentItem, spawnItem]);

    const createParticles = (x: number, y: number) => {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    const handleSort = (category: FoodCategory) => {
        if (!currentItem || !gameState.isPlaying || gameState.isPaused) return;

        if (currentItem.category === category) {
            // Correct answer
            const points = 10 + (streak * 2);
            addScore(points);
            setStreak(s => s + 1);
            setFeedback('correct');
            playSound(streak > 2 ? 'streak' : 'correct');
            createParticles(50, 50);

            if (streak > 0 && streak % 10 === 0) {
                nextLevel();
            }

            setTimeout(spawnItem, 400);
        } else {
            // Wrong answer
            loseLife();
            setStreak(0);
            setFeedback('wrong');
            setShake(true);
            playSound('wrong');
            setTimeout(() => setShake(false), 500);
            setTimeout(spawnItem, 600);
        }
    };

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft === 60) {
        return (
            <GameShell
                title="Macro Master"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">🍎🥦🍞</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Ready to Sort?
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Sort foods into the correct categories as fast as you can!
                            <br />
                            <span className="text-sm">Build streaks for bonus points 🔥</span>
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={startGame}
                        className="text-xl px-10 py-7 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Start Game
                    </Button>
                </div>
            </GameShell>
        );
    }

    return (
        <GameShell
            title="Macro Master"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div className="flex flex-col h-full items-center justify-between py-8 px-4 relative overflow-hidden">
                {/* Animated background particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDuration: '1s',
                        }}
                    />
                ))}

                {/* Game Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                    {/* Feedback Overlay */}
                    {feedback && (
                        <div className={cn(
                            "absolute inset-0 flex items-center justify-center z-20 pointer-events-none",
                            "animate-in zoom-in fade-in duration-300"
                        )}>
                            <div className={cn(
                                "text-8xl font-bold drop-shadow-2xl",
                                feedback === 'correct' ? "text-green-500 animate-bounce" : "text-red-500 animate-pulse"
                            )}>
                                {feedback === 'correct' ? "✓" : "✗"}
                            </div>
                        </div>
                    )}

                    {/* Streak Badge */}
                    {streak > 2 && (
                        <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-right duration-300">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-lg font-bold shadow-lg animate-pulse">
                                🔥 {streak}x Streak!
                            </Badge>
                        </div>
                    )}

                    {/* Current Item Card */}
                    {currentItem && (
                        <Card className={cn(
                            "w-64 h-64 flex flex-col items-center justify-center gap-6 shadow-2xl border-4 transition-all duration-300 relative",
                            feedback === 'correct' ? "border-green-500 scale-110 opacity-0 rotate-12" :
                                feedback === 'wrong' ? "border-red-500" : "border-primary animate-in zoom-in duration-300",
                            shake && "animate-shake"
                        )}>
                            <span className="text-8xl drop-shadow-lg animate-in zoom-in duration-500" role="img" aria-label={currentItem.name}>
                                {currentItem.icon}
                            </span>
                            <span className="text-2xl font-bold font-heading bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                {currentItem.name}
                            </span>
                        </Card>
                    )}
                </div>

                {/* Category Bins */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full max-w-3xl mt-4 md:mt-8">
                    {CATEGORIES.map((cat, index) => (
                        <button
                            key={cat.id}
                            onClick={() => handleSort(cat.id)}
                            disabled={gameState.isPaused}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-200 shadow-lg border-b-4 transform active:scale-95 hover:shadow-xl touch-manipulation",
                                cat.color,
                                "text-white border-black/20 font-bold text-sm md:text-lg",
                                "animate-in slide-in-from-bottom duration-300",
                                gameState.isPaused && "opacity-50 cursor-not-allowed"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <span className="drop-shadow-md">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </GameShell>
    );
};

export default NutriSort;
