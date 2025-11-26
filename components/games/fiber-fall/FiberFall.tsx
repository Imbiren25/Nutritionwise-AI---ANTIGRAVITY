import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { GAME_ITEMS, GameItem } from '../shared/gameData';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';
import { ShoppingBasket } from 'lucide-react';

interface FiberFallProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

interface FallingItem {
    id: number;
    item: GameItem;
    x: number; // %
    y: number; // %
    speed: number;
    drift: number;
}

const FiberFall: React.FC<FiberFallProps> = ({ config, onExit }) => {
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
        gameId: 'fiber-fall',
        initialTime: Math.round(60 * config.timeMultiplier),
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [basketX, setBasketX] = useState(50); // %
    const [items, setItems] = useState<FallingItem[]>([]);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    // Sound
    const playSound = useCallback((type: 'catch' | 'bad') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new (AudioContext as any)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'catch') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        }
        osc.start(now);
        osc.stop(now + 0.2);
    }, []);

    // Controls
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (gameState.isPaused || !gameAreaRef.current) return;

        const rect = gameAreaRef.current.getBoundingClientRect();
        let clientX;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as React.MouseEvent).clientX;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(5, Math.min(95, x)));
    };

    // Game Loop
    const update = useCallback((time: number) => {
        if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
            lastTimeRef.current = undefined;
            return;
        }

        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // Spawn
        if (Math.random() < 0.02 * config.speedMultiplier) {
            const pool = GAME_ITEMS.filter(i => i.isFiberRich !== undefined); // Only items where fiber status matters
            const item = pool[Math.floor(Math.random() * pool.length)];
            setItems(prev => [...prev, {
                id: Date.now() + Math.random(),
                item,
                x: Math.random() * 90 + 5,
                y: -10,
                speed: (0.2 + Math.random() * 0.3) * config.speedMultiplier,
                drift: (Math.random() - 0.5) * (config.level > 5 ? 0.2 : 0) // Wind effect at higher levels
            }]);
        }

        setItems(prev => {
            const nextItems: FallingItem[] = [];

            prev.forEach(item => {
                // Move
                let newY = item.y + item.speed * (deltaTime / 16);
                let newX = item.x + item.drift * (deltaTime / 16);

                // Bounce off walls
                if (newX < 0 || newX > 100) item.drift *= -1;

                // Collision
                if (newY > 85 && newY < 95 && Math.abs(newX - basketX) < 10) {
                    // Caught
                    if (item.item.isFiberRich) {
                        addScore(10);
                        playSound('catch');
                        if (gameState.score > 0 && gameState.score % 100 === 0) nextLevel();
                    } else {
                        loseLife();
                        playSound('bad');
                    }
                } else if (newY > 100) {
                    // Missed
                    // Maybe lose life if it was fiber? For now, just disappear.
                } else {
                    nextItems.push({ ...item, y: newY, x: newX });
                }
            });

            return nextItems;
        });

        requestRef.current = requestAnimationFrame(update);
    }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, config, basketX, addScore, loseLife, nextLevel, playSound]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [update]);

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft > 0) {
        return (
            <GameShell
                title="Fiber Fall"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">🧺🥦🥕</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Fiber Fall
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Catch the fiber-rich foods! Avoid the junk!
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
            title="Fiber Fall"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div
                ref={gameAreaRef}
                className="relative w-full h-full overflow-hidden touch-none cursor-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
            >
                {/* Basket */}
                <div
                    className="absolute bottom-4 w-20 h-12 -ml-10 flex items-center justify-center transition-transform duration-75"
                    style={{ left: `${basketX}%` }}
                >
                    <ShoppingBasket className="w-full h-full text-primary" />
                    <div className="absolute -top-2 w-16 h-2 bg-primary/20 rounded-full blur-sm" />
                </div>

                {/* Items */}
                {items.map(item => (
                    <div
                        key={item.id}
                        className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 transition-transform will-change-transform"
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    >
                        {item.item.icon}
                    </div>
                ))}
            </div>
        </GameShell>
    );
};

export default FiberFall;
