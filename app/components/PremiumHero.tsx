"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../lib/i18n";

const PremiumHero: React.FC = () => {
    const { t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Hero text animations
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // PDF Document animations
    const pdfOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.45, 0.55], [0, 1, 1, 0]);
    const pdfScale = useTransform(scrollYProgress, [0.1, 0.25], [0.8, 1]);
    const pdfY = useTransform(scrollYProgress, [0.1, 0.25, 0.45, 0.55], [100, 0, 0, -50]);
    const pdfRotate = useTransform(scrollYProgress, [0.1, 0.25], [5, 0]);

    // Processing indicator
    const processingOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const scanLineY = useTransform(scrollYProgress, [0.35, 0.6], ["-100%", "200%"]);

    // Excel table animations
    const excelOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
    const excelScale = useTransform(scrollYProgress, [0.55, 0.75], [0.9, 1]);
    const excelY = useTransform(scrollYProgress, [0.55, 0.75], [80, 0]);

    // Checkmark
    const checkOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
    const checkScale = useTransform(scrollYProgress, [0.75, 0.85], [0.5, 1]);

    // Background glow
    const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.1, 0.3, 0.1]);

    return (
        <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#002032]">
                {/* Animated background glow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: glowOpacity }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00BDE9]/30 rounded-full blur-[150px]" />
                </motion.div>

                {/* Static background particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#00BDE9]/20 rounded-full"
                            style={{
                                left: `${(i * 37) % 100}%`,
                                top: `${(i * 53) % 100}%`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative h-full flex items-center justify-center">
                    {/* Hero Text */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
                        style={{ opacity: heroOpacity, y: heroY }}
                    >
                        <p className="text-sm font-mono uppercase tracking-[0.3em] text-[#00BDE9] mb-4">
                            PDF → EXCEL DÖNÜŞÜMÜ
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl">
                            {t.hero.tagline}
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-8">
                            Scroll ile dönüşümü keşfet
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 animate-bounce">
                            <span className="text-sm">↓</span>
                        </div>
                    </motion.div>

                    {/* PDF Document Card */}
                    <motion.div
                        className="absolute w-[280px] sm:w-[320px]"
                        style={{
                            opacity: pdfOpacity,
                            scale: pdfScale,
                            y: pdfY,
                            rotate: pdfRotate,
                        }}
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
                            {/* PDF Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                    <path d="M14 2v6h6M12 18v-6M9 15h6" />
                                </svg>
                                <span className="text-white font-semibold text-sm">fatura_2024.pdf</span>
                            </div>

                            {/* PDF Content */}
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                                <div className="h-4 bg-slate-200 rounded w-5/6" />
                                <div className="h-3 bg-slate-100 rounded w-2/3 mt-4" />
                                <div className="h-3 bg-slate-100 rounded w-4/5" />
                                <div className="h-3 bg-slate-100 rounded w-3/4" />
                                <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
                                    <span className="text-xs text-slate-400">Toplam:</span>
                                    <span className="text-sm font-bold text-slate-700">₺12,450.00</span>
                                </div>
                            </div>

                            {/* Scanning line overlay */}
                            <motion.div
                                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00BDE9] to-transparent"
                                style={{
                                    top: scanLineY,
                                    opacity: processingOpacity,
                                    boxShadow: "0 0 20px 5px rgba(0, 189, 233, 0.5)"
                                }}
                            />
                        </div>

                        {/* Processing label */}
                        <motion.div
                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                            style={{ opacity: processingOpacity }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00BDE9]/10 border border-[#00BDE9]/30 text-[#00BDE9] text-sm font-medium">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                AI analiz ediyor...
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Excel Table */}
                    <motion.div
                        className="absolute w-[340px] sm:w-[420px]"
                        style={{
                            opacity: excelOpacity,
                            scale: excelScale,
                            y: excelY,
                        }}
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
                            {/* Excel Header */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                    <path d="M14 2v6h6" />
                                </svg>
                                <span className="text-white font-semibold text-sm">fatura_2024.xlsx</span>
                                <motion.div
                                    className="ml-auto bg-white/20 rounded-full p-1"
                                    style={{ opacity: checkOpacity, scale: checkScale }}
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Excel Table Content */}
                            <div className="p-4">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-2 py-2 text-left text-slate-600 font-semibold border border-slate-200">Tarih</th>
                                            <th className="px-2 py-2 text-left text-slate-600 font-semibold border border-slate-200">Açıklama</th>
                                            <th className="px-2 py-2 text-right text-slate-600 font-semibold border border-slate-200">Tutar</th>
                                            <th className="px-2 py-2 text-right text-slate-600 font-semibold border border-slate-200">KDV</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { date: "01.12.2024", desc: "Yazılım Lisansı", amount: "8,500", kdv: "1,530" },
                                            { date: "05.12.2024", desc: "Danışmanlık", amount: "2,200", kdv: "396" },
                                            { date: "12.12.2024", desc: "Teknik Destek", amount: "1,750", kdv: "315" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-2 py-2 text-slate-700 border border-slate-200">{row.date}</td>
                                                <td className="px-2 py-2 text-slate-700 border border-slate-200">{row.desc}</td>
                                                <td className="px-2 py-2 text-right text-slate-700 border border-slate-200">₺{row.amount}</td>
                                                <td className="px-2 py-2 text-right text-slate-700 border border-slate-200">₺{row.kdv}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-green-50 font-semibold">
                                            <td colSpan={2} className="px-2 py-2 text-slate-700 border border-slate-200">Toplam</td>
                                            <td className="px-2 py-2 text-right text-green-700 border border-slate-200">₺12,450</td>
                                            <td className="px-2 py-2 text-right text-green-700 border border-slate-200">₺2,241</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Success label */}
                        <motion.div
                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                            style={{ opacity: checkOpacity, scale: checkScale }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Dönüşüm tamamlandı!
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Progress Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <motion.div
                            className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden"
                            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.5]) }}
                        >
                            <motion.div
                                className="h-full bg-[#00BDE9] rounded-full"
                                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section - appears after scrolling */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#002032] py-16 px-6">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumHero;
