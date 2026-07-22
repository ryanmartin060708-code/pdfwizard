import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PDF Wizard — Image to PDF Converter',
  description:
    'Convert JPG, PNG, WEBP, BMP, GIF, TIFF, AVIF and HEIC images to high quality PDF files instantly in your browser. 100% private with zero server uploads.',
  keywords: [
    'Image to PDF',
    'JPG to PDF',
    'PNG to PDF',
    'WEBP to PDF',
    'HEIC to PDF',
    'Client-Side PDF Generator',
    'PDF Wizard',
  ],
  authors: [{ name: 'Antigravity AI' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-grid-pattern selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
