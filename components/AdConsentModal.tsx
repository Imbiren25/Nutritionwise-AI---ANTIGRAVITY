import React from 'react';
import Icon from './Icon';

interface AdConsentModalProps {
    onAgree: () => void;
    onCancel: () => void;
}

const AdConsentModal: React.FC<AdConsentModalProps> = ({ onAgree, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in text-center">
                <Icon name="ai" className="w-12 h-12 text-[var(--text-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Unlock Extra AI Features</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">
                    To provide you with more AI summaries, NutritionWise uses optional rewarded ads.
                </p>
                <div className="text-sm bg-[var(--bg-secondary)] p-3 rounded-lg text-left mb-6 border border-[var(--border-primary)]">
                    <p className="font-semibold">Privacy-First Approach:</p>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] mt-1">
                        <li>These are <strong>non-personalized ads</strong>.</li>
                        <li>Your personal or assessment data is <strong>never</strong> shared with advertisers.</li>
                    </ul>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-6">
                    By clicking "Allow Ads", you agree to view a non-personalized ad to unlock this feature.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={onAgree}
                        className="px-6 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow"
                    >
                        Allow Ads & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdConsentModal;
