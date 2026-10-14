import React, { useState } from 'react';
import { KeyRound, Mail, Eye, EyeOff, ShieldCheck, Sparkles, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { AuthMode } from '../types/stremio';

interface AuthCardProps {
  onLoginWithKey: (key: string, remember: boolean) => Promise<void>;
  onLoginWithCredentials: (email: string, pass: string, remember: boolean) => Promise<void>;
  onStartDemo: () => void;
  isLoading: boolean;
  initialKey?: string;
  onOpenGuide: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onLoginWithKey,
  onLoginWithCredentials,
  onStartDemo,
  isLoading,
  initialKey = '',
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<AuthMode>('key');
  const [authKey, setAuthKey] = useState(initialKey);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authKey.trim()) return;
    await onLoginWithKey(authKey.trim(), remember);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await onLoginWithCredentials(email.trim(), password, remember);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Decorative gradient glow behind the card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-stremio-accent via-stremio-pink to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative bg-stremio-surface/90 border border-stremio-border/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-stremio-accent to-purple-500 shadow-glow mb-3">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Connect Your Stremio Account</h2>
            <p className="text-sm text-stremio-muted mt-1.5">
              Sync your addon collection to reorder, customize, and save in real-time.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-stremio-card rounded-xl border border-stremio-border mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('key')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'key'
                  ? 'bg-stremio-accent text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" /> Auth Key (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'credentials'
                  ? 'bg-stremio-accent text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" /> Stremio Login
            </button>
          </div>

          {/* Tab 1: Auth Key Form */}
          {activeTab === 'key' && (
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="authKey" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Stremio Auth Key
                  </label>
                  <button
                    type="button"
                    onClick={onOpenGuide}
                    className="text-xs text-stremio-accentLight hover:underline flex items-center gap-1 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How do I find this?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="authKey"
                    type={showPassword ? 'text' : 'password'}
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    placeholder="e.g. 5f9a8b7c6d5e4f3a2b1c..."
                    className="w-full px-4 py-3 bg-stremio-card border border-stremio-border focus:border-stremio-accent rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-stremio-accent/40 transition-all pr-12"
                    required
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                    title={showPassword ? 'Hide key' : 'Show key'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-stremio-border bg-stremio-card text-stremio-accent focus:ring-stremio-accent/40 focus:ring-offset-0"
                  />
                  <span className="text-xs text-gray-400">Remember on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !authKey.trim()}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-stremio-accent to-purple-600 hover:from-stremio-accentHover hover:to-purple-500 text-white font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Fetching Addons...
                  </>
                ) : (
                  <>
                    Load My Addons <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Credentials Form */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Stremio Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 bg-stremio-card border border-stremio-border focus:border-stremio-accent rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-stremio-accent/40 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Stremio Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 bg-stremio-card border border-stremio-border focus:border-stremio-accent rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-stremio-accent/40 transition-all pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-stremio-border bg-stremio-card text-stremio-accent focus:ring-stremio-accent/40 focus:ring-offset-0"
                  />
                  <span className="text-xs text-gray-400">Remember session token</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-stremio-accent to-purple-600 hover:from-stremio-accentHover hover:to-purple-500 text-white font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Log In & Load Addons <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sandbox / Demo Mode separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stremio-border/80"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stremio-surface px-3 text-stremio-muted font-medium">Or explore first</span>
            </div>
          </div>

          {/* Try Demo Mode Button */}
          <button
            type="button"
            onClick={onStartDemo}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-stremio-border bg-stremio-card hover:bg-stremio-cardHover text-gray-200 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Try Interactive Demo Mode
          </button>

          {/* Privacy Guarantee Footer */}
          <div className="mt-6 pt-5 border-t border-stremio-border/60 flex items-start gap-2.5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-200">100% Client-Side Privacy:</span> All requests go directly to <code className="text-gray-300 font-mono">api.strem.io</code> from your browser. Your credentials never touch any middleman server.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
