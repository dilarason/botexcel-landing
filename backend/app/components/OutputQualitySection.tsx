"use client";

import React from "react";

export function OutputQualitySection() {
  return (
    <section
      id="output-quality"
      className="w-full bg-slate-950 px-4 py-16 text-slate-50 md:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            ÇIKTI KALİTESİ
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Karmaşık PDF’lerden, sunuma hazır Excel dosyalarına.
          </h2>
          <p className="text-sm text-slate-300 md:text-base">
            Çoğu araç &quot;PDF → Excel&quot; dediğinde sana yeni bir temizlik işi
            bırakır. BotExcel ise yalnızca alanları tanımaz; sayısal formatları,
            para birimlerini ve tarih alanlarını da akıllıca düzeltir.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
              Öncesi
            </p>
            <ul className="space-y-1.5 text-sm text-slate-200">
              <li>• Satır kaymaları, birleşik hücreler, bozuk başlıklar.</li>
              <li>• Tutarsız tarih formatları ve para birimleri.</li>
              <li>• Eksik veya tutmayan KDV / genel toplamlar.</li>
              <li>
                • <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">fatura_final_son2(3).pdf</code> – 14 sayfa, manuel kontrol gerektirir.
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Sonrası (BotExcel ile)
            </p>
            <ul className="space-y-1.5 text-sm text-emerald-50">
              <li>• Net sütun başlıkları ve tutarlı veri formatları.</li>
              <li>• Otomatik KDV, ara toplam ve genel toplam hesaplamaları.</li>
              <li>• KDV özeti, nakit akışı ve müşteri bazlı gelir için hazır pivot ve özet tablolar.</li>
              <li>
                • <code className="rounded bg-emerald-900 px-1 py-0.5 text-xs">fatura_ozet_2025Q1.xlsx</code> – tek sayfada yönetim sunumuna hazır özet.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-300">
            14 sayfalık fatura yığını ≈ 45 dakika manuel temizlik yerine,
            <span className="font-semibold text-emerald-300">
              {" "}
              BotExcel ile 2 dakikada sunuma hazır Excel.
            </span>
          </p>

          <a
            href="/samples/fatura_ozet_2025Q1.xlsx"
            download
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/20"
          >
            Örnek çıktıyı gör
          </a>
        </div>
      </div>
    </section>
  );
}
