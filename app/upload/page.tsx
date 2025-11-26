"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { UploadHeader } from "../components/UploadHeader";
import { mapErrorCodeToMessage } from "../lib/errorMessages";
import { useWhoAmI } from "../hooks/useWhoAmI";

type ConvertResult = {
  id?: string;
  original_name?: string;
  format?: string;
  download_url?: string;
  rows?: unknown;
  ok?: boolean;
  error?: string;
  error_code?: string;
} & Record<string, unknown>;

type RecentItem = {
  time?: string;
  step?: string;
  action?: string;
  file_name?: string;
  format?: string;
  rows?: number;
  source_file?: string;
} & Record<string, unknown>;

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://www.botexcel.pro";

export default function UploadPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const who = useWhoAmI(refreshToken);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("klasik");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);
  type ConvertResponse = {
    data?: ConvertResult;
    ok?: boolean;
    code?: string;
    message?: string;
    details?: { limit?: number | null; usage?: number | null; [key: string]: unknown };
  } & ConvertResult;

  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  // 1) Auth guard: /whoami kontrolü
  useEffect(() => {
    if (who.status === "anonymous" && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [who.status]);

  // 2) Auth onaylandıysa /recent.json çek
  useEffect(() => {
    if (who.status !== "authenticated") return;

    let cancelled = false;

    async function loadRecent() {
      try {
        setRecentLoading(true);
        setRecentError(null);

        const res = await fetch(`${BACKEND_BASE}/recent.json`, {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));
        const items: RecentItem[] = Array.isArray(data.items)
          ? data.items
          : [];

        if (!cancelled) {
          setRecentItems(items);
        }
      } catch {
        if (!cancelled) {
          setRecentError("Son işlemler alınamadı.");
        }
      } finally {
        if (!cancelled) setRecentLoading(false);
      }
    }

    void loadRecent();

    return () => {
      cancelled = true;
    };
  }, [who.status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Lütfen yüklemek için bir dosya seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      setLoading(true);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        let errorText = "";
        try {
          errorText = await res.text();
        } catch {
          // ignore
        }

        setError(
          errorText || "Dönüşüm sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
        return;
      }

      const raw = (await res.json().catch(() => ({}))) as ConvertResponse | ConvertResult;
      const payload = raw as ConvertResponse;

      if (payload.ok === false) {
        const code = payload.code || "server_error";
        const message = mapErrorCodeToMessage(code, payload.message);

        if (code === "plan_limit") {
          const limit = payload?.details?.limit;
          const usage = payload?.details?.usage;
          const suffix =
            typeof usage === "number" && typeof limit === "number"
              ? ` (${usage}/${limit} belge)`
              : "";
          setError(`${message}${suffix}`);
          setUpgradeRequested(true);
          return;
        }

        setError(message);
        return;
      }

      const normalizedResult = payload.data ?? (raw as ConvertResult);
      setResult(normalizedResult);
      setRefreshToken((n) => n + 1);
    } catch {
      setError("Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  // Auth kontrolü devam ederken skeleton
  if (who.status === "idle" || who.status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="space-y-2 text-center">
          <p className="text-sm text-slate-400">
            Hesap durumun kontrol ediliyor...
          </p>
          <div className="h-1.5 w-40 rounded-full bg-slate-800 overflow-hidden mx-auto">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    );
  }

  // guest ise login'e yönlendirildi; fallback:
  if (who.status === "anonymous") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">
          Yönlendiriliyorsun... Eğer yönlenmiyorsa{" "}
          <a href="/login" className="text-emerald-300 underline">
            buradan giriş yapabilirsin
          </a>
          .
        </p>
      </div>
    );
  }

  if (who.status === "error") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-red-300">Kullanıcı bilgisi alınamadı. Lütfen tekrar deneyin.</p>
      </div>
    );
  }

  // İndirme linki
  const downloadHref =
    (result?.id && `/api/download/${encodeURIComponent(result.id)}`) ||
    result?.download_url ||
    undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-8">
        <UploadHeader
          refreshToken={refreshToken}
          upgradeRequested={upgradeRequested}
          onUpgradeHandled={() => setUpgradeRequested(false)}
          onPlanUpgraded={() => setRefreshToken((n) => n + 1)}
        />

        <main className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Form kartı */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-100">
                  Dosya
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.docx"
                  className="block w-full text-sm text-slate-200 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                  }}
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">
                  Desteklenen formatlar: PDF, görüntü, CSV, Excel, Word.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-100">
                  Çıktı modu
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                >
                  <option value="klasik">Klasik tablo</option>
                  <option value="finans">Finans</option>
                  <option value="stok">Stok / lojistik</option>
                  <option value="deneme">Deneme / otomatik</option>
                </select>
                <p className="text-xs text-slate-500">
                  Format seçimi, AI&apos;ın hangi alanları önceliklendireceğini
                  belirler.
                </p>
              </div>
            </div>

            {error && (
              <div className="text-sm rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold px-4 py-2.5 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Dönüştürülüyor..." : "Dönüştür ve Excel’i hazırla"}
            </button>

            <p className="text-[11px] text-slate-500">
              Dönüşüm süresi dosya boyutuna bağlıdır. Büyük PDF&apos;ler birkaç
              saniye sürebilir.
            </p>
          </form>

          {/* Sonuç & Son işlemler paneli */}
          <section className="space-y-4">
            {/* Sonuç */}
            <div className="space-y-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Bu dönüşümün sonucu
              </h2>

              {!result && !loading && (
                <p className="text-sm text-slate-500">
                  Henüz bu oturumda dosya yüklemedin. Yüklediğinde burada özet
                  ve Excel indirme bağlantısı görünecek.
                </p>
              )}

              {loading && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">
                    Dönüşüm devam ediyor, BotExcel sayfaları okuyor...
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-3 text-sm">
                  <p className="text-slate-300">
                    <span className="font-medium">Dosya adı:</span>{" "}
                    {result.original_name || file?.name || "Bilinmiyor"}
                  </p>
                  <p className="text-slate-400">
                    <span className="font-medium text-slate-300">
                      Çıktı formatı:
                    </span>{" "}
                    {result.format || format || "klasik"}
                  </p>

                  {Array.isArray(result.rows) && (
                    <p className="text-slate-400">
                      <span className="font-medium text-slate-300">
                        Satır sayısı:
                      </span>{" "}
                      {result.rows.length}
                    </p>
                  )}

                  {downloadHref ? (
                    <a
                      href={downloadHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold px-3 py-2 hover:bg-emerald-400 transition"
                    >
                      Excel çıktısını indir
                    </a>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Backend çıktısında <code>id</code> veya{" "}
                      <code>download_url</code> alanı bulunamadı.
                    </p>
                  )}

                  <details className="mt-2 text-xs text-slate-500">
                    <summary className="cursor-pointer select-none">
                      Detaylı JSON yanıtını göster
                    </summary>
                    <pre className="mt-1 max-h-64 overflow-auto rounded-md bg-slate-950/70 border border-slate-800 px-2 py-2 whitespace-pre-wrap break-all">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>

            {/* Son işlemlerim */}
            <div className="space-y-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Son dönüşümlerim
              </h2>

              {recentLoading && (
                <p className="text-xs text-slate-500">
                  Son işlemler yükleniyor...
                </p>
              )}

              {recentError && (
                <p className="text-xs text-red-300">{recentError}</p>
              )}

              {!recentLoading && !recentError && recentItems.length === 0 && (
                <p className="text-xs text-slate-500">
                  Henüz kayıtlı bir dönüşüm görünmüyor. Bu oturumda yaptığın
                  dönüşümler burada listelenecek.
                </p>
              )}

              {recentItems.length > 0 && (
                <div className="max-h-60 overflow-auto rounded-md border border-slate-800/80">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead className="bg-slate-900/80">
                      <tr>
                        <th className="px-2 py-1 border-b border-slate-800 text-slate-300">
                          Zaman
                        </th>
                        <th className="px-2 py-1 border-b border-slate-800 text-slate-300">
                          Adım
                        </th>
                        <th className="px-2 py-1 border-b border-slate-800 text-slate-300">
                          Dosya
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentItems
                        .slice()
                        .reverse()
                        .map((item, idx) => (
                          <tr
                            key={idx}
                            className="odd:bg-slate-900/40 even:bg-slate-900/20"
                          >
                            <td className="px-2 py-1 border-b border-slate-800 text-slate-400">
                              {item.time
                                ? new Date(item.time).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-2 py-1 border-b border-slate-800 text-slate-400">
                              {item.step || item.action || "-"}
                            </td>
                            <td className="px-2 py-1 border-b border-slate-800 text-slate-400">
                              {item.file_name ||
                                item.source_file ||
                                "Bilinmiyor"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
