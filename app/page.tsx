import React from 'react';
import { Header } from '@/components/header';
import { ConverterWorkspace } from '@/components/converter-workspace';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6 md:py-10">
        <ConverterWorkspace />
      </main>
      <Footer />
    </div>
  );
}
