import { PdfSettings, PageSizePreset, MarginPreset } from '@/types/converter';

export const PAGE_SIZES: Record<Exclude<PageSizePreset, 'AUTO'>, { width: number; height: number; name: string; description: string }> = {
  A4: { width: 595.28, height: 841.89, name: 'A4', description: '210 × 297 mm' },
  LETTER: { width: 612.0, height: 792.0, name: 'Letter', description: '8.5 × 11 in' },
  LEGAL: { width: 612.0, height: 1008.0, name: 'Legal', description: '8.5 × 14 in' },
  A3: { width: 841.89, height: 1190.55, name: 'A3', description: '297 × 420 mm' },
};

export const MARGINS: Record<MarginPreset, { pt: number; name: string; description: string }> = {
  NONE: { pt: 0, name: 'No Margin', description: '0 mm' },
  SMALL: { pt: 14.17, name: 'Small Margin', description: '5 mm' },
  MEDIUM: { pt: 28.35, name: 'Medium Margin', description: '10 mm' },
  LARGE: { pt: 56.69, name: 'Large Margin', description: '20 mm' },
};

export const DEFAULT_PDF_SETTINGS: PdfSettings = {
  pageSize: 'A4',
  orientation: 'PORTRAIT',
  margin: 'SMALL',
  fitMode: 'CONTAIN',
  quality: 0.8,
  pageNumbers: 'NONE',
  title: 'Converted Document',
  author: '',
  outputFilename: 'converted_images.pdf',
  backgroundColor: '#ffffff',
};

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_IMAGE_COUNT = 100;

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/tiff',
  'image/avif',
  'image/heic',
  'image/heif',
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.tiff', '.tif', '.avif', '.heic', '.heif'];
