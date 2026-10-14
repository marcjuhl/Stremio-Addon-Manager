import React, { useRef } from 'react';
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  RefreshCw,
  Search,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface ActionBarProps {
  totalCount: number;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSave: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  totalCount,
  hasUnsavedChanges,
  isSaving,
  isRefreshing,
  searchQuery,
  onSearchChange,
  onSave,
  onReset,
  onRefresh,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = ''; // Reset input so same file can be re-selected if needed
    }
  };

  return (
    <div className="bg-stremio-surface/90 border border-stremio-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Top Row: Search and Primary Save Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${totalCount} installed addons...`}
            className="w-full pl-9 pr-4 py-2 bg-stremio-card border border-stremio-border focus:border-stremio-accent rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-stremio-accent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Primary Save Order Button */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse-subtle">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unsaved Changes
            </span>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-stremio-accent to-purple-600 hover:from-stremio-accentHover hover:to-purple-500 text-white shadow-glow hover:scale-[1.02]'
                : 'bg-stremio-card text-gray-500 border border-stremio-border cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving to Stremio...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save & Sync Order
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Utilities (Reset, Refresh, Export, Import) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stremio-border/60 text-xs text-gray-300">
        <div className="flex items-center gap-2 font-medium text-stremio-muted">
          <span>{totalCount} Total Addons</span>
          <span>•</span>
          <span className="text-gray-400">Drag items to rearrange priority</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Reset Order */}
          <button
            type="button"
            onClick={onReset}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-3 py-1.5 rounded-lg border border-stremio-border bg-stremio-card hover:bg-stremio-cardHover text-gray-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset changes back to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Refresh From Cloud */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing || isSaving}
            className="px-3 py-1.5 rounded-lg border border-stremio-border bg-stremio-card hover:bg-stremio-cardHover text-gray-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Reload installed addons directly from Stremio"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Backup / Export JSON */}
          <button
            type="button"
            onClick={onExport}
            className="px-3 py-1.5 rounded-lg border border-stremio-border bg-stremio-card hover:bg-stremio-cardHover text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Export addon collection to a local JSON backup file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Backup</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg border border-stremio-border bg-stremio-card hover:bg-stremio-cardHover text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Import an addon collection backup (.json file)"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
