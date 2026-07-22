'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, ZoomIn, Info } from 'lucide-react';
import { ImageItem } from '@/types/converter';
import { formatBytes } from '@/lib/image-utils';

interface ImagePreviewModalProps {
  item: ImageItem | null;
  onClose: () => void;
  onRotate: (id: string) => void;
}

export function ImagePreviewModal({ item, onClose, onRotate }: ImagePreviewModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-xs">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRotate(item.id)}
                className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="relative flex-1 p-6 bg-neutral-950 flex items-center justify-center min-h-[350px] max-h-[65vh] overflow-auto">
            <img
              src={item.previewUrl}
              alt={item.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 shadow-2xl rounded-lg"
              style={{ transform: `rotate(${item.rotation}deg)` }}
            />
          </div>

          {/* Footer Metadata */}
          <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>
              Resolution:{' '}
              {item.rotation % 180 !== 0
                ? `${item.dimensions.height} × ${item.dimensions.width}`
                : `${item.dimensions.width} × ${item.dimensions.height}`}{' '}
              px
            </span>
            <span>Size: {formatBytes(item.sizeBytes)}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
