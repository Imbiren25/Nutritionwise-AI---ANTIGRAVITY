import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Logo from './Logo';

interface AdPlayerSimulationProps {
    onComplete: () => void;
    onClose: () => void;
}

const AdPlayerSimulation: React.FC<AdPlayerSimulationProps> = ({ onComplete, onClose }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [countdown, onComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 w-full max-w-md text-[var(--text-primary)] relative">
                <div className="text-center">
                    <p className="font-semibold">Simulated Ad</p>
                    <p className="text-4xl my-8">Your reward will be ready in {countdown}...</p>
                    <Logo className="w-12 h-12 mx-auto animate-pulse" />
                </div>
                <div className="absolute top-2 right-2 text-xs text-[var(--text-secondary)]">
                    <button onClick={onClose} className="hover:underline">Skip Ad</button>
                </div>
            </div>
        </div>
    );
};

export default AdPlayerSimulation;
