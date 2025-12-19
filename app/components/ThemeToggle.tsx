"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../lib/i18n";

type Theme = "light" | "dark" | "system";

const ThemeToggle: React.FC = () => {
    const { t } = useI18n();
    const [theme, setTheme] = useState<Theme>("system");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const applyTheme = useCallback((newTheme: Theme) => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if (newTheme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(prefersDark ? "dark" : "light");
        } else {
            root.classList.add(newTheme);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const stored = localStorage.getItem("theme") as Theme | null;
            if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
                setTheme(stored);
            }
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        setIsOpen(false);
    };

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    useEffect(() => {
        if (theme !== "system") return;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => applyTheme("system");

        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [theme, applyTheme]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const themes: { value: Theme; labelKey: keyof typeof t.theme; icon: React.ReactNode }[] = [
        {
            value: "light",
            labelKey: "light",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            value: "dark",
            labelKey: "dark",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
        },
        {
            value: "system",
            labelKey: "system",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const currentTheme = themes.find((th) => th.value === theme);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-200"
                title="Theme"
            >
                {currentTheme?.icon}
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 z-50 overflow-hidden">
                    <div className="py-1">
                        {themes.map((th) => (
                            <button
                                key={th.value}
                                type="button"
                                onClick={() => handleThemeChange(th.value)}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${theme === th.value
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : "text-slate-300 hover:bg-slate-800/70"
                                    }`}
                            >
                                {th.icon}
                                <span>{t.theme[th.labelKey]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeToggle;
