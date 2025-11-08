"use client";

import React, { useEffect } from "react";

import DemoUploader from "../components/DemoUploader";
import { useWhoAmI } from "../hooks/useWhoAmI";
import { useRecentJobs } from "../hooks/useRecentJobs";

export default function AppDashboardPage() {
  const who = useWhoAmI();
  const recent = useRecentJobs(10, who.status === "authenticated");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (who.status === "anonymous" || who.status === "error") {
      window.location.href = "/";
    }
  }, [who.status]);

  if (who.status === "idle" || who.status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Hesabın yükleniyor…</p>
      </main>
    );
  }

  if (who.status !== "authenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Hoş geldin, <span className="text-emerald-400">{who.email}</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Belgelerini yükle, BotExcel geri kalanını halletsin.
            </p>
          </div>
          <a
            href="/"
            className="text-xs text-slate-400 underline hover:text-slate-200"
          >
            Ana sayfaya dön
          </a>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold">Yeni belge dönüştür</h2>
            <p className="mt-1 text-xs text-slate-400 mb-4">
              Fatura, ekstre, sözleşme… Dosyanı bırak, birkaç saniye içinde Excel çıktını al.
            </p>
            <DemoUploader variant="authenticated" />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold">Son işlemler</h2>
            {recent.status === "loading" && (
              <p className="mt-2 text-xs text-slate-400">Yükleniyor…</p>
            )}
            {recent.status === "error" && (
              <p className="mt-2 text-xs text-rose-400">
                Son işlemler alınamadı. Daha sonra tekrar dene.
              </p>
            )}
            {recent.status === "loaded" && recent.items.length === 0 && (
              <p className="mt-2 text-xs text-slate-400">
                Henüz hiç dönüşüm yapılmamış. Soldan ilk dosyanı yükle.
              </p>
            )}
            {recent.status === "loaded" && recent.items.length > 0 && (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="py-2 pr-4 text-left font-medium">Belge</th>
                      <th className="py-2 pr-4 text-left font-medium">Tür</th>
                      <th className="py-2 pr-4 text-left font-medium">Tarih</th>
                      <th className="py-2 pl-4 text-right font-medium">Çıktı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.items.map((job, idx) => (
                      <tr key={job.id || idx} className="border-t border-slate-800">
                        <td className="py-2 pr-4">{job.file_name || "Bilinmeyen dosya"}</td>
                        <td className="py-2 pr-4 text-slate-400">{job.file_type || "-"}</td>
                        <td className="py-2 pr-4 text-slate-400">
                          {job.created_at
                            ? new Date(job.created_at).toLocaleString("tr-TR")
                            : "-"}
                        </td>
                        <td className="py-2 pl-4 text-right">
                          {job.download_url ? (
                            <a
                              href={job.download_url}
                              className="text-emerald-400 hover:underline"
                            >
                              Excel&apos;i indir
                            </a>
                          ) : (
                            <span className="text-slate-500">Hazırlanıyor</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
