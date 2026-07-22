import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ImageItem, PdfSettings, ConversionProgress } from '@/types/converter';
import { PAGE_SIZES, MARGINS } from './constants';
import { renderImageToCanvas } from './image-utils';

export async function generatePdf(
  images: ImageItem[],
  settings: PdfSettings,
  onProgress?: (progress: ConversionProgress) => void
): Promise<{ blob: Blob; url: string; bytes: Uint8Array }> {
  if (images.length === 0) {
    throw new Error('No images provided for PDF generation.');
  }

  const pdfDoc = await PDFDocument.create();

  // Set document metadata
  if (settings.title) pdfDoc.setTitle(settings.title);
  if (settings.author) pdfDoc.setAuthor(settings.author);
  pdfDoc.setProducer('PDF Wizard (Local Client PDF Engine)');
  pdfDoc.setCreator('PDF Wizard');

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = images.length;

  for (let i = 0; i < totalPages; i++) {
    const item = images[i];

    if (onProgress) {
      onProgress({
        currentStep: i + 1,
        totalSteps: totalPages,
        statusText: `Processing image ${i + 1} of ${totalPages}: ${item.name}`,
        isConverting: true,
      });
    }

    // Render image to canvas with rotation, crop, and quality settings
    const rendered = await renderImageToCanvas(item, settings.quality);

    // Determine base page dimensions
    let pageWidth: number;
    let pageHeight: number;

    if (settings.pageSize === 'AUTO') {
      pageWidth = rendered.width * 0.75; // Convert px to pt approx (72 dpi)
      pageHeight = rendered.height * 0.75;
    } else {
      const preset = PAGE_SIZES[settings.pageSize];
      pageWidth = preset.width;
      pageHeight = preset.height;
    }

    // Handle Orientation
    let isLandscape = settings.orientation === 'LANDSCAPE';
    if (settings.orientation === 'AUTO') {
      isLandscape = rendered.width > rendered.height;
    }

    if (settings.pageSize !== 'AUTO') {
      if (isLandscape && pageWidth < pageHeight) {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      } else if (!isLandscape && pageWidth > pageHeight) {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }
    }

    // Add new page to document
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Embed JPEG image buffer
    const pdfImage = await pdfDoc.embedJpg(rendered.bytes);

    // Calculate margins
    const marginPt = MARGINS[settings.margin].pt;
    const contentWidth = Math.max(10, pageWidth - marginPt * 2);
    const contentHeight = Math.max(10, pageHeight - marginPt * 2);

    // Calculate draw dimensions based on fitMode
    let drawWidth = contentWidth;
    let drawHeight = contentHeight;
    let drawX = marginPt;
    let drawY = marginPt;

    const imgAspect = rendered.width / rendered.height;
    const contentAspect = contentWidth / contentHeight;

    if (settings.fitMode === 'CONTAIN') {
      if (imgAspect > contentAspect) {
        drawWidth = contentWidth;
        drawHeight = contentWidth / imgAspect;
      } else {
        drawHeight = contentHeight;
        drawWidth = contentHeight * imgAspect;
      }
      drawX = marginPt + (contentWidth - drawWidth) / 2;
      drawY = marginPt + (contentHeight - drawHeight) / 2;
    } else if (settings.fitMode === 'FILL') {
      drawWidth = contentWidth;
      drawHeight = contentHeight;
      drawX = marginPt;
      drawY = marginPt;
    } else if (settings.fitMode === 'ORIGINAL') {
      drawWidth = rendered.width * 0.75;
      drawHeight = rendered.height * 0.75;
      // Cap at content bounds if larger
      if (drawWidth > contentWidth || drawHeight > contentHeight) {
        if (imgAspect > contentAspect) {
          drawWidth = contentWidth;
          drawHeight = contentWidth / imgAspect;
        } else {
          drawHeight = contentHeight;
          drawWidth = contentHeight * imgAspect;
        }
      }
      drawX = marginPt + (contentWidth - drawWidth) / 2;
      drawY = marginPt + (contentHeight - drawHeight) / 2;
    } else if (settings.fitMode === 'COVER') {
      if (imgAspect > contentAspect) {
        drawHeight = contentHeight;
        drawWidth = contentHeight * imgAspect;
      } else {
        drawWidth = contentWidth;
        drawHeight = contentWidth / imgAspect;
      }
      drawX = marginPt + (contentWidth - drawWidth) / 2;
      drawY = marginPt + (contentHeight - drawHeight) / 2;
    }

    // Draw background color if non-white
    if (settings.backgroundColor && settings.backgroundColor !== '#ffffff') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0, 0, 0),
      });
    }

    // Draw image onto page
    page.drawImage(pdfImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });

    // Draw page numbers if enabled
    if (settings.pageNumbers !== 'NONE') {
      const pageText = `Page ${i + 1} of ${totalPages}`;
      const fontSize = 9;
      const textWidth = font.widthOfTextAtSize(pageText, fontSize);
      const padding = 12;

      let textX = marginPt;
      let textY = padding;

      if (settings.pageNumbers === 'BOTTOM_CENTER') {
        textX = (pageWidth - textWidth) / 2;
        textY = Math.max(6, marginPt / 2);
      } else if (settings.pageNumbers === 'BOTTOM_RIGHT') {
        textX = pageWidth - marginPt - textWidth;
        textY = Math.max(6, marginPt / 2);
      } else if (settings.pageNumbers === 'TOP_RIGHT') {
        textX = pageWidth - marginPt - textWidth;
        textY = pageHeight - Math.max(12, marginPt / 2);
      }

      page.drawText(pageText, {
        x: textX,
        y: textY,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  if (onProgress) {
    onProgress({
      currentStep: totalPages,
      totalSteps: totalPages,
      statusText: 'Finalizing PDF file...',
      isConverting: true,
    });
  }

  const pdfBytes = await pdfDoc.save();
  // Create Blob with type application/pdf
  // Create a copy of the Uint8Array buffer to prevent detached ArrayBuffer issues
  const byteArray = new Uint8Array(pdfBytes);
  const blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, bytes: byteArray };
}
