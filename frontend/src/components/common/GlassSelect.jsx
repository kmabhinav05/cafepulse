import React from 'react';

export default function GlassSelect({
  label,
  error,
  options = [],
  value,
  onChange,
  className = '',
  id,
  placeholder = 'Select option...',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-espresso-900/80 dark:text-cream-200/80"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-espresso-900 dark:text-cream-50 bg-white/40 dark:bg-espresso-900/70 border border-white/40 dark:border-white/10 appearance-none cursor-pointer focus:outline-none ${
            error ? 'border-red-400 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="text-gray-400 dark:bg-espresso-900">{placeholder}</option>}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-espresso-900 dark:text-cream-100 dark:bg-espresso-900"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-espresso-900/60 dark:text-cream-200/60">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
