import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginForm({ className = '' }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      addToast({
        type: 'success',
        title: `Welcome, ${user.full_name}!`,
        message: `Successfully authenticated as ${user.role}.`,
      });
      navigate(user.role === 'admin' ? '/dashboard' : '/pos');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot reach the CafePulse backend at http://127.0.0.1:8000.'
          : 'Invalid email or password.');
      setApiError(msg);
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Discreet helper: clicking the admin note autofills demo credentials
  const handleQuickDemo = () => {
    if (!email || email === 'staff@cafepulse.demo') {
      setEmail('admin@cafepulse.demo');
      setPassword('admin123');
    } else {
      setEmail('staff@cafepulse.demo');
      setPassword('staff123');
    }
    setErrors({});
    setApiError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      className={`w-full max-w-[390px] mx-auto select-none ${className}`}
    >
      {/* Header section matching target reference screenshot */}
      <div className="space-y-1 mb-6">
        <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#DE7938]">
          YOUR CAFE, CONNECTED
        </span>
        <h2 className="font-serif text-[36px] sm:text-[38px] font-extrabold text-[#FAF3EB] tracking-tight leading-[1.12]">
          Welcome back
        </h2>
        <p className="text-[14.5px] text-[#A89B91] pt-0.5">
          Good things are brewing.
        </p>
      </div>

      {/* API Error Notification */}
      {apiError && (
        <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-fade-in">
          {apiError}
        </div>
      )}

      {/* Form with dark translucent inputs and golden amber button */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs font-medium text-[#C9BEB5] pl-1"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-[48px] px-5 rounded-2xl text-sm font-medium transition-all duration-200 bg-[#241710]/75 dark:bg-[#22160F]/80 text-[#FAF3EB] border border-[#3E291C]/60 shadow-inner focus:outline-none focus:ring-1 focus:ring-[#DCA466]/40 focus:border-[#DCA466] ${
                errors.email ? 'border-red-400' : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 pl-3 pt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-medium text-[#C9BEB5] pl-1"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-[48px] px-5 pr-12 rounded-2xl text-sm font-medium transition-all duration-200 bg-[#241710]/75 dark:bg-[#22160F]/80 text-[#FAF3EB] border border-[#3E291C]/60 shadow-inner focus:outline-none focus:ring-1 focus:ring-[#DCA466]/40 focus:border-[#DCA466] ${
                errors.password ? 'border-red-400' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 p-1.5 text-[#8A7D73] hover:text-[#FAF3EB] transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 pl-3 pt-0.5">{errors.password}</p>
          )}
        </div>

        {/* GOLDEN AMBER SIGN IN BUTTON (EXACT TARGET COLOR & DARK TEXT) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] rounded-full flex items-center justify-center gap-2 font-medium text-sm text-[#241409] bg-[#DCA466] hover:bg-[#E5AF73] active:scale-[0.99] transition-all duration-200 shadow-md shadow-[#DCA466]/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#241409]" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 text-[#241409]" strokeWidth={2.2} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Subtext matching target screenshot (Clickable to autofill demo credentials) */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={handleQuickDemo}
          className="text-xs text-[#8A7D74] hover:text-[#C9BEB5] transition-colors cursor-pointer"
          title="Click to fill demo account"
        >
          Accounts are created by your cafe admin.
        </button>
      </div>
    </motion.div>
  );
}
