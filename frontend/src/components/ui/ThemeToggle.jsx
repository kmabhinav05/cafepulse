import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-[#1F140E]/85 dark:bg-[#1E130D]/90 backdrop-blur-xl border border-white/10 shadow-lg text-[#E2D7CC] hover:text-[#FAF3EB] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D47A22]/50 ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light mode' : 'Dark mode'}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#FAF3EB] rotate-0 transition-transform duration-300" strokeWidth={1.8} />
        ) : (
          <Moon className="w-4 h-4 text-[#D47A22] rotate-0 transition-transform duration-300" strokeWidth={1.8} />
        )}
      </div>
    </button>
  );
}
