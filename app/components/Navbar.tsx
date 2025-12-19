"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useI18n } from "../lib/i18n";

interface DropdownItem {
    label: string;
    href: string;
    description?: string;
}

const DropdownMenu: React.FC<{
    items: DropdownItem[];
    isOpen: boolean;
}> = ({ items, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 z-50 overflow-hidden">
            <div className="py-2">
                {items.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-3 hover:bg-slate-800/70 transition-colors"
                    >
                        <span className="block text-sm font-medium text-slate-100">
                            {item.label}
                        </span>
                        {item.description && (
                            <span className="block text-xs text-slate-400 mt-0.5">
                                {item.description}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

const Navbar: React.FC = () => {
    const { t } = useI18n();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Build nav items using translations
    const solutionsDropdown: DropdownItem[] = [
        {
            label: t.solutionsDropdown.finance,
            href: "/#cozumler",
            description: t.solutionsDropdown.financeDesc,
        },
        {
            label: t.solutionsDropdown.operations,
            href: "/#cozumler",
            description: t.solutionsDropdown.operationsDesc,
        },
        {
            label: t.solutionsDropdown.sme,
            href: "/#cozumler",
            description: t.solutionsDropdown.smeDesc,
        },
        {
            label: t.solutionsDropdown.enterpriseSolutions,
            href: "/kurumsal-teklif",
            description: t.solutionsDropdown.enterpriseDesc,
        },
    ];

    const resourcesDropdown: DropdownItem[] = [
        {
            label: t.resourcesDropdown.apiDocs,
            href: "/docs/api",
            description: t.resourcesDropdown.apiDocsDesc,
        },
        {
            label: t.resourcesDropdown.security,
            href: "/docs/security",
            description: t.resourcesDropdown.securityDesc,
        },
        {
            label: t.resourcesDropdown.barcodeGuide,
            href: "/guides/barcode-stock-tracking",
            description: t.resourcesDropdown.barcodeGuideDesc,
        },
    ];

    const navItems = [
        { label: t.nav.solutions, dropdown: solutionsDropdown },
        { label: t.nav.pricing, href: "/pricing" },
        { label: t.nav.resources, dropdown: resourcesDropdown },
        { label: t.nav.enterprise, href: "/kurumsal-teklif" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseEnter = (label: string) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setOpenDropdown(label);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setOpenDropdown(null);
        }, 150);
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/60 bg-emerald-500/10 shadow-sm">
                            <Image
                                src="/botexcel-logo.svg"
                                alt="BotExcel"
                                width={32}
                                height={32}
                                priority
                                className="h-8 w-8 object-cover"
                            />
                        </span>
                        <span className="text-base font-semibold tracking-tight text-slate-100">
                            BotExcel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() =>
                                    item.dropdown && handleMouseEnter(item.label)
                                }
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.dropdown ? (
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-slate-100"
                                    >
                                        {item.label}
                                        <svg
                                            className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-slate-100"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                                {item.dropdown && (
                                    <DropdownMenu
                                        items={item.dropdown}
                                        isOpen={openDropdown === item.label}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Theme & Language Toggles + CTA Buttons */}
                    <div className="hidden md:flex md:items-center md:gap-2">
                        <ThemeToggle />
                        <LanguageToggle />
                        <div className="w-px h-6 bg-slate-700/50 mx-1" />
                        <Link
                            href="/login"
                            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:border-slate-600"
                        >
                            {t.nav.login}
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
                        >
                            {t.nav.tryFree}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800/50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Menüyü aç</span>
                        {mobileMenuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800/50 py-4">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <div key={item.label}>
                                    {item.dropdown ? (
                                        <div className="space-y-1">
                                            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                {item.label}
                                            </div>
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.href}
                                                    className="block px-6 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href!}
                                            className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between px-3 pt-4 border-t border-slate-800/50">
                            <span className="text-xs text-slate-500">{t.nav.themeLabel}</span>
                            <div className="flex items-center gap-1">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 px-3">
                            <Link
                                href="/login"
                                className="w-full rounded-full border border-slate-700 px-4 py-2.5 text-center text-sm font-medium text-slate-200 hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.nav.login}
                            </Link>
                            <Link
                                href="/register"
                                className="w-full rounded-full bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-emerald-950 hover:bg-emerald-400"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.nav.tryFree}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
