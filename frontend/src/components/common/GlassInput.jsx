import React from 'react';

export default function GlassInput({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-espresso-900/40 dark:text-cream-200/40">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-espresso-900 dark:text-cream-50 placeholder-espresso-900/40 dark:placeholder-cream-200/40 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
