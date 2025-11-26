import React, { useState } from 'react';
import Logo from './Logo';
import GoogleIcon from './GoogleIcon';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Label } from './ui/Label';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { cn } from '@/lib/utils';
import { ChevronLeft, AlertCircle } from 'lucide-react';

interface SignUpProps {
    onSignUp: (data: any) => Promise<{ success: boolean; message: string }>;
    onNavigate: (flow: 'login' | 'landing') => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const handleGoogleSignup = async () => {
        if (!auth) {
            setGeneralError('Firebase is not configured. Google Sign Up is unavailable.');
            return;
        }

        setIsLoading(true);
        setGeneralError('');

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log('Google Signup Successful');
        } catch (err: any) {
            console.error('Google Signup Error:', err);
            if (err.code === 'auth/unauthorized-domain') {
                setGeneralError('Domain not authorized. Please add "localhost" to Authorized Domains in Firebase Console.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                setGeneralError('Sign up cancelled.');
            } else {
                setGeneralError(err.message || 'Failed to sign up with Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'You must agree to the Terms and Privacy Policy';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const result = await onSignUp(formData);
            if (!result.success) {
                setGeneralError(result.message);
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
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
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to NutritionWise</h1>
                    <p className="text-muted-foreground">Create your account to get started</p>
                </div>

                <Card className="border-muted/60 shadow-lg">
                    <CardContent className="pt-6 space-y-6">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full font-medium"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                        >
                            <GoogleIcon className="mr-2 h-5 w-5" />
                            Sign up with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or sign up with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                    className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Minimum 6 characters"
                                    className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Re-enter your password"
                                    className={cn(errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={e => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-medium">Privacy Policy</a> and <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-medium">Terms of Use</a>.
                                    </span>
                                </label>
                                {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked={true}
                                        className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        I consent to the processing of my information for academic and educational purposes.
                                    </span>
                                </label>
                            </div>

                            {generalError && (
                                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {generalError}
                                </div>
                            )}

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t bg-muted/20 py-4">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <button onClick={() => onNavigate('login')} className="font-semibold text-primary hover:underline">
                                Log In
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
export default SignUp;