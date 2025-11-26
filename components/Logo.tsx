import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'green' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
    return (
        <img
            src="/assets/logo.png"
            alt="NutritionWise Logo"
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
};

export default Logo;
