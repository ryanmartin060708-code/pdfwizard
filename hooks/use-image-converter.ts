import { useState, useCallback, useEffect } from 'react';
import { ImageItem, PdfSettings, ConversionProgress, CropArea } from '@/types/converter';
import { DEFAULT_PDF_SETTINGS, MAX_FILE_SIZE_BYTES, MAX_IMAGE_COUNT } from '@/lib/constants';
import { loadImageDimensions, estimatePdfOutputSize } from '@/lib/image-utils';
import { generatePdf } from '@/lib/pdf-generator';
import { useLocalStorage } from './use-local-storage';

export function useImageConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useLocalStorage<PdfSettings>('pdf_wizard_settings', DEFAULT_PDF_SETTINGS);
  
  const [progress, setProgress] = useState<ConversionProgress>({
    currentStep: 0,
    totalSteps: 0,
    statusText: '',
    isConverting: false,
  });

  const [pdfResult, setPdfResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      if (pdfResult?.url) URL.revokeObjectURL(pdfResult.url);
    };
  }, []);

  const addImages = useCallback(
    async (files: File[]) => {
      setErrorToast(null);

      if (images.length + files.length > MAX_IMAGE_COUNT) {
        setErrorToast(`Maximum ${MAX_IMAGE_COUNT} images allowed per PDF. Some files were skipped.`);
      }

      const availableSlots = MAX_IMAGE_COUNT - images.length;
      const filesToProcess = files.slice(0, availableSlots);

      const newItems: ImageItem[] = [];

      for (const file of filesToProcess) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setErrorToast(`"${file.name}" exceeds maximum allowed file size of 25 MB.`);
          continue;
        }

        try {
          const { width, height, previewUrl } = await loadImageDimensions(file);
          const item: ImageItem = {
            id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            file,
            previewUrl,
            name: file.name,
            sizeBytes: file.size,
            dimensions: { width, height },
            type: file.type || 'image/jpeg',
            rotation: 0,
          };
          newItems.push(item);
        } catch (err) {
          console.error(`Failed to process ${file.name}`, err);
          setErrorToast(`Failed to load "${file.name}". File may be corrupted or unsupported.`);
        }
      }

      if (newItems.length > 0) {
        setImages((prev) => [...prev, ...newItems]);
      }
    },
    [images.length]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAllImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    if (pdfResult?.url) {
      URL.revokeObjectURL(pdfResult.url);
      setPdfResult(null);
    }
  }, [images, pdfResult]);

  const rotateImage = useCallback((id: string, delta: number = 90) => {
    setImages((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newRotation = (item.rotation + delta + 360) % 360;
          return { ...item, rotation: newRotation };
        }
        return item;
      })
    );
  }, []);

  const updateCrop = useCallback((id: string, crop?: CropArea) => {
    setImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, crop } : item))
    );
  }, []);

  const reorderImages = useCallback((newItems: ImageItem[]) => {
    setImages(newItems);
  }, []);

  const sortImages = useCallback((by: 'name' | 'size' | 'reverse') => {
    setImages((prev) => {
      const copy = [...prev];
      if (by === 'name') {
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      } else if (by === 'size') {
        return copy.sort((a, b) => b.sizeBytes - a.sizeBytes);
      } else if (by === 'reverse') {
        return copy.reverse();
      }
      return copy;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PdfSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_PDF_SETTINGS);
  }, [setSettings]);

  const convertToPdf = useCallback(async () => {
    if (images.length === 0) return;

    setProgress({
      currentStep: 0,
      totalSteps: images.length,
      statusText: 'Starting PDF generation...',
      isConverting: true,
    });

    try {
      if (pdfResult?.url) {
        URL.revokeObjectURL(pdfResult.url);
        setPdfResult(null);
      }

      const result = await generatePdf(images, settings, (p) => setProgress(p));
      setPdfResult({ blob: result.blob, url: result.url });

      setProgress((prev) => ({ ...prev, isConverting: false, statusText: 'PDF ready!' }));
      return result;
    } catch (error) {
      console.error('PDF generation error:', error);
      setErrorToast('Failed to generate PDF document. Please try again.');
      setProgress((prev) => ({ ...prev, isConverting: false, statusText: 'Error generating PDF' }));
      return null;
    }
  }, [images, settings, pdfResult]);

  const downloadPdf = useCallback(() => {
    if (!pdfResult?.url) return;
    const a = document.createElement('a');
    a.href = pdfResult.url;
    a.download = settings.outputFilename || 'converted_images.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [pdfResult, settings.outputFilename]);

  const estimatedOutputSizeBytes = estimatePdfOutputSize(images, settings.quality);

  return {
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
    clearErrorToast: () => setErrorToast(null),
  };
}
