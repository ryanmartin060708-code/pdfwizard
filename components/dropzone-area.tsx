'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ImagePlus, FileCheck } from 'lucide-react';
import { SUPPORTED_EXTENSIONS } from '@/lib/constants';

interface DropzoneAreaProps {
  onFilesAdded: (files: File[]) => void;
  hasImages: boolean;
}

export function DropzoneArea({ onFilesAdded, hasImages }: DropzoneAreaProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': SUPPORTED_EXTENSIONS,
    },
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive
            ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900/90 scale-[1.005] shadow-xl'
            : hasImages
            ? 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/60 p-6 shadow-apple'
            : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-400 bg-white dark:bg-neutral-900/60 p-10 md:p-14 shadow-apple'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Animated Icon Container */}
          <motion.div
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              isDragActive
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 shadow-xs group-hover:scale-105'
            }`}
          >
            {isDragActive ? (
              <FileCheck className="w-8 h-8 stroke-[1.8]" />
            ) : (
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            )}
          </motion.div>

          {/* Text Instructions */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {isDragActive ? 'Drop images here' : 'Drag & drop your images here'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm font-medium">
              Supports JPG, PNG, WEBP, BMP, GIF, TIFF, AVIF & HEIC up to 25MB each
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>

        {/* Drag Overlay Effect */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none bg-neutral-900/5 dark:bg-white/5 backdrop-blur-[1px] flex items-center justify-center"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
