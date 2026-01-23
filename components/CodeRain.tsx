"use client";

import { useEffect, useState } from "react";

// Snippets of "fun" code to display in the background
const codeSnippets = [
  "=EĞER([@Tutar]>0;\"Onay\";\"Kontrol\")",
  "=TOPLA.ÇARPIM(Tutarlar;KDV)",
  "=DÜŞEYARA([@Sipariş];Tablo1;3;0)",
  "=TARİH(YIL(Bugün);AY(Bugün);GÜN(Bugün))",
  "BotExcel: Dönüşüm tamamlandı",
  "Özet: 24 satır, 3 uyarı",
  "Uyarı: Mükerrer satır tespit edildi",
  "KDV %20 kontrolü: Uyumlu",
  "Alan eşleştirme: 18/18",
  "Şablon: Finans_Raporu_v2",
  "Excel çıktı: hazır",
  "PDF → Excel: başarı",
  "Kontrol: Tarih formatı düzeltildi",
  "Rapor: 12 kolon standartlandı",
  "Toplam: 1.245.320,50 TL",
  "Not: Kur farkı satırda işlendi",
];

export default function CodeRain() {
  const [columns, setColumns] = useState<
    { delay: string; duration: string; opacity: number; snippets: string[] }[]
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use a timeout to push the state update to the next tick
    // avoiding synchronous setState warning in useEffect
    const timer = setTimeout(() => {
      if (typeof window === "undefined") return;

      const isMobile = window.innerWidth < 768;
      // Reduced number of columns for performance
      const cols = Array.from({ length: isMobile ? 5 : 12 }).map(() => ({
        delay: `${Math.random() * -30}s`,
        duration: `${30 + Math.random() * 20}s`,
        opacity: Math.random() * 0.5 + 0.3,
        // Pre-shuffle snippets for each column to avoid doing it in render
        snippets: [...codeSnippets].sort(() => Math.random() - 0.5),
      }));
      setColumns(cols);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Render placeholder or null until hydrated to avoid hydration mismatch
  if (!mounted || columns.length === 0)
    return (
      <div
        className="absolute inset-0 bg-background -z-10"
        suppressHydrationWarning
      />
    );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute inset-0 flex justify-between opacity-15 px-2"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 text-[10px] md:text-xs font-mono text-primary whitespace-nowrap pt-[100vh] animate-code-rain"
            style={{
              animationDelay: col.delay,
              animationDuration: col.duration,
              opacity: col.opacity,
              willChange: "transform", // Hint for browser optimization
            }}
          >
            {/* Reduced repetitions to minimize DOM nodes (was 10, now 4) */}
            {Array.from({ length: 4 }).map((_, k) => (
              <div key={k}>
                {col.snippets.map((snippet, j) => (
                  <div key={j} className="transform rotate-0 mb-4">
                    {snippet || ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
