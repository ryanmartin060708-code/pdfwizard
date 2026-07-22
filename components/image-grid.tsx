'use client';

import React from 'react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowUpDown, Layers } from 'lucide-react';
import { ImageItem } from '@/types/converter';
import { ImageCard } from './image-card';
import { formatBytes } from '@/lib/image-utils';

interface ImageGridProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onRotate: (id: string) => void;
  onCrop: (item: ImageItem) => void;
  onZoom: (item: ImageItem) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSort: (by: 'name' | 'size' | 'reverse') => void;
}

export function ImageGrid({
  images,
  onReorder,
  onRotate,
  onCrop,
  onZoom,
  onRemove,
  onClearAll,
  onSort,
}: ImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(images, oldIndex, newIndex));
      }
    }
  };

  const totalBytes = images.reduce((acc, curr) => acc + curr.sizeBytes, 0);

  return (
    <div className="space-y-4 w-full">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        {/* Count & Combined Specs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <Layers className="w-3.5 h-3.5" />
            <span>{images.length} {images.length === 1 ? 'Page' : 'Pages'}</span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            ({formatBytes(totalBytes)})
          </span>
        </div>

        {/* Sort & Bulk Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Sort Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Pages</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-30">
              <button
                type="button"
                onClick={() => onSort('name')}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                By Name (A-Z)
              </button>
              <button
                type="button"
                onClick={() => onSort('size')}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                By Size (Largest)
              </button>
              <button
                type="button"
                onClick={() => onSort('reverse')}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Reverse Order
              </button>
            </div>
          </div>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {images.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImageCard
                    item={item}
                    index={idx}
                    onRotate={onRotate}
                    onCrop={onCrop}
                    onZoom={onZoom}
                    onRemove={onRemove}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
