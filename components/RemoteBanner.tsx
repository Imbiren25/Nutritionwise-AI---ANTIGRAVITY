
import React from 'react';
import Icon from './Icon';

interface RemoteBannerProps {
  message: string;
  onClose: () => void;
}

const RemoteBanner: React.FC<RemoteBannerProps> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-[var(--text-link)] text-[var(--text-on-accent)] text-center py-2 px-4 text-sm font-semibold relative animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full hover:bg-white/20" aria-label="Dismiss message">
        <Icon name="delete" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RemoteBanner;