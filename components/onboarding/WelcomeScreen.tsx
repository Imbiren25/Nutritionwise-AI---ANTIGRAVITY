import React from 'react';
import Icon from '../Icon';
import Logo from '../Logo';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="text-center animate-fade-in w-full max-w-md mx-auto">
      <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
        <Logo className="w-24 h-24 mx-auto text-[var(--color-neutral-600)]" />
      </div>

      <h2 className="text-3xl font-extrabold text-[var(--text-primary)] font-heading mb-3 tracking-tight">
        Welcome to NutritionWise
      </h2>

      <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
        Smarter Nutrition Decisions. Better Public Health.
      </p>

      <button
        onClick={onNext}
        className="w-full px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;