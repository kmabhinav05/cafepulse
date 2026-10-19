import React from 'react';
import { Maximize2, Type, Edit3 } from 'lucide-react';

export default function Footer({ className = '' }) {
  return (
    <footer
      className={`w-full py-4 px-6 sm:px-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A7D73] select-none ${className}`}
    >
      {/* Left text */}
      <div className="order-2 sm:order-1">
        <span>Made for the everyday ritual.</span>
      </div>

      {/* Center subtle control dock matching screenshot */}
      <div className="order-1 sm:order-2 flex items-center gap-3 px-3.5 py-1 rounded-full bg-[#1F140E]/80 dark:bg-[#1E130D]/85 backdrop-blur-md border border-white/10 text-[#8A7D73]">
        <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-[#FAF3EB] transition-colors" />
        <Type className="w-3.5 h-3.5 cursor-pointer hover:text-[#FAF3EB] transition-colors" />
        <Edit3 className="w-3.5 h-3.5 cursor-pointer hover:text-[#FAF3EB] transition-colors" />
        <div className="w-3 h-3 rounded-full border border-current" />
      </div>

      {/* Right text */}
      <div className="order-3">
        <span>CafePulse · Cafe management</span>
      </div>
    </footer>
  );
}
