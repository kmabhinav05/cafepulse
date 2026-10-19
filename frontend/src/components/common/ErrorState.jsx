import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import GlassButton from './GlassButton';

export default function ErrorState({
  title = "Connection Error",
  message = "Unable to connect to the CafePulse API backend. Please ensure the server is active.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`glass-surface rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 border border-red-300/40 dark:border-red-500/20 shadow-glass-md ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-xl font-bold text-espresso-900 dark:text-cream-50 mb-2">
        {title}
      </h3>
      <p className="text-sm text-espresso-900/70 dark:text-cream-200/70 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <GlassButton
          variant="primary"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </GlassButton>
      )}
    </div>
  );
}
