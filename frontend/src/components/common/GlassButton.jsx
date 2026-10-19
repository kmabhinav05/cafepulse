import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GlassButton({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
    icon: 'p-2.5 min-h-[44px] min-w-[44px]',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white shadow-md shadow-terracotta-500/25 border border-white/25 focus:ring-terracotta-500',
    secondary:
      'glass-surface hover:bg-white/70 dark:hover:bg-espresso-800/80 text-espresso-900 dark:text-cream-100 border border-white/40 dark:border-white/10 shadow-glass-sm focus:ring-caramel-500',
    caramel:
      'bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white shadow-md shadow-caramel-500/25 border border-white/25 focus:ring-caramel-500',
    sage:
      'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-md shadow-sage-500/25 border border-white/25 focus:ring-sage-500',
    danger:
      'bg-red-500/85 hover:bg-red-600 text-white border border-red-400/30 shadow-md shadow-red-500/20 focus:ring-red-500',
    ghost:
      'hover:bg-black/5 dark:hover:bg-white/10 text-espresso-800 dark:text-cream-200 focus:ring-espresso-800',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
}
