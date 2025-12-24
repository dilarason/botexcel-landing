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

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded text-slate-400 transition-colors hover:text-white"
                title="Dil Seçimi"
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown - no border, no background */}
            <div
                className={`absolute right-0 top-full mt-1 z-50 overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
            >
                <div className="py-1">
                    {languages.map((l) => (
                        <button
                            key={l.value}
                            type="button"
                            onClick={() => handleLanguageChange(l.value)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap transition-colors ${lang === l.value
                                ? "text-[#00D4AA]"
                                : "text-slate-300 hover:text-white"
                                }`}
                        >
                            <span className="text-base">{l.flag}</span>
                            <span className="font-medium">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageToggle;
