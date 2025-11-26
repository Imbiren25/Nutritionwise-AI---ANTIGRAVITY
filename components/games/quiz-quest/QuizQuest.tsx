import React, { useState, useEffect, useCallback } from 'react';
import { useGameEngine } from '../../../hooks/useGameEngine';
import GameShell from '../shared/GameShell';
import { QUIZ_QUESTIONS } from '../shared/gameData';
import { Button } from '../../ui/Button';
import { cn } from '@/lib/utils';
import { Card } from '../../ui/Card';
import Progress from '../../ui/Progress';

interface QuizQuestProps {
    config: {
        difficulty: 'easy' | 'medium' | 'hard';
        level: number;
        speedMultiplier: number;
        timeMultiplier: number;
    };
    onExit: () => void;
}

const QuizQuest: React.FC<QuizQuestProps> = ({ config, onExit }) => {
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
        gameId: 'quiz-quest',
        initialTime: 60, // Overall game time? Or maybe just score based? Let's keep overall time as a "session" limit.
        initialLives: config.difficulty === 'hard' ? 1 : config.difficulty === 'medium' ? 2 : 3,
        difficulty: config.difficulty,
        startingLevel: config.level,
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionTimeLeft, setQuestionTimeLeft] = useState(100); // %
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    // Sound
    const playSound = useCallback((type: 'correct' | 'wrong') => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new (AudioContext as any)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'correct') {
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        }
        osc.start(now);
        osc.stop(now + 0.3);
    }, []);

    // Question Timer
    useEffect(() => {
        if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver || feedback) return;

        const timer = setInterval(() => {
            setQuestionTimeLeft(prev => {
                const drop = 1 * config.speedMultiplier; // Faster at higher levels
                if (prev - drop <= 0) {
                    handleAnswer(-1); // Timeout
                    return 0;
                }
                return prev - drop;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, feedback, config.speedMultiplier]);

    const handleAnswer = (optionIndex: number) => {
        if (feedback) return;

        const question = QUIZ_QUESTIONS[currentQuestionIndex % QUIZ_QUESTIONS.length];
        setSelectedOption(optionIndex);

        if (optionIndex === question.a) {
            // Correct
            setFeedback('correct');
            addScore(20 + Math.round(questionTimeLeft / 5)); // Bonus for speed
            playSound('correct');
        } else {
            // Wrong
            setFeedback('wrong');
            loseLife();
            playSound('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedOption(null);
            setQuestionTimeLeft(100);
            setCurrentQuestionIndex(prev => prev + 1);

            // Level up every 5 questions
            if ((currentQuestionIndex + 1) % 5 === 0) {
                nextLevel();
            }
        }, 1500);
    };

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex % QUIZ_QUESTIONS.length];

    if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused && gameState.timeLeft > 0) {
        return (
            <GameShell
                title="Quiz Quest"
                gameState={gameState}
                onPause={pauseGame}
                onResume={resumeGame}
                onRestart={startGame}
                onQuit={onExit}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl animate-bounce">❓🤔💡</div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Quiz Quest
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md text-lg">
                            Answer rapid-fire nutrition questions!
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
            title="Quiz Quest"
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={startGame}
            onQuit={onExit}
        >
            <div className="flex flex-col h-full max-w-2xl mx-auto p-6 justify-center space-y-8">
                {/* Timer Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-muted-foreground">
                        <span>Time</span>
                        <span>{Math.ceil(questionTimeLeft / 10)}s</span>
                    </div>
                    <Progress value={questionTimeLeft} className="h-4" variant={questionTimeLeft < 30 ? "error" : "primary"} />
                </div>

                {/* Question Card */}
                <Card className="p-8 text-center shadow-lg border-2 border-primary/20">
                    <h3 className="text-2xl font-bold leading-relaxed">
                        {currentQuestion.q}
                    </h3>
                </Card>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt, i) => {
                        let variant = "outline";
                        if (feedback && i === currentQuestion.a) variant = "default"; // Show correct answer
                        if (feedback === 'wrong' && i === selectedOption) variant = "destructive"; // Show wrong selection

                        return (
                            <Button
                                key={i}
                                variant={variant as any}
                                onClick={() => handleAnswer(i)}
                                disabled={!!feedback || gameState.isPaused}
                                className={cn(
                                    "h-16 text-lg font-medium transition-all duration-200",
                                    feedback && i === currentQuestion.a && "bg-green-500 hover:bg-green-600 text-white border-green-600",
                                    feedback === 'wrong' && i === selectedOption && "bg-red-500 hover:bg-red-600 text-white"
                                )}
                            >
                                {opt}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </GameShell>
    );
};

export default QuizQuest;
