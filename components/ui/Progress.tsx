import React from 'react';

/**
 * Progress Component - Premium UI Library
 * 
 * A versatile progress bar component with:
 * - Determinate and indeterminate modes
 * - Semantic color variants
 * - Sizes (sm, md, lg)
 * - Animated shimmer effect
 * - Optional label
 */

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'error';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
    /** Progress value (0-100) */
    value?: number;
    /** Show indeterminate animation */
    indeterminate?: boolean;
    /** Color variant */
    variant?: ProgressVariant;
    /** Size */
    size?: ProgressSize;
    /** Optional label */
    label?: string;
    /** Show percentage */
    showPercentage?: boolean;
    /** Additional CSS classes */
    className?: string;
}

const Progress: React.FC<ProgressProps> = ({
    value = 0,
    indeterminate = false,
    variant = 'primary',
    size = 'md',
    label,
    showPercentage = false,
    className = '',
}) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    // Size styles
    const sizeStyles: Record<ProgressSize, string> = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    // Variant styles
    const variantStyles: Record<ProgressVariant, string> = {
        primary: 'bg-[var(--color-primary-light)]',
        success: 'bg-[var(--color-success)]',
        warning: 'bg-[var(--color-warning)]',
        error: 'bg-[var(--color-error)]',
    };

    return (
        <div className={className}>
            {/* Label */}
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-2">
                    {label && (
                        <span className="text-sm font-medium font-body text-[var(--color-text-primary)]">
                            {label}
                        </span>
                    )}
                    {showPercentage && !indeterminate && (
                        <span className="text-sm font-semibold font-heading text-[var(--color-text-secondary)]">
                            {Math.round(clampedValue)}%
                        </span>
                    )}
                </div>
            )}

            {/* Progress Track */}
            <div
                className={`
          w-full
          bg-[var(--color-neutral-200)]
          rounded-full
          overflow-hidden
          ${sizeStyles[size]}
        `}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : clampedValue}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {/* Progress Bar */}
                <div
                    className={`
            h-full
            ${variantStyles[variant]}
            transition-all duration-300 ease-out
            relative
            overflow-hidden
            ${indeterminate ? 'w-full' : ''}
          `}
                    style={indeterminate ? {} : { width: `${clampedValue}%` }}
                >
                    {/* Shimmer Effect */}
                    {!indeterminate && clampedValue > 0 && clampedValue < 100 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}

                    {/* Indeterminate Animation */}
                    {indeterminate && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 animate-shimmer" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Progress;
