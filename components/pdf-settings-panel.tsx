'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  FileText,
  Layout,
  Maximize,
  SlidersHorizontal,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PdfSettings, PageSizePreset, PageOrientation, MarginPreset, ImageFitMode, QualityPreset, PageNumberPosition } from '@/types/converter';
import { PAGE_SIZES, MARGINS } from '@/lib/constants';
import { formatBytes } from '@/lib/image-utils';

interface PdfSettingsPanelProps {
  settings: PdfSettings;
  onChange: (newSettings: Partial<PdfSettings>) => void;
  onReset: () => void;
  onConvert: () => void;
  onDownload: () => void;
  onPreview: () => void;
  isConverting: boolean;
  hasPdfResult: boolean;
  estimatedSizeBytes: number;
  imageCount: number;
}

export function PdfSettingsPanel({
  settings,
  onChange,
  onReset,
  onConvert,
  onDownload,
  onPreview,
  isConverting,
  hasPdfResult,
  estimatedSizeBytes,
  imageCount,
}: PdfSettingsPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-5 shadow-apple space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Settings className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            PDF Document Settings
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
          title="Reset to default settings"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Settings Grid / Accordion */}
      <div className="space-y-5">
        {/* 1. Page Size */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
            <span>Page Size</span>
            <span className="text-[11px] font-mono text-neutral-400">
              {settings.pageSize === 'AUTO' ? 'Matches Image' : PAGE_SIZES[settings.pageSize as keyof typeof PAGE_SIZES]?.description}
            </span>
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
            {(['A4', 'LETTER', 'LEGAL', 'A3', 'AUTO'] as PageSizePreset[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ pageSize: size })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  settings.pageSize === size
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {size === 'LETTER' ? 'Letter' : size === 'LEGAL' ? 'Legal' : size}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Orientation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Page Orientation
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
            {(['PORTRAIT', 'LANDSCAPE', 'AUTO'] as PageOrientation[]).map((orient) => (
              <button
                key={orient}
                type="button"
                onClick={() => onChange({ orientation: orient })}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  settings.orientation === orient
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {orient.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Margins */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
            <span>Margins</span>
            <span className="text-[11px] font-mono text-neutral-400">
              {MARGINS[settings.margin].description}
            </span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
            {(['NONE', 'SMALL', 'MEDIUM', 'LARGE'] as MarginPreset[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ margin: m })}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  settings.margin === m
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {m.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Image Fit Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Image Layout & Fit
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
            {(['CONTAIN', 'FILL', 'ORIGINAL', 'COVER'] as ImageFitMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange({ fitMode: mode })}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  settings.fitMode === mode
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {mode === 'CONTAIN' ? 'Fit' : mode.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Image Compression / Quality */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>Compression Quality</span>
            <span className="font-mono text-neutral-500">
              {Math.round(settings.quality * 100)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
            {([1.0, 0.8, 0.6] as QualityPreset[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange({ quality: q })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  settings.quality === q
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {q === 1.0 ? 'High (100%)' : q === 0.8 ? 'Medium (80%)' : 'Low (60%)'}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <span>Advanced PDF Settings (Page Numbers, Title, Filename)</span>
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isAdvancedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-3.5 pt-2 border-t border-neutral-100 dark:border-neutral-800"
            >
              {/* Output Filename */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Output Filename
                </label>
                <input
                  type="text"
                  value={settings.outputFilename}
                  onChange={(e) => onChange({ outputFilename: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                />
              </div>

              {/* Page Numbers */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Page Numbering Position
                </label>
                <select
                  value={settings.pageNumbers}
                  onChange={(e) => onChange({ pageNumbers: e.target.value as PageNumberPosition })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="NONE">No Page Numbers</option>
                  <option value="BOTTOM_CENTER">Bottom Center</option>
                  <option value="BOTTOM_RIGHT">Bottom Right</option>
                  <option value="TOP_RIGHT">Top Right</option>
                </select>
              </div>

              {/* Title & Author */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                    PDF Document Title
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                    Author / Creator
                  </label>
                  <input
                    type="text"
                    value={settings.author}
                    onChange={(e) => onChange({ author: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Specs Bar (Estimated File Size) */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
        <span>Est. Output Size:</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          {formatBytes(estimatedSizeBytes)}
        </span>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-2 pt-2">
        {hasPdfResult ? (
          <div className="grid grid-cols-2 gap-2">
            {/* Preview Button */}
            <button
              type="button"
              onClick={onPreview}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium text-sm transition-all shadow-xs active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={imageCount === 0 || isConverting}
            onClick={onConvert}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Convert to PDF ({imageCount})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
