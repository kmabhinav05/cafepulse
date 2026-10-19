import React from 'react';

export default function CafePulseLogo({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Copper-orange minimalist coffee cup logo */}
      <div className="text-[#DE7938]">
        <svg
          className="w-6 h-6 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      </div>
      <span className="font-serif font-bold text-xl tracking-tight text-[#FAF3EB] dark:text-[#FAF3EB] flex items-baseline">
        CafePulse<span className="text-[#DE7938] font-sans text-2xl font-black">.</span>
      </span>
    </div>
  );
}
