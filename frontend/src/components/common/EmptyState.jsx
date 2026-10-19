import React from 'react';
import { PackageOpen } from 'lucide-react';
import GlassButton from './GlassButton';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "There are no records to display matching your criteria.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`glass-surface rounded-2xl p-8 text-center flex flex-col items-center justify-center my-6 border border-white/40 dark:border-white/10 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-caramel-500/10 dark:bg-caramel-500/20 text-caramel-600 dark:text-caramel-400 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-espresso-900/60 dark:text-cream-200/60 mb-5 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <GlassButton variant="secondary" onClick={onAction}>
          {actionLabel}
        </GlassButton>
      )}
    </div>
  );
}
