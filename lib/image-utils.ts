import { ImageItem, CropArea } from '@/types/converter';

/**
 * Loads an image file and retrieves its dimensions and URL
 */
export async function loadImageDimensions(file: File): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        previewUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = previewUrl;
  });
}

/**
 * Renders an ImageItem to an HTML5 Canvas considering rotation and crop,
 * returning a clean JPEG base64 Data URL and byte array.
 */
export async function renderImageToCanvas(
  item: ImageItem,
  quality: number = 0.8
): Promise<{ dataUrl: string; width: number; height: number; bytes: Uint8Array }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const rotation = (item.rotation || 0) % 360;
        const isRotated90or270 = rotation === 90 || rotation === 270;

        // Base un-cropped dimensions (rotated)
        const uncroppedWidth = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
        const uncroppedHeight = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

        // Create temporary canvas for full rotation first
        const rotCanvas = document.createElement('canvas');
        rotCanvas.width = uncroppedWidth;
        rotCanvas.height = uncroppedHeight;
        const rotCtx = rotCanvas.getContext('2d');

        if (!rotCtx) {
          throw new Error('Canvas context unavailable');
        }

        // Apply rotation matrix
        rotCtx.save();
        if (rotation === 90) {
          rotCtx.translate(uncroppedWidth, 0);
          rotCtx.rotate((90 * Math.PI) / 180);
        } else if (rotation === 180) {
          rotCtx.translate(uncroppedWidth, uncroppedHeight);
          rotCtx.rotate((180 * Math.PI) / 180);
        } else if (rotation === 270) {
          rotCtx.translate(0, uncroppedHeight);
          rotCtx.rotate((270 * Math.PI) / 180);
        }
        rotCtx.drawImage(img, 0, 0);
        rotCtx.restore();

        // Apply crop if available
        let finalCanvas = rotCanvas;
        let finalWidth = uncroppedWidth;
        let finalHeight = uncroppedHeight;

        if (item.crop && item.crop.width > 0 && item.crop.height > 0) {
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = item.crop.width;
          cropCanvas.height = item.crop.height;
          const cropCtx = cropCanvas.getContext('2d');

          if (cropCtx) {
            cropCtx.drawImage(
              rotCanvas,
              item.crop.x,
              item.crop.y,
              item.crop.width,
              item.crop.height,
              0,
              0,
              item.crop.width,
              item.crop.height
            );
            finalCanvas = cropCanvas;
            finalWidth = item.crop.width;
            finalHeight = item.crop.height;
          }
        }

        // Export to JPEG with quality parameter
        const dataUrl = finalCanvas.toDataURL('image/jpeg', quality);

        // Convert dataUrl to Uint8Array for pdf-lib
        const base64Data = dataUrl.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        resolve({
          dataUrl,
          width: finalWidth,
          height: finalHeight,
          bytes,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image element for ${item.name}`));
    };

    img.src = item.previewUrl;
  });
}

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate estimated PDF output size
 */
export function estimatePdfOutputSize(images: ImageItem[], quality: number): number {
  if (images.length === 0) return 0;
  const totalInputBytes = images.reduce((acc, img) => acc + img.sizeBytes, 0);
  
  // Approximate compression multiplier relative to input size & chosen JPEG quality
  const compressionRatio = quality * 0.85;
  const estimatedImageBytes = totalInputBytes * compressionRatio;
  
  // Add ~1.5 KB per page for PDF headers, object tables, and metadata
  const pdfStructureOverhead = images.length * 1500;
  
  return Math.round(estimatedImageBytes + pdfStructureOverhead);
}
