import React from 'react';
import { GameState, GameId } from '../../../types/games';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import Icon from '../../Icon';
import { cn } from '@/lib/utils';

interface GameShellProps {
    title: string;
    gameState: GameState;
    onPause: () => void;
    onResume: () => void;
    onRestart: () => void;
    onQuit: () => void;
    children: React.ReactNode;
}

const GameShell: React.FC<GameShellProps> = ({
    title,
    gameState,
    onPause,
    onResume,
    onRestart,
    onQuit,
    children
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-[85vh] md:h-[650px] max-w-4xl mx-auto p-2 md:p-6 space-y-2 md:space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-card p-2 md:p-4 rounded-xl border shadow-sm shrink-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" onClick={onQuit} className="h-8 w-8 md:h-10 md:w-10">
                        <Icon name="arrowBack" className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <div>
                        <h2 className="font-bold font-heading text-base md:text-lg leading-none">{title}</h2>
                        <span className="text-[10px] md:text-xs text-muted-foreground">Level {gameState.level}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Score</span>
                        <span className="font-mono text-lg md:text-xl font-bold text-primary">{gameState.score.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col items-center w-12 md:w-16">
                        <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Time</span>
                        <span className={cn("font-mono text-lg md:text-xl font-bold", gameState.timeLeft < 10 ? "text-destructive animate-pulse" : "text-foreground")}>
                            {formatTime(gameState.timeLeft)}
                        </span>
                    </div>

                    <div className="hidden md:flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Icon
                                key={i}
                                name="heart"
                                className={cn("w-5 h-5 transition-colors", i < gameState.lives ? "text-red-500 fill-red-500" : "text-muted/20")}
                            />
                        ))}
                    </div>
                    {/* Mobile Lives */}
                    <div className="flex md:hidden items-center gap-1">
                        <Icon name="heart" className="w-4 h-4 text-red-500 fill-red-500" />
                        <span className="font-bold text-sm">{gameState.lives}</span>
                    </div>

                    <Button variant="ghost" size="icon" onClick={gameState.isPaused ? onResume : onPause} className="h-8 w-8 md:h-10 md:w-10">
                        <Icon name={gameState.isPaused ? "play" : "pause"} className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative flex-1 bg-muted/10 rounded-xl md:rounded-2xl border overflow-hidden flex flex-col">
                {children}

                {/* Overlays */}
                {(gameState.isPaused || gameState.isGameOver) && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <Card className="w-full max-w-sm p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-center">
                                <div className={cn("p-4 rounded-full", gameState.isGameOver ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                                    <Icon name={gameState.isGameOver ? "close" : "pause"} className="w-12 h-12" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold font-heading">
                                    {gameState.isGameOver ? "Game Over" : "Paused"}
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    {gameState.isGameOver
                                        ? `You reached Level ${gameState.level} with ${gameState.score} points!`
                                        : "Take a break and hydrate!"}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {!gameState.isGameOver && (
                                    <Button className="w-full" size="lg" onClick={onResume}>
                                        Resume Game
                                    </Button>
                                )}
                                <Button variant={gameState.isGameOver ? "default" : "outline"} className="w-full" size="lg" onClick={onRestart}>
                                    {gameState.isGameOver ? "Try Again" : "Restart Level"}
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={onQuit}>
                                    Quit to Menu
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameShell;
