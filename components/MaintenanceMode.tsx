

import React from 'react';
import Icon from './Icon';

interface MaintenanceModeProps {
    message?: string;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ message }) => {
    const defaultMessage = "NutritionWise is currently undergoing scheduled maintenance. We'll be back online shortly. Thank you for your patience.";
    
    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in text-center">
                <Icon name="apps" className="w-16 h-16 text-secondary-blue mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Under Maintenance</h2>
                <p className="text-[var(--text-secondary)] mt-2 mb-6">
                    {message || defaultMessage}
                </p>
            </div>
        </div>
    );
};

export default MaintenanceMode;