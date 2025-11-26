

import React from 'react';
import Icon from './Icon';

interface ConfirmFinishModalProps {
    dayType: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmFinishModal: React.FC<ConfirmFinishModalProps> = ({ dayType, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-modal)] rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in text-center">
                <Icon name="checklist" className="w-12 h-12 text-[var(--text-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Final Check</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">
                    You've marked yesterday as a <strong className="text-[var(--text-accent)]">{dayType}</strong> day. Is this correct? This context is important for the AI analysis.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold rounded-lg hover:opacity-80 transition-opacity"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-opacity shadow"
                    >
                        Yes, Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmFinishModal;