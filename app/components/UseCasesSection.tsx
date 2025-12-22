"use client";

import React from "react";
import Link from "next/link";

interface UseCase {
    id: string;
    number: string;
    title: string;
    description: string;
}

const useCases: UseCase[] = [
    {
        id: "invoice",
        number: ".01",
        title: "Fatura & Dekont",
        description: "PDF faturalarınızı otomatik olarak Excel'e dönüştürün.",
    },
    {
        id: "bank",
        number: ".02",
        title: "Banka Ekstresi",
        description: "Finansal hareketleri otomatik kategorize edin.",
    },
    {
        id: "ocr",
        number: ".03",
        title: "OCR Tanıma",
        description: "Taranmış belgelerden metin çıkarın.",
    },
    {
        id: "batch",
        number: ".04",
        title: "Toplu Dönüştürme",
        description: "Onlarca belgeyi tek seferde işleyin.",
    },
    {
        id: "excel-addin",
        number: ".05",
        title: "Excel Add-in",
        description: "Doğrudan Excel içinden dönüştürün.",
    },
];

const UseCasesSection: React.FC = () => {
    return (
        <section className="py-24 px-4 bg-[#002032]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#00BDE9] mb-4">
                        KULLANIM ALANLARI
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Her ihtiyaca çözüm.
                    </h2>
                </div>

                {/* Use Cases Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((useCase) => (
                        <Link
                            key={useCase.id}
                            href="/#demo"
                            className="group rounded-2xl border border-[#00BDE9]/20 bg-[#001520] p-6 hover:border-[#00BDE9]/40 hover:bg-[#002535] transition-all"
                        >
                            <span className="text-xs font-mono text-[#00BDE9] uppercase tracking-widest">
                                ÖRNEK {useCase.number}
                            </span>
                            <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-[#00BDE9] transition-colors">
                                {useCase.title}
                            </h3>
                            <p className="text-sm text-slate-400">
                                {useCase.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
