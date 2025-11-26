import React, { Component, ErrorInfo, ReactNode } from 'react';
import Icon from './Icon';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full border border-border">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="info" className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            We're sorry, but an unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
                            >
                                Go to Home
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <summary className="text-sm font-medium text-foreground cursor-pointer">Error Details</summary>
                                    <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const { children } = (this as any).props;
        return children;
    }
}

export default ErrorBoundary;
