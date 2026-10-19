import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Coffee,
  Boxes,
  BarChart3,
  Users,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TrafficLights from '../common/TrafficLights';
import GlassBadge from '../common/GlassBadge';

export default function Sidebar({ className = '' }) {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Point of Sale', to: '/pos', icon: ShoppingBag },
    { name: 'Orders', to: '/orders', icon: Receipt },
    { name: 'Menu', to: '/menu', icon: Coffee },
    { name: 'Inventory', to: '/inventory', icon: Boxes },
    ...(isAdmin
      ? [
          { name: 'Analytics', to: '/analytics', icon: BarChart3, badge: 'Pro' },
          { name: 'Staff & Roles', to: '/users', icon: Users },
        ]
      : []),
  ];

  return (
    <aside
      className={`glass-surface w-64 h-full flex flex-col justify-between p-4 border-r border-white/40 dark:border-white/10 select-none ${className}`}
    >
      <div>
        {/* macOS Traffic Lights + Branding */}
        <div className="px-3 pt-2 pb-6 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <TrafficLights />
            <span className="text-[10px] tracking-widest uppercase font-mono text-espresso-900/40 dark:text-cream-200/40">
              v1.0.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-caramel-500 flex items-center justify-center text-white shadow-md shadow-terracotta-500/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-espresso-900 dark:text-cream-50 leading-tight">
                CafePulse
              </h1>
              <p className="text-[11px] font-medium text-espresso-900/60 dark:text-cream-200/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-caramel-500" />
                Cafe OS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-md shadow-terracotta-500/25 border border-white/20'
                      : 'text-espresso-900/80 dark:text-cream-200/80 hover:bg-white/50 dark:hover:bg-white/10 hover:text-espresso-900 dark:hover:text-cream-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-espresso-900/60 dark:text-cream-200/60'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/25 text-white' : 'bg-caramel-500/20 text-caramel-600 dark:text-caramel-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Customer Storefront Quick Launcher */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10">
          <a
            href="/order"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-caramel-500/20 to-terracotta-500/20 text-terracotta-500 dark:text-caramel-400 border border-caramel-500/30 hover:border-caramel-500/60 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Online Ordering Store</span>
            </span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* User Footer & Theme Switch */}
      <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-3">
        {/* User Pill */}
        <div className="glass-panel p-2.5 rounded-2xl flex items-center justify-between border border-white/50 dark:border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-espresso-900 dark:text-cream-50 truncate">
                {user?.full_name || 'Staff User'}
              </p>
              <GlassBadge
                size="sm"
                variant={isAdmin ? 'admin' : 'staff'}
                className="mt-0.5"
              >
                {user?.role || 'Staff'}
              </GlassBadge>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-espresso-900/60 dark:text-cream-200/60 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light Cream' : 'Dark Espresso'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-caramel-400" /> : <Moon className="w-4 h-4 text-espresso-800" />}
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
