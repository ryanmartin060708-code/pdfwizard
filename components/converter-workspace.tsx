'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useImageConverter } from '@/hooks/use-image-converter';
import { ImageItem, CropArea } from '@/types/converter';
import { HeroSection } from './hero-section';
import { DropzoneArea } from './dropzone-area';
import { ImageGrid } from './image-grid';
import { PdfSettingsPanel } from './pdf-settings-panel';
import { ImageCropModal } from './image-crop-modal';
import { ImagePreviewModal } from './image-preview-modal';
import { PdfPreviewModal } from './pdf-preview-modal';
import { ProgressModal } from './progress-modal';

export function ConverterWorkspace() {
  const {
    images,
    settings,
    progress,
    pdfResult,
    errorToast,
    estimatedOutputSizeBytes,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage,
    updateCrop,
    reorderImages,
    sortImages,
    updateSettings,
    resetSettings,
    convertToPdf,
    downloadPdf,
    clearErrorToast,
  } = useImageConverter();

  const [activeCropItem, setActiveCropItem] = useState<ImageItem | null>(null);
  const [activeZoomItem, setActiveZoomItem] = useState<ImageItem | null>(null);
  const [isPreviewPdfOpen, setIsPreviewPdfOpen] = useState(false);

  const hasImages = images.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorToast}</span>
            </div>
            <button
              type="button"
              onClick={clearErrorToast}
              className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <HeroSection />

      {/* Main Workspace Layout */}
      <div className="space-y-8">
        {/* Dropzone Component */}
        <DropzoneArea onFilesAdded={addImages} hasImages={hasImages} />

        {/* If images present, display Grid and Settings Panel side-by-side or stacked */}
        <AnimatePresence>
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4"
            >
              {/* Image Grid Column (Left/Top on mobile) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <ImageGrid
                  images={images}
                  onReorder={reorderImages}
                  onRotate={rotateImage}
                  onCrop={(item) => setActiveCropItem(item)}
                  onZoom={(item) => setActiveZoomItem(item)}
                  onRemove={removeImage}
                  onClearAll={clearAllImages}
                  onSort={sortImages}
                />
              </div>

              {/* PDF Settings Column (Right/Sticky on desktop) */}
              <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
                <PdfSettingsPanel
                  settings={settings}
                  onChange={updateSettings}
                  onReset={resetSettings}
                  onConvert={convertToPdf}
                  onDownload={downloadPdf}
                  onPreview={() => setIsPreviewPdfOpen(true)}
                  isConverting={progress.isConverting}
                  hasPdfResult={!!pdfResult}
                  estimatedSizeBytes={estimatedOutputSizeBytes}
                  imageCount={images.length}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ImageCropModal
        item={activeCropItem}
        onClose={() => setActiveCropItem(null)}
        onSave={(id: string, crop: CropArea) => updateCrop(id, crop)}
      />

      <ImagePreviewModal
        item={activeZoomItem}
        onClose={() => setActiveZoomItem(null)}
        onRotate={rotateImage}
      />

      <PdfPreviewModal
        pdfUrl={pdfResult?.url || null}
        filename={settings.outputFilename || 'converted_images.pdf'}
        onClose={() => setIsPreviewPdfOpen(false)}
        onDownload={downloadPdf}
      />

      <ProgressModal progress={progress} />
    </div>
  );
}
