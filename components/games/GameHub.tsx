import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GameId } from '../../types/games';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import GameLauncher from './GameLauncher';
import Badge from '../ui/Badge';
import Progress from '../ui/Progress';
import {
    Apple,
    UtensilsCrossed,
    Search,
    Pill,
    Droplets,
    Scale,
    Lock,
    ArrowLeft,
    Trophy,
    Star,
    Medal,
    Crown,
    Target,
    Unlock
} from 'lucide-react';

interface GameConfig {
    id: GameId;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    unlockScore: number;
    unlockMessage: string;
}

const GAMES: GameConfig[] = [
    {
        id: 'nutri-tap',
        title: 'Nutri-Tap',
        description: 'Tap healthy foods quickly while avoiding junk food bombs!',
        icon: Apple,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        unlockScore: 0,
        unlockMessage: 'Available from start'
    },
    {
        id: 'fiber-fall',
        title: 'Fiber Fall',
        description: 'Catch falling fiber-rich foods. Watch out for the wind!',
        icon: UtensilsCrossed,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        unlockScore: 0,
        unlockMessage: 'Available from start'
    },
    {
        id: 'mindful-memory',
        title: 'Mindful Memory',
        description: 'Match pairs of healthy foods before time runs out.',
        icon: Search,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        unlockScore: 500,
        unlockMessage: 'Unlock at 500 points'
    },
    {
        id: 'quiz-quest',
        title: 'Quiz Quest',
        description: 'Answer rapid-fire nutrition questions against the clock.',
        icon: Pill,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        unlockScore: 1000,
        unlockMessage: 'Unlock at 1,000 points'
    },
    {
        id: 'macro-master',
        title: 'Macro Master',
        description: 'Sort foods into Carbohydrates, Proteins, and Fats.',
        icon: Scale,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        unlockScore: 2000,
        unlockMessage: 'Unlock at 2,000 points'
    },
    {
        id: 'hydration-hero',
        title: 'Hydration Hero',
        description: 'Fill the glass to the perfect level. Don\'t spill!',
        icon: Droplets,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-100',
        unlockScore: 3500,
        unlockMessage: 'Unlock at 3,500 points'
    },
];

const GameHub: React.FC = () => {
    const { profile, unlockGame } = useGame();
    const [activeGame, setActiveGame] = useState<GameId | null>(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Mock leaderboard data (in a real app, this would come from a backend)
    const leaderboardData = [
        { rank: 1, name: 'NutriMaster', score: 5420, badge: '👑' },
        { rank: 2, name: 'HealthyEater', score: 4890, badge: '🥇' },
        { rank: 3, name: 'FoodExpert', score: 4320, badge: '🥈' },
        { rank: 4, name: 'You', score: profile.totalScore, badge: '⭐', isCurrentUser: true },
        { rank: 5, name: 'VitaminVic', score: 3210, badge: '🥉' },
        { rank: 6, name: 'PortionPro', score: 2890, badge: '🏅' },
        { rank: 7, name: 'LabelLover', score: 2340, badge: '🎯' },
        { rank: 8, name: 'PlateBuilder', score: 1980, badge: '🍽️' },
    ].sort((a, b) => b.score - a.score).map((item, index) => ({ ...item, rank: index + 1 }));

    const renderActiveGame = () => {
        if (!activeGame) return null;

        return (
            <GameLauncher
                gameId={activeGame}
                onExit={() => setActiveGame(null)}
            />
        );
    }

    if (activeGame) {
        return renderActiveGame();
    }

    const nextUnlock = GAMES.find(game =>
        !profile.unlockedGames.includes(game.id) &&
        profile.totalScore < game.unlockScore
    );

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Nutrition Arcade
                    </h1>
                    <p className="text-muted-foreground mt-1">Play, learn, and earn badges!</p>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-wrap gap-4">
                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Score</p>
                                <p className="text-2xl font-bold text-yellow-700">{profile.totalScore.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Star className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Badges</p>
                                <p className="text-2xl font-bold text-purple-700">{profile.achievements.length}</p>
                            </div>
                        </div>
                    </Card>

                    <Button
                        variant="outline"
                        onClick={() => setShowLeaderboard(!showLeaderboard)}
                        className="h-full"
                    >
                        <Medal className="w-4 h-4 mr-2" />
                        Leaderboard
                    </Button>
                </div>
            </div>

            {/* Leaderboard Section */}
            {showLeaderboard && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6 text-yellow-600" />
                            <h2 className="text-2xl font-bold font-heading">Top Players</h2>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowLeaderboard(false)}>
                            Close
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {leaderboardData.slice(0, 8).map((player) => (
                            <div
                                key={player.rank}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg transition-all",
                                    player.isCurrentUser
                                        ? "bg-primary/10 border-2 border-primary shadow-md"
                                        : "bg-white/50 hover:bg-white/80"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                        player.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                            player.rank === 2 ? "bg-gray-100 text-gray-700" :
                                                player.rank === 3 ? "bg-orange-100 text-orange-700" :
                                                    "bg-blue-50 text-blue-700"
                                    )}>
                                        {player.rank}
                                    </div>
                                    <span className="text-2xl">{player.badge}</span>
                                    <span className={cn(
                                        "font-medium",
                                        player.isCurrentUser && "font-bold text-primary"
                                    )}>
                                        {player.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                    <span className="font-bold text-lg">{player.score.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Next Unlock Progress */}
            {nextUnlock && (
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-in fade-in duration-500">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                                    Next Unlock: {nextUnlock.title}
                                    <Badge className="bg-green-600 text-white">
                                        {nextUnlock.unlockScore.toLocaleString()} pts
                                    </Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Keep playing to unlock this game!
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Progress</span>
                                    <span className="text-muted-foreground">
                                        {profile.totalScore.toLocaleString()} / {nextUnlock.unlockScore.toLocaleString()}
                                    </span>
                                </div>
                                <Progress
                                    value={(profile.totalScore / nextUnlock.unlockScore) * 100}
                                    className="h-3"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {(nextUnlock.unlockScore - profile.totalScore).toLocaleString()} points to go!
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Games Grid */}
            <div>
                <h2 className="text-2xl font-bold font-heading mb-4">Available Games</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map((game) => {
                        const isUnlocked = profile.unlockedGames.includes(game.id) || profile.totalScore >= game.unlockScore;
                        const GameIcon = game.icon;
                        const pointsNeeded = Math.max(0, game.unlockScore - profile.totalScore);

                        return (
                            <Card
                                key={game.id}
                                className={cn(
                                    "relative overflow-hidden transition-all duration-300 hover:shadow-xl group border-2",
                                    isUnlocked
                                        ? "border-transparent hover:border-primary/30 hover:-translate-y-1"
                                        : "opacity-70 bg-muted/30 border-dashed border-muted-foreground/20"
                                )}
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
                                            game.bgColor,
                                            isUnlocked && "shadow-md group-hover:shadow-lg"
                                        )}>
                                            <GameIcon className={cn("w-8 h-8", game.color)} />
                                        </div>
                                        {!isUnlocked && (
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="p-2 rounded-full bg-muted">
                                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {pointsNeeded.toLocaleString()} pts
                                                </Badge>
                                            </div>
                                        )}
                                        {isUnlocked && !profile.unlockedGames.includes(game.id) && (
                                            <Badge className="bg-green-600 text-white animate-pulse">
                                                <Unlock className="w-3 h-3 mr-1" />
                                                New!
                                            </Badge>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-2 font-heading">{game.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {game.description}
                                        </p>
                                    </div>

                                    {!isUnlocked && (
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Unlock Progress</span>
                                                <span className="font-medium">
                                                    {Math.min(100, Math.round((profile.totalScore / game.unlockScore) * 100))}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={(profile.totalScore / game.unlockScore) * 100}
                                                className="h-2"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-4 flex items-center justify-between border-t">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {isUnlocked ? 'High Score' : 'Unlock At'}
                                            </span>
                                            <span className="text-lg font-bold text-foreground">
                                                {isUnlocked
                                                    ? (profile.highScores[game.id]?.toLocaleString() || 0)
                                                    : game.unlockScore.toLocaleString()
                                                }
                                            </span>
                                        </div>
                                        <Button
                                            disabled={!isUnlocked}
                                            variant={isUnlocked ? "default" : "secondary"}
                                            size="sm"
                                            onClick={() => setActiveGame(game.id)}
                                            className={cn(
                                                "transition-all duration-200",
                                                isUnlocked && "hover:scale-105 shadow-md hover:shadow-lg"
                                            )}
                                        >
                                            {isUnlocked ? "Play Now" : "Locked"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Decorative gradient overlay for unlocked games */}
                                {isUnlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GameHub;
