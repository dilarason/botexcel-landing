'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CounterProps {
    end: number;
    label: string;
    duration?: number;
    suffix?: string;
}

function Counter({ end, label, duration = 2, suffix = '' }: CounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2 p-6 glass-card rounded-xl"
        >
            <div className="text-4xl md:text-5xl font-bold text-emerald-400">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-sm text-slate-400 text-center">{label}</div>
        </motion.div>
    );
}

export function TrustCounters() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Güvenilir ve KVKK Uyumlu
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        BotExcel, verilerinizi korur ve Türkiye KVKK standartlarına tam uyum sağlar
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Counter end={15000} label="İşlenmiş Belge" suffix="+" />
                    <Counter end={500} label="Aktif Kullanıcı" suffix="+" />
                    <Counter end={99} label="Başarı Oranı" suffix="%" />
                    <Counter end={100} label="KVKK Uyum" suffix="%" />
                </div>
            </div>
        </section>
    );
}
