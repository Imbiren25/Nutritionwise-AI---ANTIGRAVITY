import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';
import { Droplets } from 'lucide-react';

interface HydrationHeroProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

const HydrationHero: React.FC<HydrationHeroProps> = ({ config, onExit }) => {
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
        gameId: 'hydration-hero',
        initialTime: Math.round(60 * config.timeMultiplier),
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [waterLevel, setWaterLevel] = useState(0); // %
    const [isFilling, setIsFilling] = useState(false);
    const [targetZone, setTargetZone] = useState({ bottom: 70, top: 80 });
    const [feedback, setFeedback] = useState<'perfect' | 'spill' | 'low' | null>(null);
    const requestRef = useRef<number>();

    // Sound
    const playSound = useCallback((type: 'fill' | 'success' | 'spill') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new (AudioContext as any)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'fill') {
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(400, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        }
        osc.start(now);
        osc.stop(now + (type === 'fill' ? 0.1 : 0.3));
    }, []);

    // New Round
    const startRound = useCallback(() => {
        setWaterLevel(0);
        setFeedback(null);
        // Randomize target zone slightly
        const size = Math.max(5, 15 - (config.level * 0.5)); // Zone gets smaller
        const bottom = 50 + Math.random() * (90 - size - 50);
        setTargetZone({ bottom, top: bottom + size });
    }, [config.level]);

    useEffect(() => {
        if (gameState.isPlaying && !gameState.isPaused && !feedback) {
            startRound();
        }
    }, [gameState.isPlaying, startRound]);

    // Fill Loop
    const update = useCallback(() => {
        if (isFilling && !feedback && !gameState.isPaused) {
            setWaterLevel(prev => {
                const speed = (0.5 + Math.random() * 0.5) * config.speedMultiplier; // Erratic speed
                const next = prev + speed;
                if (next >= 100) {
                    setIsFilling(false);
                    handleStop(100);
                    return 100;
                }
                return next;
            });
            requestRef.current = requestAnimationFrame(update);
        }
    }, [isFilling, feedback, gameState.isPaused, config.speedMultiplier]);

    useEffect(() => {
        if (isFilling) {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isFilling, update]);

    const handleStart = () => {
        if (feedback || gameState.isPaused) return;
        setIsFilling(true);
        // playSound('fill'); // Continuous sound would be better, but simple trigger for now
    };

    const handleStop = (finalLevel?: number) => {
        setIsFilling(false);
        const level = finalLevel ?? waterLevel;

        if (level > targetZone.top) {
            // Spill
            setFeedback('spill');
            loseLife();
            playSound('spill');
            setTimeout(startRound, 1500);
        } else if (level >= targetZone.bottom) {
            // Perfect
            setFeedback('perfect');
            addScore(100);
            playSound('success');
            if (gameState.score > 0 && gameState.score % 300 === 0) nextLevel();
            setTimeout(startRound, 1500);
        } else {
            // Low
            setFeedback('low');
            // No penalty, just retry? Or maybe small score deduction?
            setTimeout(startRound, 1000);
        }
    };

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft > 0) {
        return (
            <GameShell
                title="Hydration Hero"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">💧🥛🧊</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                            Hydration Hero
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Fill the glass to the target line. Don't spill!
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
            title="Hydration Hero"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
                {/* Glass Container */}
                <div className="relative w-48 h-80 border-4 border-t-0 border-white/50 bg-white/10 rounded-b-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                    {/* Target Zone */}
                    <div
                        className="absolute w-full bg-green-500/20 border-y-2 border-green-400/50 z-10 flex items-center justify-center"
                        style={{
                            bottom: `${targetZone.bottom}%`,
                            height: `${targetZone.top - targetZone.bottom}%`
                        }}
                    >
                        <span className="text-green-200 font-bold text-xs tracking-widest uppercase">Target</span>
                    </div>

                    {/* Water */}
                    <div
                        className={cn(
                            "absolute bottom-0 w-full bg-cyan-500 transition-all duration-75 ease-linear",
                            feedback === 'spill' && "bg-red-500",
                            feedback === 'perfect' && "bg-green-500"
                        )}
                        style={{ height: `${waterLevel}%` }}
                    >
                        {/* Wave effect */}
                        <div className="absolute top-0 w-full h-2 bg-white/30 animate-pulse" />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    {feedback ? (
                        <div className={cn(
                            "text-2xl font-bold animate-in zoom-in",
                            feedback === 'perfect' ? "text-green-500" : feedback === 'spill' ? "text-red-500" : "text-yellow-500"
                        )}>
                            {feedback === 'perfect' ? "Perfect!" : feedback === 'spill' ? "Spilled!" : "Too Low!"}
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="w-48 h-20 text-xl font-bold rounded-full shadow-lg active:scale-95 transition-transform touch-none"
                            onMouseDown={handleStart}
                            onMouseUp={() => handleStop()}
                            onMouseLeave={() => isFilling && handleStop()}
                            onTouchStart={handleStart}
                            onTouchEnd={() => handleStop()}
                        >
                            {isFilling ? "Filling..." : "Hold to Fill"}
                        </Button>
                    )}
                </div>
            </div>
        </GameShell>
    );
};

export default HydrationHero;
