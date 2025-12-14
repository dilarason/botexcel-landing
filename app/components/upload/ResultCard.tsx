'use client';

import { CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultCardProps {
    fileName: string;
    format: string;
    rowCount?: number;
    downloadUrl?: string;
}

export function ResultCard({ fileName, format, rowCount, downloadUrl }: ResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 space-y-4"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-100 mb-1">Dönüşüm Tamamlandı</h3>
                    <p className="text-sm text-slate-400">Excel dosyanız hazır</p>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Dosya adı:</span>
                    <span className="text-slate-200 font-medium">{fileName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Format:</span>
                    <span className="text-slate-200 capitalize">{format}</span>
                </div>
                {rowCount !== undefined && (
                    <div className="flex justify-between">
                        <span className="text-slate-500">Satır sayısı:</span>
                        <span className="text-slate-200">{rowCount}</span>
                    </div>
                )}
            </div>

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Excel İndir
                </a>
            )}
        </motion.div>
    );
}
