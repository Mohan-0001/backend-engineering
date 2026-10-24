
import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          About Page
        </h1>

        <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-xl shadow-md border border-slate-200">
          <Image
            src={"/image.png"}
            // src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8"
            alt="Beautiful landscape"
            fill
            sizes="192px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          This image is displayed using Next.js next/image
          with responsive sizing and layout stability.
        </p>
      </div>
    </main>
  );
}
