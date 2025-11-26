import React, { useState } from 'react';
import Logo from './Logo';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { Label } from './ui/Label';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../services/firebase';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewPasswordProps {
    oobCode: string;
    onNavigate: (flow: 'login' | 'landing') => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ oobCode, onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) return;

        if (!auth) {
            setError('Firebase is not initialized.');
            return;
        }

        setIsLoading(true);

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setSuccessMessage('Password has been reset successfully! You can now log in with your new password.');
            setTimeout(() => {
                onNavigate('login');
            }, 3000);
        } catch (err: any) {
            console.error('Reset Password Error:', err);
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-md space-y-6">
                {/* Back Link */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('login')}
                    className="pl-0 hover:bg-transparent hover:text-primary"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Button>

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                        <Logo className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Set New Password
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <Card className="border-muted/60 shadow-lg">
                    <CardContent className="pt-6">
                        {successMessage ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Success!</h3>
                                <p className="text-muted-foreground">{successMessage}</p>
                                <Button
                                    className="w-full"
                                    onClick={() => onNavigate('login')}
                                >
                                    Go to Login
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewPassword;
