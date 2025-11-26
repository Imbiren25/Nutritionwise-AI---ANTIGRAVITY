import React from 'react';
import Icon from './Icon';

interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumericStepper: React.FC<NumericStepperProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
}) => {
  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      if (num >= min && num <= max) {
        onChange(num);
      }
    } else if (e.target.value === '') {
      onChange(0); // or handle empty state as needed
    }
  };

  return (
    <div className="relative flex items-center max-w-[12rem] mt-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-l-lg p-3 h-11 focus:ring-2 focus:ring-[var(--text-accent)] focus:outline-none disabled:opacity-50"
      >
        <Icon name="minus" className="w-3 h-3 text-[var(--text-secondary)]" />
      </button>
      <input
        type="text"
        className="form-input h-11 text-center text-sm block w-full py-2.5 border-y-0 rounded-none"
        value={value}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-r-lg p-3 h-11 focus:ring-2 focus:ring-[var(--text-accent)] focus:outline-none disabled:opacity-50"
      >
        <Icon name="add" className="w-3 h-3 text-[var(--text-secondary)]" />
      </button>
    </div>
  );
};

export default NumericStepper;
