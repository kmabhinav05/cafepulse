import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CafePulseLogo from '../components/layout/CafePulseLogo';
import ThemeToggle from '../components/ui/ThemeToggle';
import CafeGlass3D from '../components/coffee/CafeGlass3D';
import IngredientLabels from '../components/coffee/IngredientLabels';
import BeverageSwitcher from '../components/coffee/BeverageSwitcher';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  // Tea mode is the default target design
  const [beverageType, setBeverageType] = useState('tea');

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-700 bg-[#F7EFE4] dark:bg-[#140D08] text-espresso-900 dark:text-[#FAF3EB]">
      {/* ================================================================= */}
      {/* 1. SOFT ATMOSPHERIC GRADIENTS MATCHING TARGET SCREENSHOT EXACTLY  */}
      {/* ================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Left burnt-brown / copper glow behind branding and glass */}
        <div className="absolute -top-[8%] left-[2%] w-[56vw] h-[56vw] max-w-[760px] max-h-[760px] rounded-full bg-gradient-to-br from-[#F8C4A9]/70 via-[#F7BA9C]/45 to-transparent blur-[120px] dark:from-[#4E2412]/85 dark:via-[#351608]/60 transition-colors duration-700" />

        {/* Center luminous depth glow */}
        <div className="absolute top-[8%] left-[20%] w-[45vw] h-[45vw] max-w-[620px] max-h-[620px] rounded-full bg-gradient-to-b from-[#FFFDF9]/50 to-transparent blur-[120px] dark:from-[#26150C]/45 dark:via-transparent transition-colors duration-700" />

        {/* Right & bottom-right subtle muted olive-green / forest mist */}
        <div className="absolute top-[16%] -right-[8%] w-[54vw] h-[64vw] max-w-[800px] max-h-[900px] rounded-full bg-gradient-to-bl from-[#D8E7D5]/70 via-[#C9DDC6]/40 to-transparent blur-[130px] dark:from-[#1D2C1A]/55 dark:via-[#131F11]/35 transition-colors duration-700" />

        {/* Bottom subtle warm ember glow */}
        <div className="absolute -bottom-[14%] left-[24%] w-[44vw] h-[44vw] max-w-[620px] max-h-[620px] rounded-full bg-gradient-to-tr from-[#EEDAC7]/50 to-transparent blur-[100px] dark:from-[#2A1509]/50 transition-colors duration-700" />
      </div>

      {/* ================================================================= */}
      {/* 2. TOPBAR HEADER (LOGO AT TOP-LEFT, THEME TOGGLE AT TOP-RIGHT)    */}
      {/* ================================================================= */}
      <header className="relative z-20 w-full max-w-[1284px] mx-auto px-8 sm:px-12 pt-6 sm:pt-7 flex items-center justify-between">
        <CafePulseLogo />
        <ThemeToggle />
      </header>

      {/* ================================================================= */}
      {/* 3. BALANCED 2-COLUMN LAYOUT MATCHING TARGET PROPORTIONS           */}
      {/* ================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1284px] mx-auto px-8 sm:px-12 py-3 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* LEFT SECTION: Upper Branding + Compact 3D Glass + Controls Below */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-1 sm:space-y-2">
          {/* Branding and Tagline in upper-left area */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-1"
          >
            <span className="block text-xs sm:text-[12.5px] font-medium tracking-normal text-[#C46022] dark:text-[#DE7938]">
              A little craft. A lot of care.
            </span>
            <h1 className="font-serif text-5xl sm:text-[56px] font-extrabold tracking-tight text-[#2D1B11] dark:text-[#FAF3EB] leading-[1.05]">
              CafePulse
            </h1>
            <p className="text-sm sm:text-[15px] text-[#695548] dark:text-[#A89B91] pt-0.5">
              A fresh start for your cafe.
            </p>
          </motion.div>

          {/* Compact 3D Drinking Glass with Fine Leader Lines */}
          <div className="relative w-full max-w-[430px] mx-auto lg:mx-0 flex items-center justify-center my-0">
            <CafeGlass3D beverageType={beverageType} />
            <IngredientLabels beverageType={beverageType} />
          </div>

          {/* Segmented Coffee / Tea Selector & Circular Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full flex justify-center lg:justify-start pt-1 pl-0 lg:pl-10"
          >
            <BeverageSwitcher
              beverageType={beverageType}
              onSelectBeverage={setBeverageType}
            />
          </motion.div>
        </div>

        {/* RIGHT SECTION: Vertically Centered Welcome Back Login Form */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </main>

      {/* Clean bottom padding matching target reference canvas */}
      <div className="relative z-10 h-6" />
    </div>
  );
}
