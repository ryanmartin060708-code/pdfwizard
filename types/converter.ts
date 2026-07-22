export type PageSizePreset = 'A4' | 'LETTER' | 'LEGAL' | 'A3' | 'AUTO';
export type PageOrientation = 'PORTRAIT' | 'LANDSCAPE' | 'AUTO';
export type MarginPreset = 'NONE' | 'SMALL' | 'MEDIUM' | 'LARGE';
export type ImageFitMode = 'CONTAIN' | 'FILL' | 'ORIGINAL' | 'COVER';
export type QualityPreset = 1.0 | 0.8 | 0.6;
export type PageNumberPosition = 'NONE' | 'BOTTOM_CENTER' | 'BOTTOM_RIGHT' | 'TOP_RIGHT';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };
  type: string;
  rotation: number; // 0, 90, 180, 270
  crop?: CropArea;
  aspectRatio?: number;
}

export interface PdfSettings {
  pageSize: PageSizePreset;
  orientation: PageOrientation;
  margin: MarginPreset;
  fitMode: ImageFitMode;
  quality: QualityPreset;
  pageNumbers: PageNumberPosition;
  title: string;
  author: string;
  outputFilename: string;
  backgroundColor: string;
}

export interface ConversionProgress {
  currentStep: number;
  totalSteps: number;
  statusText: string;
  isConverting: boolean;
}
