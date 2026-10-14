import React from 'react';
import { LogOut, Github, Sparkles, HelpCircle } from 'lucide-react';
import { AuthMode } from '../types/stremio';

interface NavbarProps {
  authMode: AuthMode | null;
  accountLabel?: string;
  onLogout: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  authMode,
  accountLabel,
  onLogout,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-stremio-bg/80 backdrop-blur-md border-b border-stremio-border/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stremio-accent to-purple-500 flex items-center justify-center shadow-glow-sm">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                Stremio Addon Manager
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stremio-accent/20 text-stremio-accentLight border border-stremio-accent/40">
                Open Source
              </span>
            </div>
            <p className="text-[11px] text-stremio-muted -mt-0.5 hidden xs:block">
              Privacy-first Addon Reorderer & Sync Tool
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide Helper */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-stremio-border bg-stremio-card/60 hover:bg-stremio-card text-gray-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            title="How to get auth key"
          >
            <HelpCircle className="w-4 h-4 text-stremio-accentLight" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Connected Account Status */}
          {authMode && (
            <div className="flex items-center gap-2">
              {authMode === 'demo' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Demo Mode</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="hidden sm:inline truncate max-w-[140px]">
                    {accountLabel || 'Connected'}
                  </span>
                </span>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-medium transition-all flex items-center gap-1.5"
                title={authMode === 'demo' ? 'Exit Demo Mode' : 'Disconnect Account'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {authMode === 'demo' ? 'Exit Demo' : 'Disconnect'}
                </span>
              </button>
            </div>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/topics/stremio-addon"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-stremio-border bg-stremio-card/60 hover:bg-stremio-card text-gray-400 hover:text-white transition-all"
            title="View on GitHub"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
