import React from 'react';
import Icon from '../Icon';
import { User } from '../../types';

interface RoleConfirmationScreenProps {
  user: User;
  onNext: () => void;
}

const RoleConfirmationScreen: React.FC<RoleConfirmationScreenProps> = ({ user, onNext }) => {
  return (
    <div className="text-center animate-fade-in w-full max-w-md">
      <Icon name="person" className="w-16 h-16 text-[var(--text-accent)] mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Confirm Your Profile</h2>
      <p className="text-[var(--text-secondary)] mt-2 mb-6">
        Please confirm that the following information is correct. You can edit this later in your profile.
      </p>
      <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg space-y-2 text-left text-sm mb-8">
        <div className="flex justify-between">
            <span className="text-[var(--text-primary)] opacity-80">Name:</span>
            <span className="font-semibold text-[var(--text-primary)]">{user.name}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-[var(--text-primary)] opacity-80">Email:</span>
            <span className="font-semibold text-[var(--text-primary)]">{user.email}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-[var(--text-primary)] opacity-80">College:</span>
            <span className="font-semibold text-[var(--text-primary)]">{user.college}</span>
        </div>
         <div className="flex justify-between">
            <span className="text-[var(--text-primary)] opacity-80">Batch:</span>
            <span className="font-semibold text-[var(--text-primary)]">{user.batch}</span>
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full px-6 py-3 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow-lg"
      >
        Confirm & Continue
      </button>
    </div>
  );
};

export default RoleConfirmationScreen;