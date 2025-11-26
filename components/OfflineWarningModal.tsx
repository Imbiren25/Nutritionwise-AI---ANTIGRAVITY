import React from 'react';
import Icon from './Icon';

interface OfflineWarningModalProps {
    onClose: () => void;
}

const OfflineWarningModal: React.FC<OfflineWarningModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl p-8 w-full max-w-sm animate-fade-in text-center">
                <Icon name="ai" className="w-12 h-12 text-[var(--warning-text)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Feature Unavailable Offline</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">This feature requires an active internet connection. Please connect to the internet and try again.</p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default OfflineWarningModal;