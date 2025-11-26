

import React from 'react';
import Icon from './Icon';

const UpdateRequiredModal: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in text-center">
                <Icon name="update" className="w-16 h-16 text-[var(--text-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Update Required</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">
                    A new version of NutritionWise is available. You must update the app to continue using it.
                </p>
                <a
                    href="#" // In a real app, this would be the link to the App Store or Play Store
                    onClick={(e) => { e.preventDefault(); alert('Redirecting to app store...'); }}
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-opacity shadow"
                >
                    Update Now
                </a>
            </div>
        </div>
    );
};

export default UpdateRequiredModal;