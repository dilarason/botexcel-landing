"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#001520] border-t border-[#00BDE9]/10">
            {/* CTA Section */}
            <div className="border-b border-[#00BDE9]/10">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Hemen başlayın.
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        3 ücretsiz dönüşüm ile BotExcel&apos;i deneyin.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00BDE9] text-[#002032] font-semibold hover:bg-[#00d4ff] transition-colors"
                    >
                        Ücretsiz Başla
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Logo */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/botexcel-logo.svg"
                                alt="BotExcel"
                                width={32}
                                height={32}
                                className="h-8 w-8"
                            />
                            <span className="text-lg font-semibold text-white">BotExcel</span>
                        </Link>
                        <p className="text-sm text-slate-400">
                            AI destekli belge dönüştürme.
                        </p>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-xs font-mono font-semibold tracking-wider text-[#00BDE9] mb-4">
                            ÜRÜNLER
                        </h3>
                        <ul className="space-y-2">
                            <li><Link href="/upload" className="text-sm text-slate-400 hover:text-white">PDF → Excel</Link></li>
                            <li><Link href="/docs/excel-addin" className="text-sm text-slate-400 hover:text-white">Excel Add-in</Link></li>
                            <li><Link href="/docs/api" className="text-sm text-slate-400 hover:text-white">API</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-mono font-semibold tracking-wider text-[#00BDE9] mb-4">
                            ŞİRKET
                        </h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-slate-400 hover:text-white">Hakkımızda</Link></li>
                            <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-white">Fiyatlandırma</Link></li>
                            <li><Link href="/blog" className="text-sm text-slate-400 hover:text-white">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-mono font-semibold tracking-wider text-[#00BDE9] mb-4">
                            YASAL
                        </h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white">Gizlilik</Link></li>
                            <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white">Kullanım Koşulları</Link></li>
                            <li><Link href="/kvkk" className="text-sm text-slate-400 hover:text-white">KVKK</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#00BDE9]/10">
                <div className="max-w-6xl mx-auto px-6 py-6 text-center">
                    <p className="text-sm text-slate-500">
                        © {currentYear} BotExcel. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
