import React, { useState } from 'react';
import { Coffee, Leaf, Info, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BeverageSwitcher({
  beverageType = 'tea',
  onSelectBeverage,
  className = '',
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div className={`relative flex items-center justify-center gap-2.5 select-none ${className}`}>
      {/* 1. SEGMENTED COFFEE / TEA PILL MATCHING TARGET SCREENSHOT */}
      <div className="flex items-center p-1 rounded-full bg-[#22160F]/85 dark:bg-[#20140D]/90 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/25">
        {/* Coffee Option */}
        <button
          type="button"
          onClick={() => onSelectBeverage('coffee')}
          className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
            beverageType === 'coffee'
              ? 'bg-[#DCA466] text-[#241409] font-semibold shadow-sm'
              : 'text-[#A89B91] hover:text-[#FAF3EB] font-medium'
          }`}
        >
          <Coffee className={`w-3.5 h-3.5 ${beverageType === 'coffee' ? 'text-[#241409]' : 'text-[#A89B91]'}`} />
          <span>Coffee</span>
        </button>

        {/* Tea Option (Default Target) */}
        <button
          type="button"
          onClick={() => onSelectBeverage('tea')}
          className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
            beverageType === 'tea'
              ? 'bg-[#DCA466] text-[#241409] font-semibold shadow-sm'
              : 'text-[#A89B91] hover:text-[#FAF3EB] font-medium'
          }`}
        >
          <Leaf className={`w-3.5 h-3.5 ${beverageType === 'tea' ? 'text-[#241409]' : 'text-[#A89B91]'}`} />
          <span>Tea</span>
        </button>
      </div>

      {/* 2. CIRCULAR (i) INFO BUTTON */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowInfo(!showInfo);
            setShowFlow(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-[#22160F]/85 dark:bg-[#20140D]/90 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/25 text-[#A89B91] hover:text-[#FAF3EB] hover:scale-105 active:scale-95 ${
            showInfo ? 'border-[#DCA466] text-[#DCA466]' : ''
          }`}
          title="Recipe Information"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Info Popover */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-11 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-[#1A110A]/95 backdrop-blur-2xl shadow-2xl border border-white/15 z-30 text-left"
            >
              <h4 className="font-serif font-bold text-xs text-[#FAF3EB] mb-1">
                {beverageType === 'tea' ? 'Golden Amber Herbal Tea' : 'Signature Iced Caramel Latte'}
              </h4>
              <p className="text-[10.5px] text-[#A89B91] leading-relaxed">
                {beverageType === 'tea'
                  ? 'Steeped amber tea infused with fresh citrus lemon wheel and garden mint.'
                  : 'Double-shot Arabica espresso with oat milk and Madagascar caramel syrup swirl.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CIRCULAR AIR / FLOW BUTTON */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowFlow(!showFlow);
            setShowInfo(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-[#22160F]/85 dark:bg-[#20140D]/90 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/25 text-[#A89B91] hover:text-[#FAF3EB] hover:scale-105 active:scale-95 ${
            showFlow ? 'border-[#DCA466] text-[#DCA466]' : ''
          }`}
          title="Aroma & 3D Orbit"
        >
          <Wind className="w-3.5 h-3.5" />
        </button>

        {/* Flow Popover */}
        <AnimatePresence>
          {showFlow && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-11 right-0 w-52 p-3 rounded-2xl bg-[#1A110A]/95 backdrop-blur-2xl shadow-2xl border border-white/15 z-30 text-left space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#FAF3EB]">
                <span>Continuous 3D Orbit</span>
                <span className="text-[9.5px] text-[#DCA466]">Active</span>
              </div>
              <p className="text-[10px] text-[#A89B91] leading-normal">
                Click and drag anywhere on the glass to rotate and view from any angle.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
