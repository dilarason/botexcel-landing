"use client";

import { useEffect } from "react";
import DemoUploader from "./DemoUploader";
import { persistSource, readSourceFromUrl } from "../lib/source";

export default function LandingPage() {
  useEffect(() => {
    const src = readSourceFromUrl();
    if (src) {
      persistSource(src);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Mevcut hero / üst bölümler korunur */}
      <section
        id="demo"
        className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 md:flex-row md:items-start"
      >
        <div className="md:w-1/2 space-y-3">
          <h2 className="text-2xl font-semibold">Kendi belgenizle deneyin</h2>
          <p className="text-sm text-slate-300">
            Tek seferlik anonim demo: PDF, CSV veya metin dosyanı yüklüyorsun, ben de
            sana örnek bir Excel çıktısı üretiyorum. Aynı tarayıcıdan ikinci kez demo
            çalıştırmak için artık hesap açman gerekiyor.
          </p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Desteklenen türler: PDF, CSV, TXT, DOCX, JPG, PNG</li>
            <li>• Demo linki tek kullanımlık ve kısa süre sonra otomatik düşüyor.</li>
          </ul>
        </div>

        <div className="md:w-1/2">
          <DemoUploader />
        </div>
      </section>
      {/* Diğer bölümler burada devam eder */}
    </main>
  );
}
