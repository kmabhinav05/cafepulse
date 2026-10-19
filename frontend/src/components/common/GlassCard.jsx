import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-surface rounded-2xl p-5 transition-all duration-300 ${
        hoverEffect
          ? 'hover:-translate-y-1 hover:shadow-glass-lg hover:border-white/60 dark:hover:border-white/25 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
