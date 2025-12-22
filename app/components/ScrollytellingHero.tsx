"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "../lib/i18n";

// Utility functions
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ScrollytellingHero: React.FC = () => {
    const { t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState(0);

    // Scroll progress tracking
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, clientHeight } = container;
            const animHeight = clientHeight * 3; // 300vh animation zone
            const maxScroll = animHeight - clientHeight || 1;
            const p = clamp(scrollTop / maxScroll, 0, 1);
            setProgress(p);
        };

        handleScroll();
        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Canvas animation
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

            ctx.clearRect(0, 0, width, height);

            // Background gradient - Stax.ai colors
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height)
            );
            gradient.addColorStop(0, "#003045");
            gradient.addColorStop(1, "#002032");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Floating particles
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                const x = ((i * 73) % width);
                const y = ((i * 137 + p * 200) % height);
                const size = 1 + (i % 3);
                const alpha = 0.1 + (i % 5) * 0.05;
                ctx.fillStyle = `rgba(0, 189, 233, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            const cx = width / 2;
            const cy = height / 2;

            // Phase 1: Document floating in (0 - 0.3)
            if (p < 0.35) {
                const phase = p / 0.35;
                const docY = lerp(height + 100, cy, phase);
                const docScale = lerp(0.5, 1, phase);
                const docRotation = lerp(-0.2, 0, phase);

                ctx.save();
                ctx.translate(cx, docY);
                ctx.rotate(docRotation);
                ctx.scale(docScale, docScale);

                // Document shape
                const docW = 120;
                const docH = 160;

                // Shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                ctx.fillRect(-docW / 2 + 8, -docH / 2 + 8, docW, docH);

                // Document
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(-docW / 2, -docH / 2, docW, docH);

                // PDF header
                ctx.fillStyle = "#00BDE9";
                ctx.fillRect(-docW / 2, -docH / 2, docW, 30);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 14px system-ui";
                ctx.textAlign = "center";
                ctx.fillText("PDF", 0, -docH / 2 + 20);

                // Text lines
                ctx.fillStyle = "#cbd5e1";
                for (let i = 0; i < 6; i++) {
                    const lineY = -docH / 2 + 50 + i * 16;
                    const lineW = 60 + (i % 3) * 20;
                    ctx.fillRect(-lineW / 2, lineY, lineW, 8);
                }

                ctx.restore();
            }

            // Phase 2: Processing animation (0.3 - 0.65)
            if (p >= 0.3 && p < 0.7) {
                const phase = (p - 0.3) / 0.4;

                // Scanning effect
                const scanY = cy - 80 + phase * 160;
                ctx.strokeStyle = "#00BDE9";
                ctx.lineWidth = 3;
                ctx.shadowColor = "#00BDE9";
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.moveTo(cx - 80, scanY);
                ctx.lineTo(cx + 80, scanY);
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Rotating gear/cog
                const gearX = cx;
                const gearY = cy;
                const gearRadius = 40 + phase * 10;
                const rotation = phase * Math.PI * 4;

                ctx.save();
                ctx.translate(gearX, gearY);
                ctx.rotate(rotation);

                ctx.strokeStyle = "#00BDE9";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(0, 0, gearRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Gear teeth
                const teeth = 8;
                for (let i = 0; i < teeth; i++) {
                    const angle = (i / teeth) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle) * gearRadius, Math.sin(angle) * gearRadius);
                    ctx.lineTo(Math.cos(angle) * (gearRadius + 12), Math.sin(angle) * (gearRadius + 12));
                    ctx.stroke();
                }

                ctx.restore();

                // Data particles flowing
                for (let i = 0; i < 20; i++) {
                    const t = (phase * 3 + i * 0.1) % 1;
                    const startX = cx - 100 + (i % 5) * 40;
                    const startY = cy - 60;
                    const endX = cx - 80 + (i % 4) * 50;
                    const endY = cy + 80;
                    const px = lerp(startX, endX, t);
                    const py = lerp(startY, endY, t);
                    const alpha = 1 - Math.abs(t - 0.5) * 2;

                    ctx.fillStyle = `rgba(0, 189, 233, ${alpha * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Phase 3: Excel table appearing (0.65 - 1.0)
            if (p >= 0.6) {
                const phase = clamp((p - 0.6) / 0.4, 0, 1);

                const rows = 6;
                const cols = 5;
                const cellW = 80;
                const cellH = 32;
                const tableW = cols * cellW;
                const tableH = rows * cellH;

                const tableX = cx - tableW / 2;
                const tableY = cy - tableH / 2;

                const scale = lerp(0.8, 1, phase);
                const tableAlpha = phase;

                ctx.save();
                ctx.globalAlpha = tableAlpha;
                ctx.translate(cx, cy);
                ctx.scale(scale, scale);
                ctx.translate(-cx, -cy);

                // Table shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                ctx.fillRect(tableX + 6, tableY + 6, tableW, tableH);

                // Table background
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(tableX, tableY, tableW, tableH);

                // Header row
                ctx.fillStyle = "#00BDE9";
                ctx.fillRect(tableX, tableY, tableW, cellH);

                // Grid lines
                ctx.strokeStyle = "#e2e8f0";
                ctx.lineWidth = 1;

                for (let r = 0; r <= rows; r++) {
                    ctx.beginPath();
                    ctx.moveTo(tableX, tableY + r * cellH);
                    ctx.lineTo(tableX + tableW, tableY + r * cellH);
                    ctx.stroke();
                }

                for (let c = 0; c <= cols; c++) {
                    ctx.beginPath();
                    ctx.moveTo(tableX + c * cellW, tableY);
                    ctx.lineTo(tableX + c * cellW, tableY + tableH);
                    ctx.stroke();
                }

                // Header text
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 12px system-ui";
                ctx.textAlign = "center";
                const headers = ["Tarih", "Açıklama", "Tutar", "KDV", "Toplam"];
                headers.forEach((h, i) => {
                    ctx.fillText(h, tableX + i * cellW + cellW / 2, tableY + 20);
                });

                // Cell data (appearing row by row)
                const visibleRows = Math.floor(phase * (rows - 1)) + 1;
                ctx.fillStyle = "#64748b";
                ctx.font = "12px system-ui";

                for (let r = 1; r < visibleRows + 1 && r < rows; r++) {
                    const rowAlpha = clamp((phase * (rows - 1) - (r - 1)) * 2, 0, 1);
                    ctx.globalAlpha = tableAlpha * rowAlpha;

                    for (let c = 0; c < cols; c++) {
                        const cellX = tableX + c * cellW + cellW / 2;
                        const cellY = tableY + r * cellH + 20;
                        ctx.fillText("•••", cellX, cellY);
                    }
                }

                ctx.restore();

                // Success checkmark
                if (phase > 0.8) {
                    const checkPhase = (phase - 0.8) / 0.2;
                    const checkX = cx + tableW / 2 + 30;
                    const checkY = tableY + 20;

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(checkX, checkY, 20, 0, Math.PI * 2);
                    ctx.fillStyle = "#22c55e";
                    ctx.globalAlpha = checkPhase;
                    ctx.fill();

                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(checkX - 8, checkY);
                    ctx.lineTo(checkX - 2, checkY + 6);
                    ctx.lineTo(checkX + 8, checkY - 6);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };

        draw(progress);
    }, [progress]);

    // Calculate overlay text opacity
    const heroOpacity = clamp(1 - progress / 0.2, 0, 1);
    const uploadingOpacity = progress > 0.1 && progress < 0.4 ? clamp((progress - 0.1) / 0.1, 0, 1) * clamp((0.4 - progress) / 0.1, 0, 1) : 0;
    const processingOpacity = progress > 0.35 && progress < 0.65 ? clamp((progress - 0.35) / 0.1, 0, 1) * clamp((0.65 - progress) / 0.1, 0, 1) : 0;
    const readyOpacity = progress > 0.7 ? clamp((progress - 0.7) / 0.15, 0, 1) : 0;

    return (
        <div className="relative h-screen w-full">
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-auto"
                style={{ scrollBehavior: "auto" }}
            >
                {/* Scrollable area - 300vh */}
                <div style={{ height: "300vh", position: "relative" }}>
                    {/* Sticky canvas container */}
                    <div className="sticky top-0 h-screen w-full">
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />

                        {/* Overlay text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {/* Hero text */}
                            <div
                                className="text-center px-6 max-w-3xl"
                                style={{ opacity: heroOpacity }}
                            >
                                <p className="text-sm font-mono uppercase tracking-[0.3em] text-[#00BDE9] mb-4">
                                    PDF → EXCEL
                                </p>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                                    {t.hero.tagline}
                                </h1>
                                <p className="text-lg text-slate-300">
                                    Scroll ile dönüşüm hikayesini keşfet
                                </p>
                            </div>

                            {/* Phase labels */}
                            <div className="absolute bottom-[20%] text-center">
                                <p
                                    className="text-xl font-medium text-[#00BDE9]"
                                    style={{ opacity: uploadingOpacity }}
                                >
                                    📄 Belge yükleniyor...
                                </p>
                                <p
                                    className="text-xl font-medium text-[#00BDE9]"
                                    style={{ opacity: processingOpacity }}
                                >
                                    ⚙️ AI analiz ediyor...
                                </p>
                                <p
                                    className="text-2xl font-semibold text-green-400"
                                    style={{ opacity: readyOpacity }}
                                >
                                    ✅ Excel hazır!
                                </p>
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        {progress < 0.1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce">
                                <span className="text-xs font-mono uppercase">Aşağı kaydır</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Section after animation */}
                <div className="bg-[#002032] py-16 px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Şimdi sen dene
                        </h2>
                        <p className="text-slate-300 mb-8">
                            PDF, fatura veya taranmış belgenizi yükleyin.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00BDE9] text-[#002032] font-semibold hover:bg-[#00d4ff] transition-colors"
                            >
                                Hemen Dene
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="#demo"
                                className="text-[#00BDE9] font-medium hover:underline"
                            >
                                Demo bölümüne git →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollytellingHero;
