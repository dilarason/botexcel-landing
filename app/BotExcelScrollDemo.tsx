"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { OutputQualitySection } from "./components/OutputQualitySection";
import BlogSection from "./components/BlogSection";
import ResourcesSection from "./components/ResourcesSection";
import { AuthAwareCTA } from "./components/AuthAwareCTA";
import { useI18n } from "./lib/i18n";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Aşama etiketleri için üçgen opaklık eğrisi
const stageBand = (p: number, start: number, peak: number, end: number) => {
  if (p <= start || p >= end) return 0;
  if (p === peak) return 1;
  if (p < peak) return clamp((p - start) / (peak - start), 0, 1);
  return clamp(1 - (p - peak) / (end - peak), 0, 1);
};

// Content data arrays are now derived from i18n translations inside the component
// See t.userStories.items, t.capabilities.items, t.templates.items, t.features.items


type DemoStage = "idle" | "uploading" | "analyzing" | "ready" | "error";

interface DemoResult {
  fileName: string;
  columns: string[];
  rows: string[][];
  summary?: string;
  downloadName?: string;
}

const demoSamples: Array<{
  id: string;
  label: string;
  badge: string;
  output: DemoResult;
}> = [
    {
      id: "invoice",
      label: "Örnek fatura.pdf",
      badge: "Perakende satış özeti",
      output: {
        fileName: "fatura_demo.xlsx",
        downloadName: "botexcel-fatura-demo.csv",
        columns: [
          "Kalem",
          "Kategori",
          "Adet",
          "Birim Fiyat (TL)",
          "KDV",
          "Ara Toplam",
        ],
        rows: [
          [
            "FAT-2025-0312",
            "Elektronik",
            "4",
            "3.250,00",
            "18%",
            "12.870,00",
          ],
          [
            "FAT-2025-0313",
            "Ofis Sarf",
            "9",
            "420,00",
            "10%",
            "4.158,00",
          ],
          [
            "FAT-2025-0314",
            "Hizmet",
            "1",
            "2.950,00",
            "18%",
            "3.481,00",
          ],
          [
            "Genel Toplam",
            "—",
            "—",
            "—",
            "—",
            "20.509,00",
          ],
        ],
        summary:
          "12 satır tespit edildi, 3 farklı KDV oranı eşleştirildi ve toplam 20.509,00 TL olarak doğrulandı.",
      },
    },
    {
      id: "bank",
      label: "banka_ekstresi.csv",
      badge: "Finansal hareket dökümü",
      output: {
        fileName: "banka_ekstresi_demo.xlsx",
        downloadName: "botexcel-banka-demo.csv",
        columns: [
          "Tarih",
          "Açıklama",
          "Banka",
          "Kategori",
          "Tutar (TL)",
          "Bakiye",
        ],
        rows: [
          [
            "05.03.2025",
            "POS Satış #18372",
            "BotBank",
            "Gelir",
            "+18.920,00",
            "246.580,00",
          ],
          [
            "05.03.2025",
            "TEDAŞ Otomatik Ödeme",
            "BotBank",
            "Gider",
            "-6.840,00",
            "239.740,00",
          ],
          [
            "06.03.2025",
            "Havale - Tedarikçi",
            "BotBank",
            "Gider",
            "-42.000,00",
            "197.740,00",
          ],
          [
            "06.03.2025",
            "Akşam Kapanış",
            "BotBank",
            "Özet",
            "—",
            "197.740,00",
          ],
        ],
        summary:
          "Dekontlardaki artı/eksi hareketler sınıflandırıldı, bakiye uyumu doğrulandı ve otomatik rapor hazırlandı.",
      },
    },
    {
      id: "receipt",
      label: "kasiyer_fisi.jpg",
      badge: "Görselden OCR",
      output: {
        fileName: "ocr_fis_demo.xlsx",
        downloadName: "botexcel-ocr-demo.csv",
        columns: ["Ürün", "Adet", "Birim", "KDV", "Tutar (TL)"],
        rows: [
          ["Filtre Kahve", "2", "85,00", "10%", "187,00"],
          ["Sandviç", "1", "120,00", "10%", "132,00"],
          ["Kurabiye", "3", "32,00", "1%", "97,00"],
          ["Ara Toplam", "—", "—", "—", "416,00"],
          ["KDV Toplamı", "—", "—", "—", "21,60"],
          ["Ödenecek", "—", "—", "—", "437,60"],
        ],
        summary:
          "OCR ile ürünler tanımlandı, KDV oranları otomatik eşleşti ve kasiyer fişi Excel tabloya dönüştürüldü.",
      },
    },
    {
      id: "contract",
      label: "sozlesme_ek.pdf",
      badge: "Sözleşme madde özetleri",
      output: {
        fileName: "sozlesme_ek_demo.xlsx",
        downloadName: "botexcel-sozlesme-demo.csv",
        columns: [
          "Madde",
          "Başlık",
          "Sorumlu",
          "Termin",
          "Durum",
          "Not",
        ],
        rows: [
          [
            "Madde 4.2",
            "Teslimat Takvimi",
            "Operasyon",
            "15.03.2025",
            "Takipte",
            "Kurye entegrasyonu bekleniyor.",
          ],
          [
            "Madde 6.1",
            "Ücretlendirme",
            "Finans",
            "01.04.2025",
            "Hazır",
            "Fiyat artış klausulü eklendi.",
          ],
          [
            "Madde 8.4",
            "Gizlilik",
            "Hukuk",
            "Devamlı",
            "Yeni NDA şartları onaylandı.",
          ],
        ],
        summary:
          "PDF sözleşme içeriği madde bazlı tabloya dönüştürüldü, sorumlu ekip ve termin tarihleri eşleştirildi.",
      },
    },
  ];

const demoStageDetails: Array<{
  key: Exclude<DemoStage, "idle" | "error">;
  title: string;
  description: string;
}> = [
    {
      key: "uploading",
      title: "1. Yükleniyor",
      description:
        "Belgeniz şifreli bağlantı üzerinden BotExcel motoruna aktarılıyor.",
    },
    {
      key: "analyzing",
      title: "2. Alanlar tanımlanıyor",
      description:
        "Başlıklar, tutarlar, tarih ve KDV alanları otomatik olarak eşleştiriliyor.",
    },
    {
      key: "ready",
      title: "3. Excel hazır",
      description:
        "Tablo, formüller ve özetlerle Excel'e aktarılıyor; indirmeye hazır.",
    },
  ];

const DemoUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [state, setState] = useState<{
    stage: DemoStage;
    fileLabel?: string;
    sampleId?: string;
    progress: number;
    message?: string;
    logs: string[];
    result?: DemoResult;
  }>({
    stage: "idle",
    progress: 0,
    logs: [],
  });

  const clearTimers = () => {
    timersRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const resetDemo = () => {
    clearTimers();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setState({
      stage: "idle",
      progress: 0,
      logs: [],
      message: undefined,
      fileLabel: undefined,
      sampleId: undefined,
      result: undefined,
    });
  };

  const startFlow = (label: string, sampleId?: string) => {
    clearTimers();
    const initialMessage =
      "Dosya şifrelenerek BotExcel motoruna gönderiliyor…";
    setState({
      stage: "uploading",
      fileLabel: label,
      sampleId,
      progress: 0.2,
      message: initialMessage,
      logs: [initialMessage],
      result: undefined,
    });

    const steps: Array<{
      delay: number;
      stage: DemoStage;
      progress: number;
      message: string;
    }> = [
        {
          delay: 900,
          stage: "analyzing",
          progress: 0.65,
          message: "Alanlar, başlıklar ve toplamlar analiz ediliyor…",
        },
        {
          delay: 1700,
          stage: "ready",
          progress: 1,
          message: "Excel önizlemesi hazır.",
        },
      ];

    let accumulatedDelay = 0;
    steps.forEach((step) => {
      accumulatedDelay += step.delay;
      const timeoutId = setTimeout(() => {
        setState((prev) => {
          const logs = [...prev.logs, step.message];
          let result = prev.result;
          if (step.stage === "ready") {
            const sample = demoSamples.find((item) => item.id === prev.sampleId);
            result =
              sample?.output ??
              {
                fileName: "botexcel_demo.xlsx",
                downloadName: "botexcel-demo.csv",
                columns: ["Alan", "Değer"],
                rows: [
                  ["Seçilen dosya", prev.fileLabel ?? "Bilinmiyor"],
                  [
                    "Not",
                    "Bu canlı demo gerçek dönüştürme yerine örnek veriyi gösterir.",
                  ],
                  [
                    "Sonraki adım",
                    "Gerçek hesapla bağlandığınızda dosyanız canlı olarak işlenir.",
                  ],
                ],
                summary:
                  "Demo modu gerçek verinizi yüklemeden deneyimlemeniz için örnek tablo üretir.",
              };
          }

          return {
            ...prev,
            stage: step.stage,
            progress: step.progress,
            message: step.message,
            logs,
            result,
          };
        });
      }, accumulatedDelay);
      timersRef.current.push(timeoutId);
    });
  };

  const handleFileButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) {
      // Aynı dosyayı yeniden seçebilmek için sıfırla
      fileInputRef.current.value = "";
    }
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      clearTimers();
      setState({
        stage: "error",
        fileLabel: file.name,
        sampleId: undefined,
        progress: 0,
        message: "Dosya boyutu 10 MB sınırını aşıyor.",
        logs: ["Dosya boyutu 10 MB sınırını aşıyor."],
        result: undefined,
      });
      return;
    }
    startFlow(file.name);
  };

  const handleSampleClick = (sampleId: string, label: string) => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    startFlow(label, sampleId);
  };

  const handleDownload = () => {
    if (!state.result) return;
    const escapeCsv = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;
    const csvContent = [
      state.result.columns.map(escapeCsv).join(","),
      ...state.result.rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = state.result.downloadName ?? "botexcel-demo.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const progressPercent = Math.round(state.progress * 100);
  const activeStageIndex = demoStageDetails.findIndex(
    (detail) => detail.key === state.stage
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5">
          <h3 className="text-sm font-semibold text-slate-100">
            Belgenizi seçin veya hazır örneklerden birini kullanın
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            PDF, JPG, PNG, XLSX, CSV desteklenir. Maksimum 10 MB.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFileButton}
              className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-900 transition hover:bg-white"
            >
              Belge seçin
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 transition hover:bg-slate-800"
            >
              Demo sıfırla
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls,.docx"
            onChange={handleFileSelected}
            className="hidden"
          />

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Hazır demo paketleri
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demoSamples.map((sample) => {
                const isActive = state.sampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleClick(sample.id, sample.label)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition ${isActive
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : "border-slate-700 text-slate-200 hover:bg-slate-800"
                      }`}
                  >
                    <span>{sample.label}</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {sample.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {state.stage === "idle"
                ? "Henüz dosya seçilmedi."
                : state.fileLabel}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width]"
              style={{ width: `${state.stage === "idle" ? 0 : progressPercent}%` }}
            />
          </div>
          <div className="mt-3 text-sm font-medium text-emerald-300">
            {state.stage === "idle"
              ? "Belge seçerek demo sürecini başlatın."
              : state.stage === "error"
                ? state.message ?? "Bir hata oluştu."
                : state.message}
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
            {state.logs.map((log, index) => (
              <li key={`${log}-${index}`}>• {log}</li>
            ))}
          </ul>
          {state.stage === "error" && (
            <p className="mt-3 text-xs text-rose-400">
              Daha küçük bir dosya deneyebilir veya demo paketlerinden birini
              kullanabilirsiniz.
            </p>
          )}
          {state.result && (
            <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-xs text-emerald-100">
              <div className="font-semibold text-emerald-200">
                {state.result.fileName}
              </div>
              <p className="mt-1 text-emerald-100/80">
                {state.result.summary ??
                  "Demo çıktısı hazır, aşağıdaki tablodan önizleyebilir ve CSV olarak indirebilirsiniz."}
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-emerald-400 px-3 py-1.5 text-[11px] font-medium text-emerald-50 transition hover:bg-emerald-400 hover:text-emerald-950"
              >
                Örnek Excel’i indir (CSV)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
        {demoStageDetails.map((detail, index) => {
          const isActive = detail.key === state.stage;
          const isCompleted =
            activeStageIndex > index || state.stage === "ready";
          const baseClasses =
            "rounded-xl border px-3 py-2 transition-colors duration-200";
          const className = isActive
            ? `${baseClasses} border-emerald-400 bg-emerald-500/15 text-emerald-100`
            : isCompleted
              ? `${baseClasses} border-emerald-400/60 bg-emerald-500/10 text-emerald-100`
              : `${baseClasses} border-slate-800 bg-slate-950/60 text-slate-300`;
          return (
            <div key={detail.key} className={className}>
              <div className="font-semibold text-slate-100">{detail.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-inherit">
                {detail.description}
              </p>
            </div>
          );
        })}
      </div>

      {state.result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-xs text-slate-200">
          <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-100">
                Demo önizleme tablosu
              </div>
              <p className="text-[11px] text-slate-400">
                {state.fileLabel} → {state.result.fileName}
              </p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-[11px]">
              <thead>
                <tr>
                  {state.result.columns.map((column) => (
                    <th
                      key={column}
                      className="border-b border-slate-800 bg-slate-900 px-3 py-2 font-semibold text-slate-200"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.result.rows.map((row, rowIndex) => (
                  <tr key={`${state.result?.fileName}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${cell}-${cellIndex}`}
                        className="border-b border-slate-800 px-3 py-2 text-slate-200/90"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const BotExcelScrollDemo: React.FC = () => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Derive data arrays from i18n translations
  const features = t.features.items;
  const userStories = t.userStories.items;
  const capabilities = t.capabilities.items;
  const templates = t.templates.items;

  // Scroll oranını sadece animasyon bölümüne göre hesapla
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      const animHeight = clientHeight * 3; // 300vh'lik animasyon bölgesi
      const maxAnimScroll = animHeight - clientHeight || 1;
      const p = clamp(scrollTop / maxAnimScroll, 0, 1);
      setProgress(p);
    };
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Canvas çizimleri
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (p: number) => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const { width, height } = canvas;
      const t = clamp(p, 0, 1);
      ctx.clearRect(0, 0, width, height);

      // Arka plan
      const bgStrength = lerp(0.6, 1, t < 0.7 ? t / 0.7 : 1);
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(15,23,42,1)");
      gradient.addColorStop(1, `rgba(15,23,42,${bgStrength})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const spotRadius = width * 0.5;
      const spotGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        spotRadius
      );
      spotGradient.addColorStop(0, "rgba(30,64,175,0.55)");
      spotGradient.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, width, height);

      // Upload ikonu
      if (t > 0.22 && t < 0.55) {
        const local = clamp((t - 0.22) / 0.33, 0, 1);
        const cx = width / 2;
        const cy = height / 2;
        const radius = lerp(36, 44, Math.sin(local * Math.PI));
        const rotation = local * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -radius + 10);
        ctx.lineTo(0, 10);
        ctx.moveTo(-10, -radius + 26);
        ctx.lineTo(0, -radius + 10);
        ctx.lineTo(10, -radius + 26);
        ctx.strokeStyle = "#bbf7d0";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Ayrıştırma şeritleri
      if (t >= 0.5 && t < 0.72) {
        const local = clamp((t - 0.5) / 0.22, 0, 1);
        const bands = 8;
        const bandHeight = height * 0.5 * (1 / bands);
        const startY = height * 0.25;
        for (let i = 0; i < bands; i++) {
          const y = startY + i * bandHeight;
          const shift = (i % 2 === 0 ? 1 : -1) * local * width * 0.15;
          const alpha = 0.08 + local * 0.25;
          ctx.fillStyle = `rgba(56,189,248,${alpha})`;
          ctx.fillRect(width * 0.2 + shift, y, width * 0.6, bandHeight * 0.6);
        }
      }

      // Tablo: kaydırdıkça satır satır, hücre hücre yerleşen veri
      if (t >= 0.7) {
        const local = clamp((t - 0.7) / 0.3, 0, 1);
        const rows = 6;
        const cols = 8;
        const gridWidth = width * 0.7;
        const gridHeight = height * 0.5;
        const cellW = gridWidth / cols;
        const cellH = gridHeight / rows;

        const scale = lerp(0.9, 1, local);
        const offsetX = width / 2 - (gridWidth * scale) / 2;
        const offsetY = height / 2 - (gridHeight * scale) / 2;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        ctx.globalAlpha = 0.2 + local * 0.8;
        ctx.strokeStyle = "rgba(187,247,208,1)";
        ctx.lineWidth = 1;

        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * cellH);
          ctx.lineTo(gridWidth, r * cellH);
          ctx.stroke();
        }
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(c * cellW, 0);
          ctx.lineTo(c * cellW, gridHeight);
          ctx.stroke();
        }

        const fillOrder: Array<[number, number]> = [];
        for (let r = 1; r < rows; r++) {
          for (let c = 1; c < cols - 1; c++) fillOrder.push([r, c]);
        }

        const total = fillOrder.length;
        const easedLocal = local * local;
        const visibleCount = Math.floor(easedLocal * total);

        for (let i = 0; i < visibleCount; i++) {
          const [r, c] = fillOrder[i];
          const baseIndexProgress = i / total;
          const cellProgress = clamp((easedLocal - baseIndexProgress) * 4, 0, 1);
          const x = c * cellW;
          const y = r * cellH;
          const slideY = (1 - cellProgress) * (cellH * 0.3);

          ctx.save();
          ctx.globalAlpha = 0.2 + 0.8 * cellProgress;
          ctx.fillStyle = "rgba(34,197,94,0.9)";
          ctx.fillRect(x + 4, y + 4 + slideY, cellW - 8, cellH - 8);
          ctx.restore();
        }

        ctx.restore();
      }
    };

    draw(progress);
  }, [progress]);

  const heroOpacity = (() => {
    const t = (progress - 0.05) / (0.25 - 0.05);
    return clamp(1 - t, 0, 1);
  })();

  const o2 = stageBand(progress, 0.2, 0.3, 0.4);
  const o3 = stageBand(progress, 0.4, 0.52, 0.64);
  const o4 = stageBand(progress, 0.64, 0.78, 0.92);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white font-sans">

      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-scroll bg-black/95"
      >
        <div className="relative">
          {/* Animasyon bölümü: 300vh + sticky canvas */}
          <div className="relative" style={{ height: "300vh" }}>
            <div className="sticky top-0 h-screen w-full z-20">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div
                  className="max-w-3xl"
                  style={{
                    opacity: heroOpacity,
                    transition: "opacity 200ms linear",
                  }}
                >
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                    {t.hero.tagline}
                  </h1>
                </div>

                <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div
                    className="text-lg md:text-2xl font-medium text-emerald-300 drop-shadow"
                    style={{ opacity: o2 }}
                  >
                    {t.hero.uploading}
                  </div>
                  <div
                    className="text-lg md:text-2xl font-medium text-sky-300 drop-shadow"
                    style={{ opacity: o3 }}
                  >
                    {t.hero.analyzing}
                  </div>
                  <div
                    className="text-xl md:text-3xl font-semibold text-emerald-200 drop-shadow"
                    style={{ opacity: o4 }}
                  >
                    {t.hero.ready}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animasyon bittikten sonra gelen site içerikleri */}
          <div className="relative bg-slate-950 text-left">
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-6 text-center text-slate-50">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                {t.sections.uploadCta}
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
                {t.sections.uploadCtaDesc}
              </p>
              <div className="mt-4 flex justify-center">
                <AuthAwareCTA />
              </div>
            </section>

            {/* Özellikler – kullanıcı hikayelerinden önce */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-14 text-slate-50">
              <header className="mb-6 text-center">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
                  {t.features.sectionTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.sections.featuresHeader}
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl mx-auto">
                  {t.sections.featuresSubheader}
                </p>
              </header>
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feat) => (
                  <article
                    key={feat.title}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-300">{feat.desc}</p>
                  </article>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-6 max-w-2xl mx-auto">
                {t.sections.featuresFooter}
                <br />
                {t.sections.featuresExtra}
              </p>
            </section>

            {/* Kullanıcı hikayeleri */}
            <section id="cozumler" className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-2">
                  {t.userStories.sectionTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.userStories.sectionTitle}
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  {t.userStories.sectionDesc}
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-4">
                {userStories.map((story) => (
                  <article
                    key={story.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-2"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-1">
                      {story.description}
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {story.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>


            <OutputQualitySection />

            {/* Demo & etkileşimli upload alanı */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6 text-center sm:text-left">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
                  {t.sections.demoTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.sections.demoTitle}
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl mx-auto sm:mx-0">
                  {t.sections.demoDesc}
                </p>
              </header>

              <DemoUploader />
            </section>

            {/* Öne çıkan yetkinlikler */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-400 mb-2">
                  {t.sections.capabilitiesTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.sections.capabilitiesTitle}
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((cap) => (
                  <article
                    key={cap.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-1.5"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-300">{cap.text}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Sosyal kanıt */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <div className="rounded-3xl border border-emerald-500/60 bg-gradient-to-br from-emerald-900/60 via-slate-900/80 to-slate-950 p-5 sm:p-6 flex flex-col gap-3">
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300">
                  {t.sections.socialProofTag}
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-emerald-50">
                  {t.sections.socialProofTitle}
                </h2>
                <p className="text-sm text-emerald-50/90">
                  &ldquo;{t.sections.socialProofQuote}&rdquo;
                </p>
                <div className="text-xs text-emerald-100/90 font-medium">
                  {t.sections.socialProofAuthor}
                </div>
              </div>
            </section>

            {/* Ekibin hikayesi / misyon */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  {t.teamStory.sectionTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.teamStory.sectionTitle}
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="text-sm text-slate-300 space-y-3">
                  <p>
                    {t.teamStory.paragraph1}
                  </p>
                  <p>
                    {t.teamStory.paragraph2}
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li>• {t.teamStory.bullet1}</li>
                    <li>• {t.teamStory.bullet2}</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 flex flex-col gap-3">
                  <div>
                    <div className="font-semibold text-slate-100 mb-1">
                      {t.teamStory.workWithTitle}
                    </div>
                    <p>
                      {t.teamStory.workWithDesc}
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 mb-1">
                      {t.teamStory.socialTrustTitle}
                    </div>
                    <p>
                      {t.teamStory.socialTrustDesc}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hazır Excel şablonları */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300 mb-2">
                  {t.templatesSection.sectionTag}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t.templatesSection.sectionTitle}
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <article
                    key={tpl.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-1.5"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-300">{tpl.text}</p>
                  </article>
                ))}
              </div>
            </section>


            {/* Öne çıkan yetkinlikler */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-400 mb-2">
                  Öne çıkan yetkinlikler
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Sadece dönüştürmek değil; doğrulamak, güzelleştirmek,
                  anlamlandırmak.
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((cap) => (
                  <article
                    key={cap.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-1.5"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-300">{cap.text}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Sosyal kanıt */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <div className="rounded-3xl border border-emerald-500/60 bg-gradient-to-br from-emerald-900/60 via-slate-900/80 to-slate-950 p-5 sm:p-6 flex flex-col gap-3">
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300">
                  {t.sections.socialProofTag}
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-emerald-50">
                  {t.sections.socialProofTitle}
                </h2>
                <p className="text-sm text-emerald-50/90">
                  &ldquo;{t.sections.socialProofQuote}&rdquo;
                </p>
                <div className="text-xs text-emerald-100/90 font-medium">
                  {t.sections.socialProofAuthor}
                </div>
              </div>
            </section>

            {/* Ekibin hikayesi / misyon */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Ekibin hikayesi
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Veriye insani bir bakış getirmek için yola çıktık.
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="text-sm text-slate-300 space-y-3">
                  <p>
                    BotExcel, “veri işi”nin sadece satırlardan ibaret
                    olmadığını bilen bir ekip tarafından geliştirildi. Bir
                    tarafında yıllarca bağımsız denetim ve finans raporlamada
                    çalışmış uzmanlar, diğer tarafında üretici yapay zekâ
                    modelleri üzerine çalışan mühendisler var.
                  </p>
                  <p>
                    Amacımız, ekiplerinizi manuel Excel işlerinden kurtarıp,
                    zamanlarını asıl değer ürettikleri kararlara ayırmalarını
                    sağlamak.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li>
                      • İlk satırlarımızı, bir denetim ekibinin 3 günlük işini
                      40 dakikaya indirmek için yazdık.
                    </li>
                    <li>
                      • BotExcel’in çekirdeğinde, Gemma tabanlı AI ve denetime
                      hazır loglama mantığı birlikte çalışır.
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 flex flex-col gap-3">
                  <div>
                    <div className="font-semibold text-slate-100 mb-1">
                      Kimlerle çalışıyoruz?
                    </div>
                    <p>
                      Finans ekipleri, operasyon liderleri, denetim uzmanları
                      ve geliştiricilerle aynı masada oturup gerçek kullanım
                      senaryolarına göre ürün geliştiriyoruz.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 mb-1">
                      Sosyal güven
                    </div>
                    <p>
                      Ekibi daha yakından tanımak için BotExcel kurucularını ve
                      ürün ekibini LinkedIn üzerinden takip edebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hazır Excel şablonları */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300 mb-2">
                  Hazır Excel şablonları
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  En çok kullanılan raporlar tek tıkla indirilmeye hazır.
                </h2>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <article
                    key={tpl.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-1.5"
                  >
                    <h3 className="text-sm font-semibold text-slate-50">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-300">{tpl.text}</p>
                  </article>
                ))}
              </div>
            </section>


            {/* Güven & KVKK / denetim bölümü */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-300 mb-2">
                  Güven & KVKK
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Veriniz size aittir. Biz sadece düzenleriz.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  BotExcel, finansal ve operasyonel verilerin ne kadar kritik
                  olduğunun farkında. Bu yüzden ürünü &ldquo;önce güvenlik&rdquo;
                  prensibiyle tasarladık. Verileriniz yalnızca işlenmek üzere
                  kullanılır, mülkiyeti daima sizde kalır.
                </p>
              </header>

              <div className="grid md:grid-cols-[3fr,2fr] gap-4 items-start">
                <div className="space-y-3 text-sm text-slate-300">
                  <p>
                    Tüm belgeleriniz aktarım sırasında ve kullanım halinde güçlü
                    algoritmalarla şifrelenir. KVKK ve GDPR standartlarıyla
                    uyumlu veri işleme süreçleri sayesinde, hem yasal
                    sorumluluklarınızı yerine getirir hem de iç denetim
                    ekiplerinizi rahatlatırsınız.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li>• Veriler AES-256 ile şifrelenir.</li>
                    <li>
                      • Erişim rolleri RBAC (Role Based Access Control) ile
                      sınırlandırılır.
                    </li>
                    <li>
                      • Tüm işlemler audit log’lara JSON formatında kaydedilir.
                    </li>
                    <li>
                      • Veri saklama bölgeleri Türkiye ve EU datacenter
                      lokasyonlarıyla sınırlıdır.
                    </li>
                  </ul>
                  <a
                    href="/security"
                    className="inline-flex items-center text-xs text-emerald-300 mt-2 hover:text-emerald-200"
                  >
                    Güvenlik politikamızı inceleyin →
                  </a>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-200 font-mono overflow-x-auto">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Audit log örneği
                  </div>
                  <pre className="whitespace-pre text-[11px] leading-snug">
                    {`{
  "document_id": "FATURA-2025-03-0012",
  "row": 42,
  "column": "KDV_TUTAR",
  "old_value": "0",
  "new_value": "1.280,50",
  "model_version": "botexcel-gemma-1.3",
  "updated_by": "ai_engine",
  "timestamp": "2025-03-21T10:14:32Z"
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Teknik özellikler / API bölümü */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Teknik özellikler & API
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Geliştiriciler için: BotExcel API & CLI.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  BotExcel’in AI motoru, REST API ve komut satırı arayüzü (CLI)
                  üzerinden erişilebilir. Mevcut ERP, CRM ve BI sistemlerinize
                  dakikalar içinde entegre edebilirsiniz.
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-4 items-start text-[11px]">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-slate-200 overflow-x-auto">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    API çağrısı
                  </div>
                  <pre className="whitespace-pre leading-snug">
                    {`curl -X POST https://api.botexcel.com/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@banka_ekstresi.pdf" \\
  -F "output_format=xlsx"`}
                  </pre>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-slate-200 overflow-x-auto">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Örnek yanıt
                  </div>
                  <pre className="whitespace-pre leading-snug">
                    {`{
  "job_id": "job_01hv4w98f3",
  "status": "completed",
  "output_url": "https://cdn.botexcel.com/exports/job_01hv4w98f3.xlsx",
  "rows": 482,
  "model_version": "botexcel-gemma-1.3"
}`}
                  </pre>
                </div>
              </div>

              <ul className="mt-4 text-xs text-slate-300 space-y-1.5">
                <li>• Gemma tabanlı AI inference pipeline.</li>
                <li>• ETag ve cache destekli hızlı tekrar sorguları.</li>
                <li>• Satır/sütun bazlı audit log ve hata kodları.</li>
                <li>• CLI ile batch işleme ve cron entegrasyonu.</li>
              </ul>
            </section>

            <BlogSection />
            <ResourcesSection />

            {/* SSS */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Sık sorulan sorular
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Kararsız kalanlar için son netleştirmeler.
                </h2>
              </header>

              <div className="space-y-4 text-sm text-slate-200">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="font-semibold mb-1 text-slate-50">
                    Verilerim nereye kaydediliyor?
                  </h3>
                  <p className="text-sm text-slate-300">
                    Verileriniz tercih ettiğiniz bölgedeki (Türkiye veya EU)
                    veri merkezlerinde saklanır. Varsayılan ayarda, yalnızca
                    işleme için gerekli minimum süre boyunca tutulur ve
                    isterseniz tüm belgeler işleme sonrası otomatik olarak
                    silinebilir.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="font-semibold mb-1 text-slate-50">
                    BotExcel hangi dosya türlerini destekliyor?
                  </h3>
                  <p className="text-sm text-slate-300">
                    PDF, JPG, PNG, Excel (XLSX), CSV ve yaygın banka ekstre
                    formatlarını destekliyoruz. Özel formatlar için entegrasyon
                    ekibimizle birlikte çalışabiliyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="font-semibold mb-1 text-slate-50">
                    AI yanlış alan tespit ederse ne olur?
                  </h3>
                  <p className="text-sm text-slate-300">
                    Hücre bazlı audit trail sayesinde, her değişikliğin
                    kaynağını görebilir ve tek tıkla eski değere
                    dönebilirsiniz. Ayrıca doğrulama kurallarıyla (örn. KDV
                    oranı, toplam tutar) otomatik uyarılar alırsınız.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="font-semibold mb-1 text-slate-50">
                    Çevrimdışı (on-prem) kullanabilir miyim?
                  </h3>
                  <p className="text-sm text-slate-300">
                    Evet. Kurumsal müşteriler için tüm AI motorunu, loglama
                    altyapısını ve entegrasyon katmanını kendi veri merkezinize
                    kurabileceğimiz on-prem paket sunuyoruz.
                  </p>
                </div>
              </div>
            </section>

            {/* Son çağrı */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 text-slate-50">
              <div className="rounded-3xl border border-emerald-500/70 bg-gradient-to-r from-slate-50 via-emerald-50 to-slate-100 px-4 sm:px-6 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-slate-900">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold mb-1">
                    Bugün veri karmaşasını durdurun.
                  </h2>
                  <p className="text-xs sm:text-sm max-w-xl">
                    BotExcel ile birkaç dakikada netliğe ulaşan finans,
                    operasyon ve destek ekiplerinin arasına katılın. PDF,
                    görsel fiş ve ekstrelerinizi otomatik olarak sunuma hazır
                    tablolara dönüştürün.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-emerald-950 hover:bg-emerald-400 sm:text-sm"
                  >
                    Ücretsiz Dene
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-3 py-1.5 text-xs text-emerald-900 hover:bg-emerald-100 sm:text-sm"
                  >
                    Giriş Yap
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotExcelScrollDemo;
