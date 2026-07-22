'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import { ConversionProgress } from '@/types/converter';

interface ProgressModalProps {
  progress: ConversionProgress;
}

export function ProgressModal({ progress }: ProgressModalProps) {
  if (!progress.isConverting) return null;

  const percentage = Math.round((progress.currentStep / Math.max(1, progress.totalSteps)) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5 text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Generating PDF Document
            </h3>
            <p className="text-xs text-neutral-500 font-mono truncate">
              {progress.statusText}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>{progress.currentStep} / {progress.totalSteps} Pages</span>
              <span>{percentage}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
