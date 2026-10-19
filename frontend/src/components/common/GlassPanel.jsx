import React from 'react';

export default function GlassPanel({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 sm:p-8 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
