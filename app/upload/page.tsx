"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Loader2, RefreshCcw, ShieldAlert } from "lucide-react";
import { useWhoAmI } from "@/hooks/useWhoAmI";
import { Dropzone } from "@/components/upload/Dropzone";
import { QuotaBar } from "@/components/upload/QuotaBar";
import { RecentTable } from "@/components/recent/RecentTable";
import { ResultCard } from "@/components/upload/ResultCard";
import { UploadHeader } from "@/components/UploadHeader";
import { getApiBase } from "@/lib/api";
import { mapErrorCodeToMessage } from "@/lib/errorMessages";
import { isRecord } from "@/lib/typeguards";

type FlowState =
  | "idle"
  | "uploading"
  | "converting"
  | "success"
  | "error"
  | "quota_blocked"
  | "auth_required";

type ConvertResult = {
  id?: string;
  download_url?: string;
  original_name?: string;
  format?: string;
  rows?: unknown;
  [key: string]: unknown;
};

type ConvertResponse = {
  ok?: boolean;
  code?: string;
  message?: string;
  data?: unknown;
};

export default function UploadPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [recentRefresh, setRecentRefresh] = useState(0);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = useState("Dosya seçin ve dönüştürün.");
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const who = useWhoAmI(refreshToken);
  const [file, setFile] = useState<File | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [format, setFormat] = useState("klasik");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const isBusy = flowState === "uploading" || flowState === "converting" || loading;

  useEffect(() => {
    if (file) {
      setFlowState("idle");
      setStatusMessage("Dosya hazır. Dönüştürmeye başlayabilirsiniz.");
      setError(null);
      setErrorDetail(null);
    } else {
      setFlowState((prev) => (prev === "uploading" || prev === "converting" ? "idle" : prev));
      setStatusMessage("Dosya seçin ve dönüştürün.");
    }
  }, [file]);

  useEffect(() => {
    if (["success", "error", "quota_blocked", "auth_required"].includes(flowState)) {
      statusRef.current?.focus();
    }
  }, [flowState]);

  const disableConvert = !file || isBusy || flowState === "quota_blocked" || flowState === "auth_required";

  const currentStatusIcon = useMemo(() => {
    if (flowState === "uploading" || flowState === "converting") {
      return <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />;
    }
    if (flowState === "success") {
      return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    }
    if (flowState === "error" || flowState === "quota_blocked" || flowState === "auth_required") {
      return <AlertTriangle className="h-5 w-5 text-amber-300" />;
    }
    return null;
  }, [flowState]);

  const stepText =
    flowState === "uploading"
      ? "Dosyanız işleniyor. 10-30 saniye sürebilir..."
      : flowState === "converting"
        ? "Dosyanız işleniyor. 10-30 saniye sürebilir..."
        : statusMessage;

  async function handleConvert() {
    if (!file) {
      setError("Lütfen bir dosya seçin");
      setFlowState("idle");
      setStatusMessage("Dosya seç ve dönüştür.");
      return;
    }

    if (isBusy) return;

    setLoading(true);
    setError(null);
    setErrorDetail(null);
    setResult(null);
    setStatusMessage("Dosyanız işleniyor. 10-30 saniye sürebilir...");
    setFlowState("uploading");
    abortRef.current?.abort();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const controller = new AbortController();
    abortRef.current = controller;
    timeoutRef.current = setTimeout(() => controller.abort(), 90_000);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const apiBase = getApiBase();
      setFlowState("converting");
      setStatusMessage("Dosyanız işleniyor. 10-30 saniye sürebilir...");
      const res = await fetch(`${apiBase}/api/convert`, {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: controller.signal,
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => "");
        const safeTs = new Date().toISOString();
        let parsed: unknown = null;
        try {
          parsed = rawText ? JSON.parse(rawText) : null;
        } catch {
          parsed = null;
        }

        const code = isRecord(parsed) && typeof parsed.code === "string" ? parsed.code : undefined;
        const message = isRecord(parsed) && typeof parsed.message === "string" ? parsed.message : undefined;
        setErrorDetail(
          JSON.stringify(
            {
              status: res.status,
              code: code || undefined,
              message: message || undefined,
              ts: safeTs,
            },
            null,
            2,
          ),
        );

        if (res.status === 401 || res.status === 403) {
          setError("⚠ Oturumunuz sonlandı. Giriş yapın.");
          setStatusMessage("⚠ Oturumunuz sonlandı. Giriş yapın.");
          setFlowState("auth_required");
          return;
        }

        if (res.status === 402 || res.status === 429 || code === "plan_limit") {
          setError("⚠ Aylık limitiniz doldu. Planınızı yükseltin.");
          setStatusMessage("⚠ Aylık limitiniz doldu. Planınızı yükseltin.");
          setFlowState("quota_blocked");
          setUpgradeRequested(true);
          return;
        }

        if (res.status === 413 || code === "file_too_large") {
          setError("Dosya boyutu çok büyük. Maksimum 25 MB yükleyebilirsin.");
          setStatusMessage("Dosya boyutu sınırını düşürüp tekrar dene.");
          setFlowState("error");
          return;
        }

        if (res.status === 429 || code === "rate_limited") {
          setError("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setStatusMessage("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setFlowState("error");
          return;
        }

        if (res.status >= 500) {
          setError("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setStatusMessage("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setFlowState("error");
          return;
        }

        setError(message || rawText || "⚠ Bir sorun oluştu. Tekrar deneyin.");
        setStatusMessage("⚠ Bir sorun oluştu. Tekrar deneyin.");
        setFlowState("error");
        return;
      }

      const data = (await res.json()) as unknown;

      if (isRecord(data) && data.ok === false) {
        const code = typeof data.code === "string" ? data.code : "server_error";
        const message = mapErrorCodeToMessage(code, typeof data.message === "string" ? data.message : undefined);
        if (code === "plan_limit") {
          setStatusMessage("⚠ Aylık limitiniz doldu. Planınızı yükseltin.");
          setError("⚠ Aylık limitiniz doldu. Planınızı yükseltin.");
          setFlowState("quota_blocked");
          setUpgradeRequested(true);
          return;
        }
        if (code === "rate_limited") {
          setStatusMessage("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setError("⚠ Bir sorun oluştu. Tekrar deneyin.");
          setFlowState("error");
          return;
        }
        setError(message);
        setStatusMessage(message);
        setFlowState(code === "auth_required" ? "auth_required" : "error");
        return;
      }

      const normalizedResult =
        (isRecord(data) && "data" in data ? (data as ConvertResponse).data : data) as ConvertResult;
      setResult(normalizedResult);
      setRefreshToken((n) => n + 1);
      setRecentRefresh((n) => n + 1);
      setStatusMessage("✓ Hazır. Excel dosyanızı indirebilirsiniz.");
      setFlowState("success");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("⚠ İşlem çok uzun sürdü. Tekrar deneyin.");
        setStatusMessage("⚠ İşlem çok uzun sürdü. Tekrar deneyin.");
        setFlowState("error");
        return;
      }
      setError("⚠ Bir sorun oluştu. Tekrar deneyin.");
      setStatusMessage("⚠ Bir sorun oluştu. Tekrar deneyin.");
      setErrorDetail(
        JSON.stringify(
          {
            status: "network_error",
            ts: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      setFlowState("error");
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
    }
  }

  if (who.status === "idle" || who.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="space-y-3 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (who.status === "anonymous") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  if (who.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-red-300">Kullanıcı bilgisi alınamadı</p>
      </div>
    );
  }

  const downloadUrl =
    result?.id != null
      ? `${getApiBase()}/api/download/${result.id}`
      : result?.download_url;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <UploadHeader
          refreshToken={refreshToken}
          upgradeRequested={upgradeRequested}
          onUpgradeHandled={() => setUpgradeRequested(false)}
          onPlanUpgraded={() => setRefreshToken((n) => n + 1)}
        />

        {who.email && (
          <QuotaBar
            plan={who.plan || "free"}
            usage={who.usage?.count ?? 0}
            limit={who.usage?.limit ?? null}
          />
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Dosya Yükle</h2>

              <Dropzone onFileSelect={setFile} loading={isBusy} />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Çıktı Formatı
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={isBusy}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  <option value="klasik">Klasik Tablo</option>
                  <option value="finans">Finans</option>
                  <option value="stok">Stok / Lojistik</option>
                  <option value="deneme">Deneme / Otomatik</option>
                </select>
              </div>

              <div
                ref={statusRef}
                tabIndex={-1}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-2">
                  {currentStatusIcon}
                  <div className="space-y-1">
                    <p className="text-sm text-slate-100">{stepText}</p>
                    {flowState === "converting" && (
                      <p className="text-xs text-slate-400">
                        Yüklendi → Ayrıştırılıyor → Excel hazırlanıyor
                      </p>
                    )}
                    {flowState === "success" && (
                      <p className="text-xs text-emerald-300">
                        Excel hazır. Son dönüşümler listene eklendi.
                      </p>
                    )}
                    {flowState === "quota_blocked" && (
                      <p className="text-xs text-amber-200">
                        Bu ayki ücretsiz dönüşüm limitin doldu. Planını yükseltip devam edebilirsin.
                      </p>
                    )}
                    {flowState === "auth_required" && (
                      <p className="text-xs text-amber-200">
                        Oturum gerekli. Giriş yap veya kayıt ol.
                      </p>
                    )}
                    {error && flowState === "error" && (
                      <p className="text-xs text-red-200">{error}</p>
                    )}
                    {errorDetail && (flowState === "error" || flowState === "quota_blocked") && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 underline decoration-dotted underline-offset-2 hover:text-slate-200"
                        onClick={() => {
                          navigator.clipboard.writeText(errorDetail).catch(() => undefined);
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Teknik detayı kopyala
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={disableConvert}
                    aria-disabled={disableConvert}
                    className="flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      "Excel'e Dönüştür"
                    )}
                  </button>
                  {(flowState === "error" || flowState === "quota_blocked") && (
                    <button
                      type="button"
                      onClick={handleConvert}
                      disabled={disableConvert}
                      aria-disabled={disableConvert}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Tekrar dene
                    </button>
                  )}
                  {flowState === "auth_required" && (
                    <a
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/60 px-3 py-3 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/10"
                    >
                      Giriş Yap
                    </a>
                  )}
                  {flowState === "quota_blocked" && (
                    <a
                      href="/pricing"
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/60 px-3 py-3 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/10"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Planını yükselt
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {result && (
                <ResultCard
                  fileName={result.original_name || file?.name || "Dosya"}
                  format={result.format || format}
                  rowCount={Array.isArray(result.rows) ? result.rows.length : undefined}
                  downloadUrl={downloadUrl}
                />
              )}

              <div className="glass-card space-y-4 rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Son Dönüşümlerim</h2>
                <RecentTable refreshKey={recentRefresh} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
