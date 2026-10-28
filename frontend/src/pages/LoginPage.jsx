import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, LoaderCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import GlassInput, { GlassButton } from '../components/ui/LovableGlass';
import LovableCafeGlass from '../components/coffee/LovableCafeGlass';

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const user = await login(email.trim(), password);
      addToast({
        type: 'success',
        title: `Welcome back, ${user.full_name}!`,
        message: 'Successfully signed in.',
      });
      navigate(user.role === 'admin' ? '/dashboard' : '/pos', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot reach backend server. Please verify API is running.'
          : 'Email or password is incorrect');
      setErrors({ form: msg });
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for demo accounts
  const handleQuickDemo = () => {
    if (!email || email === 'staff@cafepulse.demo') {
      setEmail('admin@cafepulse.demo');
      setPassword('admin123');
    } else {
      setEmail('staff@cafepulse.demo');
      setPassword('staff123');
    }
    setErrors({});
  };

  return (
    <div className="login-page relative select-none">
      {/* Background Animated Mesh Gradients matching Lovable */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-blob b1" />
        <div className="mesh-blob b2" />
        <div className="mesh-blob b3" />
        <div className="mesh-blob b4" />
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="flex items-center gap-2.5">
          <Coffee className="size-6 text-accent" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            CafePulse<span className="text-accent font-bold">.</span>
          </span>
        </div>

        <GlassButton
          variant="glass"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          title={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </GlassButton>
      </header>

      {/* Main Content */}
      <main className="login-content">
        {/* Left Studio Section */}
        <section className="login-studio">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            A little craft. A lot of care.
          </p>
          <h1 className="tracking-tight">CafePulse</h1>
          <p className="mt-3 text-base text-muted-foreground">
            A fresh start for your cafe.
          </p>
          <div className="mt-2">
            <LovableCafeGlass initialDrink="coffee" />
          </div>
        </section>

        {/* Right Form Section */}
        <section className="login-form">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
              YOUR CAFE, CONNECTED
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground font-serif">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Good things are brewing.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <GlassInput
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="admin@cafepulse.demo"
            />

            <GlassInput
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            {errors.form && (
              <p
                role="alert"
                className="rounded-2xl bg-destructive/12 px-4 py-3 text-sm font-medium text-destructive animate-fade-in border border-destructive/20"
              >
                {errors.form}
              </p>
            )}

            <GlassButton
              type="submit"
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:brightness-105 shadow-glass cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </GlassButton>
          </form>

          <p
            onClick={handleQuickDemo}
            className="mt-6 text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Click to fill demo account"
          >
            Accounts are created by your cafe admin.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <span>Made for the everyday ritual.</span>
        <span>CafePulse • Cafe management</span>
      </footer>
    </div>
  );
}
