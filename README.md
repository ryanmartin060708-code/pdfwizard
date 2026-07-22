# PDF Wizard — Modern Image to PDF Converter

![PDF Wizard Hero Screenshot Placeholder](./public/preview-banner.png)

A modern, fast, and production-ready **Image to PDF Converter** web application inspired by **Vercel** and **Apple** minimalist design principles. Convert single or batch images into clean, downloadable PDF documents 100% locally in your browser with zero server uploads.

---

## ✨ Features

- **100% Private & Client-Side**: All rendering and PDF compilation happen locally using HTML5 Canvas & `pdf-lib`. No files ever leave your device.
- **Universal Image Format Support**:
  - `JPG` / `JPEG`
  - `PNG`
  - `WEBP`
  - `BMP`
  - `GIF`
  - `TIFF`
  - `AVIF`
  - `HEIC` / `HEIF` (where browser supported)
- **Drag-and-Drop Reordering**: Rearrange pages using fluid spring drag-and-drop animations powered by `@dnd-kit`.
- **Image Editing & Previews**:
  - Live thumbnail specs (dimensions in px and file size).
  - Quick 90° clockwise/counter-clockwise rotation.
  - Interactive crop modal with preset aspect ratios (`Free`, `1:1`, `4:3`, `16:9`, `3:2`).
  - High-res zoom preview lightbox.
- **Customizable PDF Settings**:
  - **Page Sizes**: `A4`, `Letter`, `Legal`, `A3`, `Auto` (matches native image aspect).
  - **Orientation**: `Portrait`, `Landscape`, `Auto`.
  - **Margins**: `None (0mm)`, `Small (5mm)`, `Medium (10mm)`, `Large (20mm)`.
  - **Image Fit Modes**: `Fit (Contain)`, `Fill (Stretch)`, `Original (1:1)`, `Cover`.
  - **Compression Quality**: `High (100%)`, `Medium (80%)`, `Low (60%)`.
  - **Page Numbers**: Customizable position (`None`, `Bottom Center`, `Bottom Right`, `Top Right`).
  - **PDF Metadata**: Title, Author, Subject, Producer.
  - **Live Output Size Estimation**: Calculates estimated PDF file size in real time.
  - **Settings Persistence**: Saves your preferences in `localStorage`.
- **Pre-download Preview**: In-browser live PDF viewer modal before exporting.
- **Dark & Light Themes**: Seamless Apple-style theme switching with `next-themes`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Drag & Drop**: `react-dropzone` & `@dnd-kit/core`
- **PDF Engine**: `pdf-lib`
- **Crop Engine**: `react-easy-crop`
- **Icons**: Lucide React
- **Theme**: `next-themes`

---

## 📁 Project Structure

```
pdfwizard/
├── app/
│   ├── layout.tsx             # Root layout with Geist font & ThemeProvider
│   ├── page.tsx               # Main entry page
│   └── globals.css            # Vercel monochrome design tokens & custom utilities
├── components/
│   ├── header.tsx             # Navigation header with logo & theme toggle
│   ├── hero-section.tsx       # Vercel-inspired typography hero section
│   ├── dropzone-area.tsx      # Drag & drop upload area
│   ├── image-grid.tsx         # Sortable thumbnail grid
│   ├── image-card.tsx         # Image item card with specs & action buttons
│   ├── pdf-settings-panel.tsx # PDF configuration panel
│   ├── image-crop-modal.tsx   # Interactive crop modal
│   ├── image-preview-modal.tsx# High-res zoom preview modal
│   ├── pdf-preview-modal.tsx  # PDF preview before download modal
│   ├── progress-modal.tsx     # Animated conversion progress modal
│   └── footer.tsx             # Minimal footer
├── hooks/
│   ├── use-image-converter.ts # Central state management hook
│   └── use-local-storage.ts   # Persistent settings hook
├── lib/
│   ├── pdf-generator.ts       # pdf-lib synthesis engine
│   ├── image-utils.ts         # Canvas conversion, rotation, crop & metadata utils
│   └── constants.ts           # Page presets & limits
├── types/
│   └── converter.ts           # TypeScript interfaces
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or pnpm / yarn

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/ryanmartin060708-code/pdfwizard.git
   cd pdfwizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Vercel

The application is built for 1-click deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the project into Vercel Dashboard.
3. Keep default settings (`Framework Preset: Next.js`).
4. Click **Deploy**.

---

## 🔮 Future Improvements

- [ ] OCR text extraction from uploaded images into PDF text layer.
- [ ] Drag-and-drop watermark overlay onto generated PDF pages.
- [ ] Password encryption & PDF permissions.
- [ ] Multi-PDF merger and page re-ordering.

---

## 📄 License

MIT License. Open source for personal and commercial usage.
