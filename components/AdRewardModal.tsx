import React from 'react';
import Icon from './Icon';

interface AdRewardModalProps {
    onWatchAd: () => void;
    onCancel: () => void;
}

const AdRewardModal: React.FC<AdRewardModalProps> = ({ onWatchAd, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in text-center">
                <Icon name="ai" className="w-12 h-12 text-[var(--text-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Summary Limit Reached</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">
                    You've used your 3 free AI summaries today. Watch a short ad to unlock 1 extra summary.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onWatchAd}
                        className="px-6 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow"
                    >
                        Watch Ad
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdRewardModal;
