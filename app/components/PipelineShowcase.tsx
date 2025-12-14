"use client";

import React, { useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const stageBand = (p: number, start: number, peak: number, end: number) => {
  if (p <= start || p >= end) return 0;
  if (p === peak) return 1;
  if (p < peak) return clamp((p - start) / (peak - start), 0, 1);
  return clamp(1 - (p - peak) / (end - peak), 0, 1);
};

export function PipelineShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Basit döngü: 0 → 1 → 0 arası animasyon
  useEffect(() => {
    let frame: number;
    let value = 0;
    let direction = 1;

    const tick = () => {
      value += direction * 0.0035;
      if (value >= 1) {
        value = 1;
        direction = -1;
      } else if (value <= 0) {
        value = 0;
        direction = 1;
      }
      setProgress(value);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Canvas çizimleri
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (p: number) => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 1200;
      const height = parent?.clientHeight || 560;
      canvas.width = width;
      canvas.height = height;
      const t = clamp(p, 0, 1);
      ctx.clearRect(0, 0, width, height);

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
        spotRadius,
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

      // Grid yerleşmesi
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

  const o2 = stageBand(progress, 0.2, 0.3, 0.4);
  const o3 = stageBand(progress, 0.4, 0.52, 0.64);
  const o4 = stageBand(progress, 0.64, 0.78, 0.92);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/10 to-slate-950" />
      <canvas ref={canvasRef} className="block w-full min-h-[420px] md:min-h-[560px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Akış
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Veri karmaşasından tablo netliğine.
          </h2>
          <p className="text-sm md:text-base text-slate-200/80">
            Fatura, sözleşme, fotoğraf, CSV… BotExcel karmaşık dosyaları otomatik okuyup dakikalar içinde anlamlı Excel
            tablolarına çevirir.
          </p>
        </div>

        <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="text-lg md:text-2xl font-medium text-emerald-300 drop-shadow" style={{ opacity: o2 }}>
            Dosya yükleniyor…
          </div>
          <div className="text-lg md:text-2xl font-medium text-sky-300 drop-shadow" style={{ opacity: o3 }}>
            Veri ayrıştırılıyor…
          </div>
          <div className="text-xl md:text-3xl font-semibold text-emerald-200 drop-shadow" style={{ opacity: o4 }}>
            Excel hazır.
          </div>
        </div>
      </div>
    </section>
  );
}
