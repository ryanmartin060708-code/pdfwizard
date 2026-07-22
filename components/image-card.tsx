'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, RotateCw, Crop, ZoomIn, Trash2 } from 'lucide-react';
import { ImageItem } from '@/types/converter';
import { formatBytes } from '@/lib/image-utils';

interface ImageCardProps {
  item: ImageItem;
  index: number;
  onRotate: (id: string) => void;
  onCrop: (item: ImageItem) => void;
  onZoom: (item: ImageItem) => void;
  onRemove: (id: string) => void;
}

export function ImageCard({
  item,
  index,
  onRotate,
  onCrop,
  onZoom,
  onRemove,
}: ImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl bg-white dark:bg-neutral-900 border transition-all duration-200 ${
        isDragging
          ? 'border-neutral-900 dark:border-neutral-100 shadow-2xl opacity-90 scale-[1.03]'
          : 'border-neutral-200/90 dark:border-neutral-800/90 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs hover:shadow-apple'
      }`}
    >
      {/* Page Badge */}
      <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-lg bg-neutral-900/80 dark:bg-neutral-100/90 backdrop-blur-md text-white dark:text-black font-mono text-[11px] font-semibold">
        #{index + 1}
      </div>

      {/* Drag Handle Button */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-grab active:cursor-grabbing transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Thumbnail Container */}
      <div
        onClick={() => onZoom(item)}
        className="relative w-full h-44 rounded-t-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center cursor-pointer group-hover:opacity-95 transition-opacity"
      >
        {/* Render Image with CSS Rotation */}
        <img
          src={item.previewUrl}
          alt={item.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300"
          style={{ transform: `rotate(${item.rotation}deg)` }}
        />

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-neutral-900/20 dark:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoom(item);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:scale-105 transition-transform"
            title="Zoom Preview"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-3.5 space-y-2">
        {/* Filename */}
        <div className="flex items-start justify-between gap-1">
          <p
            className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate w-full"
            title={item.name}
          >
            {item.name}
          </p>
        </div>

        {/* Meta Specs (Dimensions + Size) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          <span>
            {item.rotation % 180 !== 0
              ? `${item.dimensions.height}×${item.dimensions.width}`
              : `${item.dimensions.width}×${item.dimensions.height}`}
            px
          </span>
          <span>{formatBytes(item.sizeBytes)}</span>
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Rotate Button */}
            <button
              type="button"
              onClick={() => onRotate(item.id)}
              className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Crop Button */}
            <button
              type="button"
              onClick={() => onCrop(item)}
              className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Crop Image"
            >
              <Crop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Remove Image"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
