'use client';

import { motion } from 'framer-motion';

interface QuotaBarProps {
    plan: string;
    usage: number;
    limit: number | null;
}

export function QuotaBar({ plan, usage, limit }: QuotaBarProps) {
    const isPro = plan === 'pro' || plan === 'business';
    const percentage = limit ? Math.min((usage / limit) * 100, 100) : 0;

    const getColor = () => {
        if (isPro) return 'bg-emerald-500';
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 66) return 'bg-orange-500';
        return 'bg-emerald-500';
    };

    const getMessage = () => {
        if (isPro) {
            return `Pro Plan • Sınırsız kullanım`;
        }
        if (!limit) {
            return 'Kota bilgisi yükleniyor...';
        }
        return `Free Plan • ${usage}/${limit} belge kullanıldı`;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{getMessage()}</span>
                {!isPro && limit && (
                    <span className={`font-semibold ${percentage >= 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>

            {!isPro && limit && (
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full ${getColor()} rounded-full`}
                    />
                </div>
            )}

            {!isPro && percentage >= 100 && (
                <p className="text-xs text-red-300">
                    Kotanız doldu. Daha fazla dönüşüm için{' '}
                    <a href="/pricing" className="underline font-semibold">
                        Pro plana yükseltin
                    </a>
                </p>
            )}
        </div>
    );
}
