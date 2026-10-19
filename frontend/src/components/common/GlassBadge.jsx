import React from 'react';

export default function GlassBadge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantStyles = {
    default:
      'bg-white/40 dark:bg-white/10 text-espresso-900 dark:text-cream-100 border border-white/50 dark:border-white/10',
    terracotta:
      'bg-terracotta-500/15 text-terracotta-600 dark:text-terracotta-400 border border-terracotta-500/30',
    sage:
      'bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/35',
    caramel:
      'bg-caramel-500/20 text-caramel-600 dark:text-caramel-400 border border-caramel-500/35',
    danger:
      'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30',
    admin:
      'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30',
    staff:
      'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-md shadow-sm uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
