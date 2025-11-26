
import React, { useState } from 'react';
import Icon from './Icon';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon name="checklist" className="w-5 h-5 text-[var(--text-link)] cursor-pointer" />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[var(--bg-modal)] text-[var(--text-primary)] text-xs rounded-lg shadow-lg z-10">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[var(--bg-modal)]"></div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;