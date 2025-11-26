import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface InactivityWarningModalProps {
    onStay: () => void;
    onLogout: () => void;
}

const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({ onStay, onLogout }) => {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-dimmer)] backdrop-blur-sm z-50 p-4">
            <div className="w-full max-w-md bg-[var(--bg-modal)] rounded-2xl shadow-xl p-8 animate-fade-in text-center">
                <Icon name="person" className="w-12 h-12 text-[var(--warning-text)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Are you still there?</h2>
                <p className="text-[var(--text-secondary)] mt-2">For your security, you will be logged out due to inactivity in...</p>
                <p className="text-5xl font-bold text-[var(--text-accent)] my-4">{countdown}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onLogout}
                        className="px-6 py-2 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold rounded-lg hover:opacity-80 transition-opacity"
                    >
                        Logout
                    </button>
                    <button
                        onClick={onStay}
                        className="px-6 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-opacity shadow"
                    >
                        I'm still here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InactivityWarningModal;