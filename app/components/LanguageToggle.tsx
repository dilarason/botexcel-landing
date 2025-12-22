"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n, Language } from "../lib/i18n";

const LanguageToggle: React.FC = () => {
    const { lang, setLang } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (newLang: Language) => {
        setLang(newLang);
        setIsOpen(false);
    };

    const languages: { value: Language; label: string; flag: string }[] = [
        { value: "tr", label: "Türkçe", flag: "🇹🇷" },
        { value: "en", label: "English", flag: "🇬🇧" },
    ];

    const currentLang = languages.find((l) => l.value === lang);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
                title="Dil Seçimi"
            >
                <span className="text-lg">{currentLang?.flag}</span>
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown with slide animation */}
            <div
                className={`absolute right-0 top-full mt-1 w-40 rounded-xl border border-[#00BDE9]/20 bg-[#001520] backdrop-blur-xl shadow-2xl shadow-black/30 z-50 overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
            >
                <div className="py-1">
                    {languages.map((l) => (
                        <button
                            key={l.value}
                            type="button"
                            onClick={() => handleLanguageChange(l.value)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${lang === l.value
                                ? "bg-[#00BDE9]/10 text-[#00BDE9]"
                                : "text-slate-300 hover:bg-[#002535] hover:text-white"
                                }`}
                        >
                            <span className="text-lg">{l.flag}</span>
                            <span className="font-medium">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageToggle;
