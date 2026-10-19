import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-espresso-950">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-3 shadow-glass-md">
          <Loader2 className="w-5 h-5 animate-spin text-terracotta-500" />
          <span className="text-sm font-medium text-espresso-900 dark:text-cream-50">
            Validating CafePulse session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
