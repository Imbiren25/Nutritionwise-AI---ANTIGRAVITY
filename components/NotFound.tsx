import React from 'react';
import Icon from './Icon';

interface NotFoundProps {
    onNavigate: (page: 'home') => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full border border-border">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold text-muted-foreground">404</span>
                </div>
                <h1 className="text-2xl font-bold text-heading mb-2">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                    <Icon name="home" className="w-5 h-5 mr-2" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
