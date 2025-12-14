'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroCTA() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-24 px-4"
        >
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Karmaşıklıktan Netliğe{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                        3 Saniyede
                    </span>
                </h2>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                    PDF, fatura, dekont veya her türlü belgeyi yapay zeka ile temiz Excel tablolarına dönüştür.
                    İlk 3 dönüşümün bedava.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                    >
                        Ücretsiz Başla
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-700 text-slate-200 font-semibold text-lg hover:border-emerald-500 hover:text-emerald-400 transition-all"
                    >
                        Fiyatlandırma
                    </Link>
                </div>

                <p className="text-sm text-slate-500">
                    Kredi kartı gerekmez • KVKK uyumlu • 30 saniyede kayıt ol
                </p>
            </div>
        </motion.section>
    );
}
