import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Coffee,
  MoreHorizontal,
} from 'lucide-react';

export default function MobileTabBar({ onMoreClick }) {
  const tabs = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'POS', to: '/pos', icon: ShoppingBag },
    { name: 'Orders', to: '/orders', icon: Receipt },
    { name: 'Menu', to: '/menu', icon: Coffee },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/50 dark:border-white/10 px-2 py-1.5 shadow-glass-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-terracotta-600 dark:text-terracotta-400 font-bold'
                    : 'text-espresso-900/60 dark:text-cream-200/60 hover:text-espresso-900 dark:hover:text-cream-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-transform ${
                      isActive ? 'scale-110 bg-terracotta-500/15' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="mt-0.5 leading-tight">{tab.name}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More Options Button */}
        <button
          onClick={onMoreClick}
          type="button"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 rounded-xl text-[10px] font-medium text-espresso-900/60 dark:text-cream-200/60 hover:text-espresso-900 dark:hover:text-cream-50 transition-colors focus:outline-none"
        >
          <div className="p-1 rounded-lg">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="mt-0.5 leading-tight">More</span>
        </button>
      </div>
    </nav>
  );
}
