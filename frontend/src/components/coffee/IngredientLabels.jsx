import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IngredientLabels({ beverageType = 'tea' }) {
  const isTea = beverageType === 'tea';

  // Exact labels matching the target reference screenshot (media_1792331841559_5b44c6a0.png)
  const teaItems = [
    {
      id: 'mint',
      name: 'Mint',
      side: 'left',
      badgeStyle: { top: '24%', left: '11%' },
      // SVG leader line coordinates in viewBox percentage (0-100)
      x1: 24,
      y1: 27,
      x2: 38,
      y2: 24,
    },
    {
      id: 'tealeaves',
      name: 'Tea leaves',
      side: 'left',
      badgeStyle: { top: '59%', left: '7%' },
      x1: 28,
      y1: 62,
      x2: 40,
      y2: 60,
    },
    {
      id: 'ice',
      name: 'Ice',
      side: 'right',
      badgeStyle: { top: '18%', right: '12%' },
      x1: 78,
      y1: 21,
      x2: 62,
      y2: 25,
    },
    {
      id: 'lemon',
      name: 'Lemon',
      side: 'right',
      badgeStyle: { top: '44%', right: '9%' },
      x1: 81,
      y1: 47,
      x2: 64,
      y2: 44,
    },
    {
      id: 'tea',
      name: 'Tea',
      side: 'right',
      badgeStyle: { top: '70%', right: '14%' },
      x1: 76,
      y1: 73,
      x2: 61,
      y2: 70,
    },
  ];

  const coffeeItems = [
    {
      id: 'foam',
      name: 'Foam',
      side: 'left',
      badgeStyle: { top: '22%', left: '11%' },
      x1: 24,
      y1: 25,
      x2: 39,
      y2: 27,
    },
    {
      id: 'syrup',
      name: 'Syrup',
      side: 'left',
      badgeStyle: { top: '56%', left: '8%' },
      x1: 26,
      y1: 59,
      x2: 40,
      y2: 56,
    },
    {
      id: 'ice',
      name: 'Ice',
      side: 'right',
      badgeStyle: { top: '18%', right: '12%' },
      x1: 78,
      y1: 21,
      x2: 62,
      y2: 25,
    },
    {
      id: 'milk',
      name: 'Milk',
      side: 'right',
      badgeStyle: { top: '44%', right: '11%' },
      x1: 79,
      y1: 47,
      x2: 63,
      y2: 46,
    },
    {
      id: 'espresso',
      name: 'Espresso',
      side: 'right',
      badgeStyle: { top: '70%', right: '12%' },
      x1: 78,
      y1: 73,
      x2: 60,
      y2: 72,
    },
  ];

  const items = isTea ? teaItems : coffeeItems;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={beverageType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          {/* SVG Connector Lines Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {items.map((item) => (
              <g key={`line-${item.id}`}>
                {/* Thin connector leader line */}
                <line
                  x1={`${item.x1}%`}
                  y1={`${item.y1}%`}
                  x2={`${item.x2}%`}
                  y2={`${item.y2}%`}
                  stroke="rgba(240, 230, 220, 0.28)"
                  strokeWidth="0.5"
                  strokeDasharray="none"
                />
                {/* Anchor dot touching the ingredient / glass */}
                <circle
                  cx={`${item.x2}%`}
                  cy={`${item.y2}%`}
                  r="0.9"
                  fill="rgba(250, 240, 230, 0.75)"
                />
              </g>
            ))}
          </svg>

          {/* HTML Badge Pills */}
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="absolute pointer-events-auto"
              style={item.badgeStyle}
            >
              <div className="px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#271B14]/85 dark:bg-[#251912]/90 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30 text-[11px] sm:text-[11.5px] font-normal text-[#EAE2D8] hover:text-white transition-colors cursor-default whitespace-nowrap">
                {item.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
