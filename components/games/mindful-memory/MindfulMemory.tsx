import React, { useState, useEffect, useCallback } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { GAME_ITEMS, GameItem } from '../shared/gameData';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';

interface MindfulMemoryProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

interface Card {
    id: number;
    item: GameItem;
    isFlipped: boolean;
    isMatched: boolean;
}

const MindfulMemory: React.FC<MindfulMemoryProps> = ({ config, onExit }) => {
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
        gameId: 'mindful-memory',
        initialTime: Math.round(60 * config.timeMultiplier),
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Sound
    const playSound = useCallback((type: 'flip' | 'match' | 'wrong') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new (AudioContext as any)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'flip') {
            osc.frequency.setValueAtTime(300, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        } else if (type === 'match') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        }
        osc.start(now);
        osc.stop(now + 0.2);
    }, []);

    // Initialize Level
    useEffect(() => {
        if (gameState.isPlaying && cards.length === 0) {
            // Determine grid size based on level
            let pairs = 2 + Math.floor(gameState.level / 2);
            if (pairs > 12) pairs = 12; // Max 24 cards (6x4 or 5x5ish)

            const pool = GAME_ITEMS.filter(i => i.isHealthy);
            const selectedItems = [];
            for (let i = 0; i < pairs; i++) {
                selectedItems.push(pool[i % pool.length]);
            }

            const newCards: Card[] = [...selectedItems, ...selectedItems]
                .map((item, index) => ({
                    id: index,
                    item,
                    isFlipped: false,
                    isMatched: false
                }))
                .sort(() => Math.random() - 0.5);

            setCards(newCards);
            setFlippedIndices([]);
            setIsChecking(false);
        }
    }, [gameState.isPlaying, gameState.level, cards.length]);

    const handleCardClick = (index: number) => {
        if (
            gameState.isPaused ||
            isChecking ||
            cards[index].isFlipped ||
            cards[index].isMatched
        ) return;

        playSound('flip');

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = newFlipped;

            if (cards[firstIndex].item.id === cards[secondIndex].item.id) {
                // Match
                setTimeout(() => {
                    playSound('match');
                    const matchedCards = [...cards];
                    matchedCards[firstIndex].isMatched = true;
                    matchedCards[secondIndex].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    setIsChecking(false);
                    addScore(50);

                    // Check win
                    if (matchedCards.every(c => c.isMatched)) {
                        setTimeout(nextLevel, 1000);
                        setCards([]); // Trigger re-init
                    }
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    playSound('wrong');
                    const resetCards = [...cards];
                    resetCards[firstIndex].isFlipped = false;
                    resetCards[secondIndex].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                    setIsChecking(false);
                    loseLife(); // Optional: lose life on wrong guess? Or just time penalty?
                }, 1000);
            }
        }
    };

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft > 0) {
        return (
            <GameShell
                title="Mindful Memory"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">🧠🥑🥕</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Mindful Memory
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Find the matching pairs of healthy foods!
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
            title="Mindful Memory"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div className="flex items-center justify-center h-full p-4">
                <div className={cn(
                    "grid gap-3 w-full max-w-2xl aspect-square",
                    cards.length <= 16 ? "grid-cols-4" : "grid-cols-5 md:grid-cols-6"
                )}>
                    {cards.map((card, i) => (
                        <button
                            key={card.id}
                            onClick={() => handleCardClick(i)}
                            disabled={card.isMatched || gameState.isPaused}
                            className={cn(
                                "relative rounded-xl flex items-center justify-center text-3xl shadow-md transition-all duration-300 transform perspective-1000",
                                card.isFlipped || card.isMatched ? "rotate-y-180 bg-white border-2 border-primary" : "bg-primary text-primary-foreground hover:bg-primary/90",
                                card.isMatched && "opacity-50 scale-95 border-green-500 bg-green-50"
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center backface-hidden transition-opacity duration-300",
                                card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"
                            )}>
                                {card.item.icon}
                            </div>
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center backface-hidden transition-opacity duration-300",
                                card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"
                            )}>
                                ❓
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </GameShell>
    );
};

export default MindfulMemory;
