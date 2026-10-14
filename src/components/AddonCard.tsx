import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  ShieldCheck,
  Globe,
  Film,
  Tv,
  Subtitles,
  Compass,
  Radio,
  ExternalLink,
  Package,
} from 'lucide-react';
import { StremioAddonDescriptor } from '../types/stremio';

interface AddonCardProps {
  addon: StremioAddonDescriptor;
  index: number;
  total: number;
  onMoveToTop: (index: number) => void;
  onMoveToBottom: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isDraggingCurrent?: boolean;
}

export const AddonCard: React.FC<AddonCardProps> = ({
  addon,
  index,
  total,
  onMoveToTop,
  onMoveToBottom,
  onMoveUp,
  onMoveDown,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Use unique key: manifest.id or transportUrl
  const id = addon.transportUrl || addon.manifest.id || `addon-${index}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 'auto',
  };

  const isOfficial = Boolean(addon.flags?.official);
  const isProtected = Boolean(addon.flags?.protected);
  const resources = addon.manifest.resources || [];
  const types = addon.manifest.types || [];
  const catalogs = addon.manifest.catalogs || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border transition-all duration-200 select-none ${
        isDragging
          ? 'bg-stremio-cardHover/90 border-stremio-accent shadow-glow-lg opacity-90 scale-[1.02]'
          : 'bg-stremio-card/80 hover:bg-stremio-cardHover/70 border-stremio-border hover:border-stremio-borderLight shadow-sm'
      }`}
    >
      <div className="p-3.5 sm:p-4.5 flex flex-col gap-3">
        {/* Main Row */}
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            type="button"
            className="touch-none p-1.5 sm:p-2 -ml-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-stremio-accent"
            aria-label={`Drag to reorder ${addon.manifest.name}`}
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Index Pill */}
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stremio-surface border border-stremio-border text-xs sm:text-sm font-bold font-mono text-stremio-muted shrink-0">
            {index + 1}
          </div>

          {/* Addon Logo or Fallback */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-stremio-surface border border-stremio-border p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            {addon.manifest.logo && !imgError ? (
              <img
                src={addon.manifest.logo}
                alt={addon.manifest.name}
                className="w-full h-full object-contain rounded-lg"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <Package className="w-6 h-6 text-stremio-accentLight" />
            )}
          </div>

          {/* Addon Title & Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {addon.manifest.name || 'Unnamed Addon'}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stremio-surface text-stremio-muted border border-stremio-border/50">
                v{addon.manifest.version || '1.0.0'}
              </span>

              {/* Status Badges */}
              {isOfficial ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                  <ShieldCheck className="w-3 h-3 text-purple-400" /> Official
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium">
                  <Globe className="w-3 h-3 text-indigo-400" /> Community
                </span>
              )}

              {isProtected && (
                <span className="px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-500/30 text-[11px] font-medium">
                  Protected
                </span>
              )}
            </div>

            {/* Description Snippet */}
            {addon.manifest.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-1 leading-relaxed">
                {addon.manifest.description}
              </p>
            )}
          </div>

          {/* Quick Action Navigation Controls (Mobile & Desktop accessibility) */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMoveToTop(index)}
              disabled={index === 0}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move to Top"
              aria-label="Move to Top"
            >
              <ArrowUpToLine className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move Up"
              aria-label="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move Down"
              aria-label="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveToBottom(index)}
              disabled={index === total - 1}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move to Bottom"
              aria-label="Move to Bottom"
            >
              <ArrowDownToLine className="w-4 h-4" />
            </button>

            {/* Expand / Collapse Details Button */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
              title={expanded ? 'Hide details' : 'Show details'}
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 pl-9 sm:pl-11 text-[11px] text-gray-400">
          {types.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stremio-surface/70 border border-stremio-border/60 text-gray-300 capitalize"
            >
              {type === 'movie' && <Film className="w-3 h-3 text-cyan-400" />}
              {type === 'series' && <Tv className="w-3 h-3 text-emerald-400" />}
              {type === 'channel' && <Radio className="w-3 h-3 text-amber-400" />}
              {type}
            </span>
          ))}

          {catalogs.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stremio-surface/70 border border-stremio-border/60 text-gray-300">
              <Compass className="w-3 h-3 text-purple-400" />
              {catalogs.length} {catalogs.length === 1 ? 'Catalog' : 'Catalogs'}
            </span>
          )}

          {resources.some((r) => (typeof r === 'string' ? r === 'subtitles' : r.name === 'subtitles')) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stremio-surface/70 border border-stremio-border/60 text-gray-300">
              <Subtitles className="w-3 h-3 text-rose-400" /> Subtitles
            </span>
          )}
        </div>

        {/* Expandable Technical Details */}
        {expanded && (
          <div className="mt-2 pt-3 border-t border-stremio-border/60 space-y-2 text-xs text-gray-300 pl-9 sm:pl-11">
            {addon.manifest.description && (
              <div>
                <span className="text-stremio-muted font-medium">Description: </span>
                <span className="text-gray-200">{addon.manifest.description}</span>
              </div>
            )}

            <div>
              <span className="text-stremio-muted font-medium">Identifier: </span>
              <code className="text-xs font-mono text-stremio-accentLight bg-black/40 px-1.5 py-0.5 rounded">
                {addon.manifest.id}
              </code>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-stremio-muted font-medium shrink-0">Manifest URL: </span>
              <a
                href={addon.transportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-gray-400 hover:text-white truncate hover:underline inline-flex items-center gap-1"
                title={addon.transportUrl}
              >
                {addon.transportUrl}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            {catalogs.length > 0 && (
              <div>
                <span className="text-stremio-muted font-medium">Catalogs Provided: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {catalogs.map((cat, idx) => (
                    <span
                      key={`${cat.id}-${idx}`}
                      className="px-1.5 py-0.5 bg-stremio-surface text-gray-300 rounded border border-stremio-border/60 text-[11px]"
                    >
                      {cat.name || cat.id} ({cat.type})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
