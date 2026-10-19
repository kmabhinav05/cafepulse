import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Clock, Wifi } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pathTitles = {
    '/dashboard': 'Business Dashboard',
    '/pos': 'Point of Sale (POS)',
    '/orders': 'Orders & Receipts',
    '/menu': 'Menu Management',
    '/inventory': 'Stock & Ingredients',
    '/analytics': 'Performance & Revenue Reports',
    '/users': 'Staff & Access Control',
  };

  const currentTitle = pathTitles[location.pathname] || 'CafePulse';

  return (
    <header className="glass-surface sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/40 dark:border-white/10">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl glass-surface text-espresso-900 dark:text-cream-50 hover:bg-white/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-espresso-900 dark:text-cream-50 tracking-tight">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right: Live Clock, Status, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Clock & System Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl glass-panel text-espresso-900/80 dark:text-cream-200/80 border border-white/40 dark:border-white/10">
          <Clock className="w-3.5 h-3.5 text-caramel-500" />
          <span>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl glass-surface hover:bg-white/60 dark:hover:bg-espresso-800/80 text-espresso-900/70 dark:text-cream-200/70 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light Cream' : 'Dark Espresso'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-caramel-400" /> : <Moon className="w-4 h-4 text-espresso-800" />}
        </button>

        {/* User Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl glass-surface border border-white/40 dark:border-white/10">
          <div className="w-6 h-6 rounded-lg bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 flex items-center justify-center font-bold text-xs">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-medium text-espresso-900 dark:text-cream-100 max-w-[120px] truncate">
            {user?.full_name || 'Staff'}
          </span>
        </div>
      </div>
    </header>
  );
}
