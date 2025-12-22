"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "../lib/i18n";

const HeroSection: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#002032]">
            {/* Background gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00BDE9]/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00BDE9]/6 rounded-full blur-[100px]" />
            </div>

            {/* Trust Badge */}
            <div className="absolute top-24 left-0 right-0 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00BDE9]/10 border border-[#00BDE9]/20">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BDE9] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BDE9]"></span>
                    </span>
                    <span className="text-sm font-medium text-[#00BDE9]">
                        500+ Firma BotExcel&apos;e Güveniyor
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                    {t.hero.tagline}
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                    PDF, fatura ve taranmış belgelerinizi saniyeler içinde Excel tablolarına dönüştürün.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00BDE9] text-[#002032] font-semibold text-base hover:bg-[#00d4ff] transition-colors"
                    >
                        Hemen Dene
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        href="#demo"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-slate-500 text-white font-semibold text-base hover:border-[#00BDE9] hover:text-[#00BDE9] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Demo İzle
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Keşfet</span>
                <div className="w-6 h-10 rounded-full border-2 border-slate-500 flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00BDE9] animate-bounce" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
