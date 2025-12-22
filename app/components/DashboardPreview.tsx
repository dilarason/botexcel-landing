"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DashboardPreview: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 px-4 bg-[#002032] overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00BDE9]/10 rounded-full blur-[150px] animate-float"
                    style={{ animationDuration: '12s' }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div
                        className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                            }`}
                    >
                        <p
                            className="text-xs font-mono uppercase tracking-[0.3em] text-[#00BDE9] mb-4"
                            style={{ transitionDelay: '100ms' }}
                        >
                            ÜRÜN DENEYİMİ
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Kontrolü elinizde tutun — tüm dönüşümlerinizi tek panelden yönetin.
                        </h2>
                        <p className="text-lg text-slate-300 mb-8">
                            Yıllık administrasyon süreçlerini takip edin, görevleri otomatikleştirin ve müşterilerinize sorunsuz bir deneyim sunun — hepsi tek bir güçlü panodan.
                        </p>

                        {/* Feature list */}
                        <ul className="space-y-4 mb-8">
                            {[
                                "Gerçek zamanlı dönüşüm durumu takibi",
                                "Toplu işlem ve otomasyon desteği",
                                "Detaylı kullanım raporları ve analizler"
                            ].map((feature, index) => (
                                <li
                                    key={feature}
                                    className={`flex items-start gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                        }`}
                                    style={{ transitionDelay: `${300 + index * 150}ms` }}
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00BDE9]/20 flex items-center justify-center mt-0.5 transition-transform hover:scale-110">
                                        <svg className="w-3.5 h-3.5 text-[#00BDE9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#00BDE9] text-[#002032] font-semibold text-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#00BDE9]/30 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                            style={{ transitionDelay: '700ms' }}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">Ücretsiz Dene</span>
                            <svg className="w-4 h-4 relative transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Right: Dashboard mockup */}
                    <div
                        className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                            }`}
                        style={{ transitionDelay: '300ms' }}
                    >
                        {/* Dashboard UI mockup */}
                        <div className="relative rounded-2xl border border-[#00BDE9]/20 bg-[#001520] p-6 shadow-2xl shadow-black/30 transition-transform duration-500 hover:scale-[1.02]">
                            {/* Header bar */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#00BDE9]/20 flex items-center justify-center animate-pulse">
                                        <svg className="w-4 h-4 text-[#00BDE9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-white">Son Dönüşümler</span>
                                </div>
                                <span className="text-xs font-mono text-[#00BDE9]">12 BELGE</span>
                            </div>

                            {/* Conversion items */}
                            <div className="space-y-3">
                                {[
                                    { name: "fatura_2024_01.pdf", status: "Tamamlandı", time: "2 dk önce", progress: 100 },
                                    { name: "banka_ekstresi.csv", status: "Tamamlandı", time: "5 dk önce", progress: 100 },
                                    { name: "dekont_ocak.pdf", status: "İşleniyor...", time: "Şimdi", progress: 65 },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-3 rounded-xl bg-[#002032]/80 border border-[#00BDE9]/10 transition-all duration-500 hover:border-[#00BDE9]/30 hover:bg-[#002032] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                            }`}
                                        style={{ transitionDelay: `${500 + index * 150}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#00BDE9]/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-[#00BDE9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{item.name}</div>
                                                <div className="text-xs text-slate-400">{item.time}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-medium ${item.progress === 100 ? 'text-green-400' : 'text-[#00BDE9]'}`}>
                                                {item.status}
                                            </div>
                                            {item.progress < 100 && (
                                                <div className="w-20 h-1.5 bg-[#00BDE9]/20 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#00BDE9] rounded-full animate-pulse"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {[
                                    { label: "Bu Ay", value: "234", unit: "dönüşüm" },
                                    { label: "Başarı Oranı", value: "99.2", unit: "%" },
                                    { label: "Ort. Süre", value: "4.2", unit: "saniye" },
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`text-center p-3 rounded-xl bg-[#00BDE9]/5 border border-[#00BDE9]/10 transition-all duration-500 hover:bg-[#00BDE9]/10 hover:border-[#00BDE9]/20 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                            }`}
                                        style={{ transitionDelay: `${800 + index * 100}ms` }}
                                    >
                                        <div className="text-xl font-bold text-[#00BDE9]">
                                            {stat.value}
                                            <span className="text-xs ml-0.5">{stat.unit}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00BDE9]/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#00BDE9]/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
