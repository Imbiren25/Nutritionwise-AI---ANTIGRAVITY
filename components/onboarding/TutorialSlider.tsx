import React, { useState } from 'react';
import Icon from '../Icon';

interface TutorialSliderProps {
  onFinish: () => void;
}

const slides = [
  {
    icon: 'checklist' as const,
    title: '24-Hour Recall',
    description: 'Log everything the respondent ate and drank over the last 24 hours. Be as specific as possible with quantities and cooking methods.',
  },
  {
    icon: 'inventory' as const,
    title: 'Stock Inventory',
    description: 'Assess a household\'s food security by logging their food stock and family composition to calculate Consumption Units (CU).',
  },
  {
    icon: 'ai' as const,
    title: 'AI Assistant',
    description: 'Get instant analysis, summaries, and socio-economically appropriate recommendations based on the assessment data.',
  },
  {
    icon: 'description' as const,
    title: 'Reports',
    description: 'View, save, and print detailed PDF reports for each completed assessment, perfect for academic assignments and field work.',
  },
];

const TutorialSlider: React.FC<TutorialSliderProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md animate-fade-in">
      <div className="text-center">
        <Icon name={slide.icon} className="w-20 h-20 text-[var(--text-accent)] mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{slide.title}</h2>
        <p className="text-[var(--text-secondary)] mt-2 min-h-[70px]">
          {slide.description}
        </p>
      </div>
      
      <div className="w-full mt-8">
        <div className="flex justify-center space-x-2 mb-6">
            {slides.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-[var(--text-accent)]' : 'bg-[var(--border-primary)]'}`}></div>
            ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-full px-6 py-3 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow-lg"
        >
          {currentSlide === slides.length - 1 ? 'Finish Tutorial' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TutorialSlider;