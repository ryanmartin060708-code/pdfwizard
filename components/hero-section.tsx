'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-6 md:pt-14 md:pb-10 text-center max-w-4xl mx-auto px-4">
      {/* Privacy Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-6 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
        <span>Client-Side Local PDF Engine</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.08]"
      >
        Convert Images to PDF
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed"
      >
        Combine JPG, PNG, WEBP, BMP, GIF, TIFF, AVIF & HEIC images into a single, high-quality PDF document locally in your browser.
      </motion.p>

      {/* Format pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex flex-wrap justify-center items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300"
      >
        {['JPG', 'PNG', 'WEBP', 'BMP', 'GIF', 'TIFF', 'AVIF', 'HEIC'].map((ext) => (
          <span
            key={ext}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 font-semibold shadow-2xs"
          >
            {ext}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
