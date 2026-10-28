import React, { useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

export default function GlassInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  id,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        className={`glass-subtle min-h-11 w-full rounded-2xl px-4 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:ring-2 focus:ring-ring aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-err`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-glass hover:brightness-110',
    accent: 'bg-accent text-accent-foreground shadow-glass hover:brightness-105',
    glass: 'glass-subtle text-foreground hover:bg-glass-strong',
    ghost: 'text-foreground hover:bg-glass',
    danger: 'bg-destructive text-destructive-foreground shadow-glass hover:brightness-110',
  };

  const sizeClasses = {
    sm: 'min-h-9 px-3.5 text-xs',
    md: 'min-h-11 px-5 text-sm',
    lg: 'min-h-12 px-7 text-base',
    icon: 'size-11 px-0',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold spring transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SegmentedControl({
  options = [],
  value,
  onChange,
  ariaLabel,
  className = '',
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`glass-subtle inline-flex rounded-full p-1 ${className}`}
    >
      {options.map((opt) => {
        const isChecked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isChecked}
            onClick={() => onChange(opt.value)}
            className={`min-h-9 rounded-full px-4 text-sm font-medium spring transition-all ${
              isChecked
                ? 'bg-primary text-primary-foreground shadow-glass'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
