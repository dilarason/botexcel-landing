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
                className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-200"
                title="Language"
            >
                <span className="text-base">{currentLang?.flag}</span>
                <span className="hidden sm:inline text-xs font-medium uppercase">{lang}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 z-50 overflow-hidden">
                    <div className="py-1">
                        {languages.map((l) => (
                            <button
                                key={l.value}
                                type="button"
                                onClick={() => handleLanguageChange(l.value)}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${lang === l.value
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : "text-slate-300 hover:bg-slate-800/70"
                                    }`}
                            >
                                <span className="text-base">{l.flag}</span>
                                <span>{l.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageToggle;
