'use client';

import { Download, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface QuickActionsProps {
    messageId: string;
    content: string;
    onRetry?: () => void;
    downloadUrl?: string;
}

export function QuickActions({ messageId, content, onRetry, downloadUrl }: QuickActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3" />
                        Kopyalandı
                    </>
                ) : (
                    <>
                        <Copy className="w-3 h-3" />
                        Kopyala
                    </>
                )}
            </button>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Tekrar Dene
                </button>
            )}

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors"
                >
                    <Download className="w-3 h-3" />
                    İndir
                </a>
            )}
        </div>
    );
}
