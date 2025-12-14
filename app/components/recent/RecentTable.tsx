'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiBase } from "@/lib/api";

interface RecentItem {
    time?: string;
    step?: string;
    action?: string;
    file_name?: string;
    format?: string;
    rows?: number;
    source_file?: string;
    id?: string;
}

type RecentTableProps = {
    refreshKey?: number;
};

export function RecentTable({ refreshKey = 0 }: RecentTableProps) {
    const [items, setItems] = useState<RecentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchRecent() {
            try {
                setLoading(true);
                setError(null);

                const apiBase = getApiBase();
                const res = await fetch(`${apiBase}/api/recent.json?limit=20&user=me`, {
                    credentials: 'include',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });

                if (cancelled) return;

                if (!res.ok) {
                    throw new Error('Failed to fetch recent conversions');
                }

                const data = await res.json();
                const recentItems = Array.isArray(data.items) ? data.items : [];
                setItems(recentItems);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Bir hata oluştu');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchRecent();

        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12" aria-live="polite">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-sm text-red-300" role="status" aria-live="polite">
                {error}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-slate-500" role="status" aria-live="polite">
                Henüz dönüşüm kaydı bulunmuyor
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800" aria-live="polite">
            <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                    <tr>
                        <th className="px-4 py-3 text-left text-slate-300 font-medium">Tarih</th>
                        <th className="px-4 py-3 text-left text-slate-300 font-medium">Dosya</th>
                        <th className="px-4 py-3 text-left text-slate-300 font-medium">Durum</th>
                        <th className="px-4 py-3 text-left text-slate-300 font-medium">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <motion.tr
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-t border-slate-800 hover:bg-slate-900/40 transition-colors"
                        >
                            <td className="px-4 py-3 text-slate-400">
                                {item.time ? new Date(item.time).toLocaleDateString('tr-TR', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-200 font-medium">
                                {item.file_name || item.source_file || 'Bilinmiyor'}
                            </td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                    {item.step || item.action || 'Tamamlandı'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                {item.id && (
                                    <a
                                        href={`${getApiBase()}/api/download/${item.id}`}
                                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        İndir
                                    </a>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
