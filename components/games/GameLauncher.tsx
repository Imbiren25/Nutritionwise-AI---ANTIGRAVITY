import React, { useState } from 'react';
import { GameId, Difficulty, LevelConfig } from '../../types/games';
import { useGameEngine } from '../../hooks/useGameEngine';
import NutriSort from './nutri-sort/NutriSort';
import NutriTap from './nutri-tap/NutriTap';
import FiberFall from './fiber-fall/FiberFall';
import MindfulMemory from './mindful-memory/MindfulMemory';
import QuizQuest from './quiz-quest/QuizQuest';
import HydrationHero from './hydration-hero/HydrationHero';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowLeft, Lock, Star, Play, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '../../context/GameContext';

interface GameLauncherProps {
    gameId: GameId;
    onExit: () => void;
}

type LauncherStep = 'difficulty' | 'level-map' | 'instructions' | 'playing';

const GameLauncher: React.FC<GameLauncherProps> = ({ gameId, onExit }) => {
    const { profile } = useGame();
    const [step, setStep] = useState<LauncherStep>('difficulty');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);

    const GAME_INSTRUCTIONS: Record<GameId, { title: string; description: string; instructions: string[] }> = {
        'nutri-tap': {
            title: "Nutri Tap",
            description: "Test your reflexes and nutrition knowledge!",
            instructions: [
                "Healthy food items will pop up on the screen.",
                "Tap the healthy items to earn points.",
                "Avoid tapping unhealthy items or bombs!",
                "Be quick before they disappear."
            ]
        },
        'fiber-fall': {
            title: "Fiber Fall",
            description: "Catch the fiber-rich foods!",
            instructions: [
                "Move the basket left and right.",
                "Catch falling fruits, vegetables, and whole grains.",
                "Avoid sugary snacks and processed foods.",
                "Don't let too many healthy items fall!"
            ]
        },
        'mindful-memory': {
            title: "Mindful Memory",
            description: "Match the nutrient pairs.",
            instructions: [
                "Tap cards to flip them over.",
                "Find matching pairs of food items or nutrients.",
                "Clear the board as fast as you can.",
                "Memorize card locations to improve your score."
            ]
        },
        'quiz-quest': {
            title: "Quiz Quest",
            description: "Challenge your nutrition trivia.",
            instructions: [
                "Read the question carefully.",
                "Select the correct answer from the options.",
                "Earn points for correct answers.",
                "Learn new facts about healthy eating."
            ]
        },
        'macro-master': {
            title: "Macro Master",
            description: "Sort foods into the correct macronutrient categories.",
            instructions: [
                "Food items will appear on the screen.",
                "Drag and drop them into the correct bin: Carbs, Proteins, or Fats.",
                "Sort quickly and accurately to maximize your score.",
                "Watch out for tricky items!"
            ]
        },
        'hydration-hero': {
            title: "Hydration Hero",
            description: "Stay hydrated and healthy!",
            instructions: [
                "Help the character drink enough water.",
                "Collect water droplets and hydrating foods.",
                "Avoid dehydrating drinks like soda and excessive caffeine.",
                "Keep the hydration meter full!"
            ]
        }
    };

    const handleDifficultySelect = (diff: Difficulty) => {
        setDifficulty(diff);
        setStep('level-map');
    };

    const handleLevelSelect = (level: number) => {
        setSelectedLevel(level);
        setStep('instructions');
    };

    const handleStartGame = () => {
        setStep('playing');
    };

    const handleGameExit = () => {
        setStep('level-map');
    };

    const renderInstructions = () => {
        const instructions = GAME_INSTRUCTIONS[gameId];
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-in fade-in zoom-in duration-300 p-6">
                <Card className="max-w-2xl w-full p-8 space-y-6 border-2 border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold font-heading text-primary">{instructions.title}</h2>
                        <p className="text-lg text-muted-foreground">{instructions.description}</p>
                    </div>

                    <div className="space-y-4 bg-muted/30 p-6 rounded-xl border border-border/50">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Play className="w-5 h-5 text-primary" />
                            How to Play
                        </h3>
                        <ul className="space-y-3">
                            {instructions.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span>{instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep('level-map')}>
                            Back
                        </Button>
                        <Button size="lg" className="flex-1 font-bold text-lg" onClick={handleStartGame}>
                            Start Game
                        </Button>
                    </div>
                </Card>
            </div>
        );
    };

    const renderDifficultySelection = () => (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-heading">Select Difficulty</h2>
                <p className="text-muted-foreground">Choose your challenge level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <Card
                        key={diff}
                        className={cn(
                            "p-8 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2",
                            diff === 'easy' ? "hover:border-green-500 bg-green-50/50" :
                                diff === 'medium' ? "hover:border-yellow-500 bg-yellow-50/50" :
                                    "hover:border-red-500 bg-red-50/50"
                        )}
                        onClick={() => handleDifficultySelect(diff)}
                    >
                        <div className={cn(
                            "p-4 rounded-full",
                            diff === 'easy' ? "bg-green-100 text-green-600" :
                                diff === 'medium' ? "bg-yellow-100 text-yellow-600" :
                                    "bg-red-100 text-red-600"
                        )}>
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold capitalize mb-2">{diff}</h3>
                            <p className="text-sm text-muted-foreground">
                                {diff === 'easy' ? "Multiplier 1.0x • Forgiving" :
                                    diff === 'medium' ? "Multiplier 1.5x • Faster" :
                                        "Multiplier 2.0x • Intense"}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <Button variant="ghost" onClick={onExit} className="mt-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lobby
            </Button>
        </div>
    );

    const renderLevelMap = () => {
        const maxUnlockedLevel = (profile.completedLevels[gameId]?.[difficulty] || 0) + 1;
        const levels = Array.from({ length: 100 }, (_, i) => i + 1);

        return (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between px-4">
                    <Button variant="ghost" onClick={() => setStep('difficulty')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-heading capitalize">{difficulty} Levels</h2>
                        <p className="text-sm text-muted-foreground">Select a level to start</p>
                    </div>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>

                <div className="grid grid-cols-5 md:grid-cols-10 gap-3 p-4 max-w-5xl mx-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {levels.map((level) => {
                        const isLocked = level > maxUnlockedLevel;
                        const isCompleted = level < maxUnlockedLevel;

                        return (
                            <button
                                key={level}
                                disabled={isLocked}
                                onClick={() => handleLevelSelect(level)}
                                className={cn(
                                    "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200",
                                    isLocked
                                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                        : isCompleted
                                            ? "bg-primary text-primary-foreground shadow-md hover:scale-105"
                                            : "bg-white border-2 border-primary text-primary shadow-lg hover:scale-110 animate-pulse",
                                )}
                            >
                                {isLocked ? (
                                    <Lock className="w-5 h-5" />
                                ) : (
                                    <>
                                        <span className="text-lg font-bold">{level}</span>
                                        {isCompleted && (
                                            <div className="flex gap-0.5 mt-1">
                                                <Star className="w-2 h-2 fill-current" />
                                                <Star className="w-2 h-2 fill-current" />
                                                <Star className="w-2 h-2 fill-current" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderGame = () => {
        // Difficulty Factors
        const difficultyFactors = {
            easy: {
                speedBase: 0.5,
                speedGrowth: 0.02,
                targetBase: 0.5,
                targetGrowth: 0.05,
                timeBase: 1.5,
                timeDecay: 0.01,
            },
            medium: {
                speedBase: 1.0,
                speedGrowth: 0.05,
                targetBase: 1.0,
                targetGrowth: 0.1,
                timeBase: 1.0,
                timeDecay: 0.05,
            },
            hard: {
                speedBase: 1.5,
                speedGrowth: 0.08,
                targetBase: 1.5,
                targetGrowth: 0.15,
                timeBase: 0.8,
                timeDecay: 0.08,
            }
        };

        const factors = difficultyFactors[difficulty];

        // Dynamic Lerp-like calculation (Linear growth/decay)
        let speedMultiplier = factors.speedBase + (factors.speedGrowth * selectedLevel);
        let targetMultiplier = factors.targetBase + (factors.targetGrowth * selectedLevel);
        let timeMultiplier = Math.max(0.5, factors.timeBase - (factors.timeDecay * (selectedLevel * 0.1))); // Slower decay for time

        // Game Specific Tuning
        if (gameId === 'nutri-tap' && difficulty === 'easy') {
            speedMultiplier *= 0.8; // Reduced spawn speed
            timeMultiplier *= 1.2;  // Increased time limit
        }
        if (gameId === 'fiber-fall' && difficulty === 'easy' && selectedLevel < 10) {
            speedMultiplier *= 0.6; // Significantly slowed down in early levels
        }
        if (gameId === 'mindful-memory') {
            if (difficulty === 'easy') {
                timeMultiplier *= 1.3; // Increased time per pair
            }
        }
        if (gameId === 'quiz-quest' && difficulty === 'easy') {
            timeMultiplier *= 1.5; // Increased time per question
        }

        const config = {
            difficulty,
            level: selectedLevel,
            speedMultiplier,
            targetMultiplier,
            timeMultiplier,
        };



        // ... (inside renderGame)

        switch (gameId) {
            case 'macro-master':
                // Reusing NutriSort logic for Macro Master as it fits the "sorting" mechanic
                return <NutriSort config={config} onExit={handleGameExit} />;
            case 'nutri-tap':
                return <NutriTap config={config} onExit={handleGameExit} />;
            case 'fiber-fall':
                return <FiberFall config={config} onExit={handleGameExit} />;
            case 'mindful-memory':
                return <MindfulMemory config={config} onExit={handleGameExit} />;
            case 'quiz-quest':
                return <QuizQuest config={config} onExit={handleGameExit} />;
            case 'hydration-hero':
                return <HydrationHero config={config} onExit={handleGameExit} />;
            default:
                return <div>Game not implemented yet</div>;
        }
    };

    return (
        <div className="h-full w-full bg-background">
            {step === 'difficulty' && renderDifficultySelection()}
            {step === 'level-map' && renderLevelMap()}
            {step === 'instructions' && renderInstructions()}
            {step === 'playing' && renderGame()}
        </div>
    );
};

export default GameLauncher;
