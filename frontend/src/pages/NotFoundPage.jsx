import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cream-100 dark:bg-espresso-950 text-espresso-900 dark:text-cream-50">
      <GlassCard className="p-8 sm:p-12 text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold">404</h2>
        <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
          The requested page could not be found or you do not have permission to view it.
        </p>
        <div className="pt-2">
          <GlassButton
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
