import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stremio-border/60 bg-stremio-surface/40 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stremio-muted">
        {/* Left side: Privacy & License */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side • Zero Telemetry</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Released under the MIT License</span>
        </div>

        {/* Right side: Credits and Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://stremio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Stremio.com <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a
            href="https://github.com/Stremio/stremio-addon-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Addon SDK <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 pt-4 border-t border-stremio-border/30 text-center text-[11px] text-gray-500">
        This is an unofficial community project and is not affiliated with, endorsed by, or sponsored by Stremio B.V.
      </div>
    </footer>
  );
};
