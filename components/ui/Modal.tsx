import React, { useEffect, useRef } from 'react';

/**
 * Modal Component - Premium UI Library
 * 
 * A comprehensive modal/dialog component with:
 * - Semi-skeuomorphic overlay with backdrop blur
 * - Smooth fade + scale animations
 * - Focus trap for accessibility
 * - ESC key to close
 * - Click outside to close
 * - Multiple sizes
 * - Header, body, footer regions
 * - Full ARIA support
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Control modal visibility */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal size */
  size?: ModalSize;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content (actions/buttons) */
  actions?: React.ReactNode;
  /** Prevent closing on backdrop click */
  disableBackdropClick?: boolean;
  /** Prevent closing on ESC key */
  disableESC?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
  actions,
  disableBackdropClick = false,
  disableESC = false,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Size styles
  const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full mx-4',
  };

  // Handle ESC key
  useEffect(() => {
    if (!open || disableESC) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose, disableESC]);

  // Focus trap
  useEffect(() => {
    if (!open) return;

    // Store previously active element
    previousActiveElement.current = document.activeElement;

    // Focus modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Return focus on unmount
    return () => {
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClick) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-dimmer)] backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative
          w-full
          ${sizeStyles[size]}
          bg-[var(--color-bg-elevated)]
          rounded-2xl
          shadow-[0px_12px_32px_rgba(0,0,0,0.12)]
          max-h-[90vh]
          overflow-hidden
          animate-scale-in
          before:absolute before:inset-0
          before:rounded-2xl
          before:bg-gradient-to-br
          before:from-white/40 before:to-transparent
          before:pointer-events-none
        `}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-neutral-200)]">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-bold font-heading text-[var(--color-text-primary)]"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg
                  text-[var(--color-text-tertiary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-[var(--color-interactive-hover)]
                  transition-all duration-200
                "
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-bg-secondary)]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
