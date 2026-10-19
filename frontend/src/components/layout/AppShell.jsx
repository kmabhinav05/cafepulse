import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileTabBar from './MobileTabBar';
import { X, Coffee, Boxes, BarChart3, Users, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TrafficLights from '../common/TrafficLights';
import GlassBadge from '../common/GlassBadge';

export default function AppShell() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-cream-100 dark:bg-espresso-950 text-espresso-900 dark:text-cream-50 flex overflow-x-hidden">
      {/* Animated Soft Ambient Mesh-Gradient Blobs for Optical Refraction */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-terracotta-400/20 to-caramel-400/10 blur-[100px] animate-mesh-float-1" />
        <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-sage-400/20 to-cream-400/15 blur-[120px] animate-mesh-float-2" />
        <div className="absolute -bottom-[20%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-caramel-400/20 to-terracotta-400/15 blur-[90px] animate-mesh-float-3" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-20 flex-shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-espresso-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Window */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-full glass-panel border-r border-white/50 dark:border-white/10 p-5 flex flex-col justify-between shadow-glass-lg animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
                <TrafficLights onRedClick={() => setMobileDrawerOpen(false)} />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-espresso-900/60 dark:text-cream-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content Inside Drawer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-500 to-caramel-500 flex items-center justify-center text-white">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-espresso-900 dark:text-cream-50">CafePulse</h3>
                    <p className="text-[11px] text-espresso-900/60 dark:text-cream-200/60">Cafe OS</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="/inventory"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/50 dark:hover:bg-white/10"
                  >
                    <Boxes className="w-4 h-4 text-espresso-900/60 dark:text-cream-200/60" />
                    <span>Inventory & Stock</span>
                  </a>

                  {isAdmin && (
                    <>
                      <a
                        href="/analytics"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/50 dark:hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4 text-espresso-900/60 dark:text-cream-200/60" />
                          <span>Analytics</span>
                        </div>
                        <GlassBadge size="sm" variant="caramel">Pro</GlassBadge>
                      </a>
                      <a
                        href="/users"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/50 dark:hover:bg-white/10"
                      >
                        <Users className="w-4 h-4 text-espresso-900/60 dark:text-cream-200/60" />
                        <span>Staff Management</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-espresso-900/70 dark:text-cream-200/70">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-xl glass-surface"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-caramel-400" /> : <Moon className="w-4 h-4 text-espresso-800" />}
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 pb-20 lg:pb-6">
        <Topbar onMenuClick={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar onMoreClick={() => setMobileDrawerOpen(true)} />
    </div>
  );
}
