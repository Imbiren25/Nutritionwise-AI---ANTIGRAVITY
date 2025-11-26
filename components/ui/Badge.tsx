import React from 'react';

/**
 * Badge Component - Premium UI Library
 * 
 * A versatile badge component for labels, tags, and status indicators with:
 * - Semantic color variants (success, warning, error, info, neutral)
 * - 3 sizes (sm, md, lg)
 * - Optional dot indicator
 * - Rounded and pill variants
 */

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size of badge */
  size?: BadgeSize;
  /** Show dot indicator */
  dot?: boolean;
  /** Pill shape (fully rounded) */
  pill?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pill = false,
  className = '',
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center gap-1.5
    font-heading font-semibold
    uppercase tracking-wide
    transition-all duration-200
  `.replace(/\s+/g, ' ').trim();

  // Size styles
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Variant styles
  const variantStyles: Record<BadgeVariant, string> = {
    success: `
      bg-[var(--color-success-light)]
      text-[var(--color-success-dark)]
      border border-[var(--color-success)]/20
    `.replace(/\s+/g, ' ').trim(),

    warning: `
      bg-[var(--color-warning-light)]
      text-[var(--color-warning-dark)]
      border border-[var(--color-warning)]/20
    `.replace(/\s+/g, ' ').trim(),

    error: `
      bg-[var(--color-error-light)]
      text-[var(--color-error-dark)]
      border border-[var(--color-error)]/20
    `.replace(/\s+/g, ' ').trim(),

    info: `
      bg-[var(--color-info-light)]
      text-[var(--color-info-dark)]
      border border-[var(--color-info)]/20
    `.replace(/\s+/g, ' ').trim(),

    neutral: `
      bg-[var(--color-neutral-100)]
      text-[var(--color-neutral-700)]
      border border-[var(--color-neutral-300)]
    `.replace(/\s+/g, ' ').trim(),

    primary: `
      bg-[var(--color-primary-light)]/10
      text-[var(--color-primary-600)]
      border border-[var(--color-primary-500)]/20
    `.replace(/\s+/g, ' ').trim(),

    secondary: `
      bg-[var(--color-neutral-200)]
      text-[var(--color-neutral-800)]
      border border-[var(--color-neutral-400)]
    `.replace(/\s+/g, ' ').trim(),
  };

  // Shape styles
  const shapeStyles = pill ? 'rounded-full' : 'rounded-md';

  // Dot color
  const dotColor: Record<BadgeVariant, string> = {
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
    info: 'bg-[var(--color-info)]',
    neutral: 'bg-[var(--color-neutral-500)]',
    primary: 'bg-[var(--color-primary-500)]',
    secondary: 'bg-[var(--color-neutral-600)]',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${shapeStyles}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${dotColor[variant]}
          `}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
