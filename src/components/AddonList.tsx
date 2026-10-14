import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { StremioAddonDescriptor } from '../types/stremio';
import { AddonCard } from './AddonCard';
import { AlertCircle, SearchX } from 'lucide-react';

interface AddonListProps {
  addons: StremioAddonDescriptor[];
  onChange: (updatedAddons: StremioAddonDescriptor[]) => void;
  searchQuery: string;
}

export const AddonList: React.FC<AddonListProps> = ({
  addons,
  onChange,
  searchQuery,
}) => {
  // Configure sensors for touch, mouse, and keyboard interaction
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts (prevents accidental clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Map each item to a stable ID
  const itemIds = useMemo(() => {
    return addons.map((addon, idx) => addon.transportUrl || addon.manifest.id || `addon-${idx}`);
  }, [addons]);

  // Handle Drag & Drop end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(addons, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  // Quick Action: Move item to top
  const handleMoveToTop = (index: number) => {
    if (index <= 0) return;
    const item = addons[index];
    const withoutItem = addons.filter((_, i) => i !== index);
    onChange([item, ...withoutItem]);
  };

  // Quick Action: Move item to bottom
  const handleMoveToBottom = (index: number) => {
    if (index >= addons.length - 1) return;
    const item = addons[index];
    const withoutItem = addons.filter((_, i) => i !== index);
    onChange([...withoutItem, item]);
  };

  // Quick Action: Move item up by 1 position
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    onChange(arrayMove(addons, index, index - 1));
  };

  // Quick Action: Move item down by 1 position
  const handleMoveDown = (index: number) => {
    if (index >= addons.length - 1) return;
    onChange(arrayMove(addons, index, index + 1));
  };

  // Filtered addons based on search query
  const filteredAddonsWithOriginalIndex = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return addons.map((addon, index) => ({ addon, originalIndex: index }));
    }

    return addons
      .map((addon, index) => ({ addon, originalIndex: index }))
      .filter(({ addon }) => {
        const name = addon.manifest.name?.toLowerCase() || '';
        const id = addon.manifest.id?.toLowerCase() || '';
        const desc = addon.manifest.description?.toLowerCase() || '';
        return name.includes(query) || id.includes(query) || desc.includes(query);
      });
  }, [addons, searchQuery]);

  if (addons.length === 0) {
    return (
      <div className="p-12 text-center bg-stremio-surface/60 border border-stremio-border rounded-2xl">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Installed Addons Found</h3>
        <p className="text-sm text-stremio-muted mt-1 max-w-md mx-auto">
          Your Stremio profile does not currently have any addons installed or synced.
        </p>
      </div>
    );
  }

  if (filteredAddonsWithOriginalIndex.length === 0) {
    return (
      <div className="p-12 text-center bg-stremio-surface/60 border border-stremio-border rounded-2xl">
        <SearchX className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Matching Addons</h3>
        <p className="text-sm text-stremio-muted mt-1">
          No addons found matching &ldquo;<span className="text-stremio-accentLight">{searchQuery}</span>&rdquo;.
        </p>
      </div>
    );
  }

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="space-y-3">
      {isSearchActive && (
        <div className="px-4 py-2.5 bg-stremio-accent/10 border border-stremio-accent/30 rounded-xl text-xs text-stremio-accentLight flex items-center justify-between">
          <span>
            Filtering active: showing {filteredAddonsWithOriginalIndex.length} of {addons.length} addons.
          </span>
          <span className="text-gray-400">Clear search to reorder all addons seamlessly.</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2.5">
            {filteredAddonsWithOriginalIndex.map(({ addon, originalIndex }) => (
              <AddonCard
                key={addon.transportUrl || addon.manifest.id || `card-${originalIndex}`}
                addon={addon}
                index={originalIndex}
                total={addons.length}
                onMoveToTop={handleMoveToTop}
                onMoveToBottom={handleMoveToBottom}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
