import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Terminal, ShieldCheck, HelpCircle } from 'lucide-react';

interface HowToFindKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToFindKeyModal: React.FC<HowToFindKeyModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const snippet = 'JSON.parse(localStorage.getItem("profile")).auth.key';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-stremio-surface border border-stremio-border rounded-2xl max-w-lg w-full overflow-hidden shadow-glow-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stremio-border flex items-center justify-between bg-stremio-card/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stremio-accent/20 rounded-lg text-stremio-accentLight">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">How to Get Your Stremio Auth Key</h3>
              <p className="text-xs text-stremio-muted">Fast, secure 30-second procedure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-300">
          <div className="flex items-start gap-3 p-3.5 bg-stremio-card rounded-xl border border-stremio-border/60">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stremio-accent text-white font-bold text-xs shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-1">
              <p className="font-medium text-white">Open Stremio Web</p>
              <p className="text-xs text-gray-400">
                Log into your account at{' '}
                <a
                  href="https://web.stremio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stremio-accentLight hover:underline inline-flex items-center gap-1 font-medium"
                >
                  web.stremio.com <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-stremio-card rounded-xl border border-stremio-border/60">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stremio-accent text-white font-bold text-xs shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-1">
              <p className="font-medium text-white">Open Developer Tools</p>
              <p className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-black/40 border border-stremio-border rounded text-xs font-mono text-gray-200">F12</kbd> or right-click anywhere and click <strong className="text-gray-200">Inspect</strong>, then switch to the <strong className="text-gray-200">Console</strong> tab.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-stremio-card rounded-xl border border-stremio-border/60">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stremio-accent text-white font-bold text-xs shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-2 flex-1">
              <p className="font-medium text-white">Paste and run this snippet in Console:</p>
              <div className="relative flex items-center bg-black/60 rounded-lg p-2.5 border border-stremio-border font-mono text-xs text-stremio-accentLight">
                <Terminal className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                <span className="truncate select-all mr-8">{snippet}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2 p-1.5 rounded-md bg-stremio-accent hover:bg-stremio-accentHover text-white transition-all shadow-sm flex items-center gap-1 text-xs font-sans font-medium"
                  title="Copy snippet"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-stremio-card rounded-xl border border-stremio-border/60">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stremio-accent text-white font-bold text-xs shrink-0 mt-0.5">
              4
            </span>
            <div className="space-y-1">
              <p className="font-medium text-white">Copy the Output Key</p>
              <p className="text-xs text-gray-400">
                Copy the printed string (without the surrounding quotes) and paste it into the Auth Key input field.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <p>
              <strong>Privacy Assurance:</strong> Your auth key never leaves your browser. All API calls connect directly from your device to <code className="bg-black/30 px-1 py-0.5 rounded text-emerald-200">api.strem.io</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stremio-border bg-stremio-card/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stremio-accent hover:bg-stremio-accentHover text-white font-medium text-sm transition-all shadow-glow-sm"
          >
            Got it, Let's Go
          </button>
        </div>
      </div>
    </div>
  );
};
