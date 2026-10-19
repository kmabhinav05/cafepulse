import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import TrafficLights from './TrafficLights';

export default function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showTrafficLights = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Window */}
      <div
        className={`relative w-full ${maxWidth} glass-panel rounded-3xl p-6 sm:p-8 shadow-glass-lg dark:shadow-glass-dark z-10 border border-white/60 dark:border-white/15 animate-fade-in my-8`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            {showTrafficLights && <TrafficLights onRedClick={onClose} />}
            <div>
              {title && (
                <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso-900 dark:text-cream-50">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-espresso-900/60 dark:text-cream-200/60">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-espresso-900/60 dark:text-cream-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-caramel-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
