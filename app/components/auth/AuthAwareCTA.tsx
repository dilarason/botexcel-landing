'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Upload } from 'lucide-react';
import { getApiBase } from "@/lib/api";

type WhoAmIStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous' | 'error';

interface WhoAmIData {
    status: WhoAmIStatus;
    email?: string;
    plan?: string;
}

export function AuthAwareCTA() {
    const [whoami, setWhoami] = useState<WhoAmIData>({ status: 'idle' });

    useEffect(() => {
        let cancelled = false;

        async function checkAuth() {
            try {
                setWhoami({ status: 'loading' });
                const apiBase = getApiBase();
                const res = await fetch(`${apiBase}/api/whoami`, {
                    credentials: 'include'
                });

                if (cancelled) return;

                if (res.ok) {
                    const data = await res.json();
                    if (data.email) {
                        setWhoami({
                            status: 'authenticated',
                            email: data.email,
                            plan: data.plan
                        });
                    } else {
                        setWhoami({ status: 'anonymous' });
                    }
                } else {
                    setWhoami({ status: 'anonymous' });
                }
            } catch {
                if (!cancelled) setWhoami({ status: 'anonymous' });
            }
        }

        checkAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    if (whoami.status === 'loading' || whoami.status === 'idle') {
        return (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
                <span>Yükleniyor...</span>
            </div>
        );
    }

    if (whoami.status === 'authenticated') {
        return (
            <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
                <Upload className="w-5 h-5" />
                Dosya Yükle
            </Link>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
                Kayıt Ol
                <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-700 text-slate-200 font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all"
            >
                Giriş Yap
            </Link>
        </div>
    );
}
