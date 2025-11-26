import React, { useState } from 'react';
import Logo from './Logo';
import GoogleIcon from './GoogleIcon';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Label } from './ui/Label';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { cn } from '@/lib/utils';
import { ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  onResetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  onNavigate: (flow: 'signup' | 'landing') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onResetPassword, onNavigate }) => {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError('Firebase is not configured. Google Login is unavailable.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Google Login Successful');
    } catch (err: any) {
      console.error('Google Login Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized. Please add "localhost" to Authorized Domains in Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage(null);

    try {
      const result = await onResetPassword(resetEmail);
      setResetMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    } catch (error) {
      setResetMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
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
          onClick={() => onNavigate('landing')}
          className="pl-0 hover:bg-transparent hover:text-primary"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Logo className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isResetMode ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isResetMode ? 'Enter your email to receive a reset link' : 'Sign in to your NutritionWise account'}
          </p>
        </div>

        <Card className="border-muted/60 shadow-lg">
          <CardContent className="pt-6">
            {!isResetMode ? (
              <div className="space-y-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-medium"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setResetEmail(email);
                          setResetMessage(null);
                        }}
                        className="text-sm font-medium text-primary hover:underline py-2 px-2 -mr-2 min-h-[44px] flex items-center touch-manipulation"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                {resetMessage && (
                  <div className={cn(
                    "p-3 rounded-md text-sm font-medium flex items-center gap-2",
                    resetMessage.type === 'success' ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"
                  )}>
                    {resetMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {resetMessage.text}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsResetMode(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            )}
          </CardContent>
          {!isResetMode && (
            <CardFooter className="justify-center border-t bg-muted/20 py-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="font-semibold text-primary hover:underline"
                >
                  Create free account
                </button>
              </p>
            </CardFooter>
          )}
        </Card>


      </div>
    </div>
  );
};

export default Login;