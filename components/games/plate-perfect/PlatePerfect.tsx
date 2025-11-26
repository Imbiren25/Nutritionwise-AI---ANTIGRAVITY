import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import Badge from '../../ui/Badge';
import Progress from '../../ui/Progress';
import { cn } from '@/lib/utils';

interface FoodTile {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    icon: string;
}

const FOOD_TILES: FoodTile[] = [
    { id: 'rice', name: 'Rice', calories: 130, protein: 2, carbs: 28, fats: 0, icon: '🍚' },
    { id: 'chicken', name: 'Chicken', calories: 165, protein: 31, carbs: 0, fats: 4, icon: '🍗' },
    { id: 'broccoli', name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fats: 1, icon: '🥦' },
    { id: 'egg', name: 'Egg', calories: 78, protein: 6, carbs: 1, fats: 5, icon: '🥚' },
    { id: 'avocado', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, icon: '🥑' },
    { id: 'banana', name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, icon: '🍌' },
];

interface LevelGoal {
    calories: number;
    protein: number;
    tolerance: number;
}

interface PlatePerfectProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
    };
    onExit: () => void;
}

const PlatePerfect: React.FC<PlatePerfectProps> = ({ config, onExit }) => {
    const {
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        endGame,
        nextLevel,
        addScore,
    } = useGameEngine({
        gameId: 'plate-perfect',
        initialTime: Math.max(45, 90 - (config.level * 3)), // Time decreases with level
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [selectedFoods, setSelectedFoods] = useState<FoodTile[]>([]);
    const [goal, setGoal] = useState<LevelGoal>({ calories: 500, protein: 30, tolerance: 10 });
    const [showSuccess, setShowSuccess] = useState(false);

    const totals = selectedFoods.reduce(
        (acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fats: acc.fats + food.fats,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const isGoalMet =
        Math.abs(totals.calories - goal.calories) <= goal.tolerance &&
        totals.protein >= goal.protein;

    const addFood = (food: FoodTile) => {
        if (selectedFoods.length < 6) {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const removeFood = (index: number) => {
        setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
    };

    const submitPlate = () => {
        if (isGoalMet) {
            const bonus = selectedFoods.length <= 4 ? 50 : 0;
            addScore(100 + bonus);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedFoods([]);
                setGoal({
                    calories: goal.calories + 50,
                    protein: goal.protein + 5,
                    tolerance: 10,
                });
                nextLevel();
            }, 2000);
        }
    };

    if (!gameState.isPlaying && !gameState.isGameOver && gameState.timeLeft === 90) {
        return (
            <GameShell
                title="Plate Perfect"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">🍽️</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Build the Perfect Plate!
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Select foods to meet the nutritional goals.
                            <br />
                            <span className="text-sm">Fewer items = bonus points! 🎯</span>
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={startGame}
                        className="text-xl px-10 py-7 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Start Cooking
                    </Button>
                </div>
            </GameShell>
        );
    }

    return (
        <GameShell
            title="Plate Perfect"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={() => { }}
        >
            <div className="flex flex-col h-full p-6 space-y-6">
                {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="text-center space-y-4 animate-in zoom-in duration-500">
                            <div className="text-9xl">🎉</div>
                            <h3 className="text-4xl font-bold text-white">Perfect Plate!</h3>
                        </div>
                    </div>
                )}

                {/* Goal Display */}
                <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
                    <h3 className="text-xl font-bold mb-4">Nutritional Goals</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Calories</span>
                                <span className={cn(
                                    "font-bold",
                                    Math.abs(totals.calories - goal.calories) <= goal.tolerance ? "text-green-600" : "text-gray-600"
                                )}>
                                    {totals.calories} / {goal.calories}
                                </span>
                            </div>
                            <Progress value={(totals.calories / goal.calories) * 100} className="h-3" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Protein</span>
                                <span className={cn(
                                    "font-bold",
                                    totals.protein >= goal.protein ? "text-green-600" : "text-gray-600"
                                )}>
                                    {totals.protein}g / {goal.protein}g
                                </span>
                            </div>
                            <Progress value={(totals.protein / goal.protein) * 100} className="h-3" />
                        </div>
                    </div>
                </Card>

                {/* Selected Foods Plate */}
                <Card className="p-6 min-h-[200px] bg-gradient-to-br from-white to-gray-50">
                    <h3 className="text-lg font-bold mb-4">Your Plate ({selectedFoods.length}/6)</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {selectedFoods.map((food, index) => (
                            <div
                                key={`${food.id}-${index}`}
                                onClick={() => removeFood(index)}
                                className="relative p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-red-400 transition-all transform hover:scale-105 animate-in zoom-in duration-300"
                            >
                                <div className="text-4xl text-center mb-2">{food.icon}</div>
                                <div className="text-xs text-center font-medium">{food.name}</div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                                    ×
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Available Foods */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-4">Available Foods</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {FOOD_TILES.map((food) => (
                            <button
                                key={food.id}
                                onClick={() => addFood(food)}
                                disabled={selectedFoods.length >= 6}
                                className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="text-4xl text-center mb-2">{food.icon}</div>
                                <div className="text-xs text-center font-medium">{food.name}</div>
                                <div className="text-[10px] text-center text-gray-500 mt-1">
                                    {food.calories}cal
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={submitPlate}
                    disabled={!isGoalMet || selectedFoods.length === 0}
                    size="lg"
                    className="w-full text-lg py-6 rounded-xl shadow-lg disabled:opacity-50"
                >
                    {isGoalMet ? "✓ Submit Perfect Plate!" : "Keep Building..."}
                </Button>
            </div>
        </GameShell>
    );
};

export default PlatePerfect;
