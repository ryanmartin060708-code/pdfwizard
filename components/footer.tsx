'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { WizardLogo } from './wizard-logo';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200/80 dark:border-neutral-800/80 py-10 bg-white/50 dark:bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          <div className="w-5 h-5 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-black">
            <WizardLogo className="w-3 h-3" />
          </div>
          <span>PDF Wizard &copy; {new Date().getFullYear()} — Client-Side Image to PDF Converter</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No data leaves your device
          </span>
          <span>Next.js 15 &bull; Tailwind CSS &bull; pdf-lib</span>
        </div>
      </div>
    </footer>
  );
}
