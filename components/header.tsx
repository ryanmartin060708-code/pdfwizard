'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { FileText, Sun, Moon, ShieldCheck, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-black shadow-sm">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-50">
              PDF Wizard
            </span>
          </div>
        </div>

        {/* Privacy Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Client-Side & Private</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-xs"
            aria-label="GitHub Repository"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
