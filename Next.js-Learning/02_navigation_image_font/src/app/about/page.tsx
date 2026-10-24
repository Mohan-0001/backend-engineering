import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center">
        
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          About Page
        </h1>

        <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-xl shadow-md border border-slate-200">
          <Image 
            src="/image.png"
            alt="React Logo"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          This image is optimized using Next.js <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">next/image</code> with responsive sizing and clean layout stability.
        </p>

      </div>
    </main>
  );
}