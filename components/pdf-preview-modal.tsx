'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfPreviewModalProps {
  pdfUrl: string | null;
  filename: string;
  onClose: () => void;
  onDownload: () => void;
}

export function PdfPreviewModal({
  pdfUrl,
  filename,
  onClose,
  onDownload,
}: PdfPreviewModalProps) {
  if (!pdfUrl) return null;

  const handleDownload = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
    onDownload();
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-md">
                PDF Preview: {filename}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
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

          {/* PDF Viewer Iframe */}
          <div className="flex-1 w-full bg-neutral-950">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="PDF Preview"
              className="w-full h-full border-none"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
