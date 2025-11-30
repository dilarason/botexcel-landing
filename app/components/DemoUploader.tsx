"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiBase } from "../lib/api";
import { getPersistedSource } from "../lib/source";

type DemoState = "idle" | "uploading" | "success" | "error" | "limit" | "plan_limit";

type DemoUploaderProps = {
  variant?: "anonymous" | "authenticated";
};

type PlausibleFn = (eventName: string, options?: { props?: Record<string, unknown> }) => void;
const track = (eventName: string, props?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { plausible?: PlausibleFn };
  const plausible = w?.plausible;
  if (typeof plausible !== "function") return;
  const source = getPersistedSource();
  const finalProps = {
    ...(props || {}),
    ...(source || {}),
  };
  const payload = Object.keys(finalProps).length ? { props: finalProps } : undefined;
  plausible(eventName, payload);
};

function buildSimpleFingerprint(): string {
  const nav = typeof window !== "undefined" ? window.navigator : undefined;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const ua = nav?.userAgent || "";
  const lang = nav?.language || "";
  const langs = (nav?.languages || []).join(",");
  const screenInfo = typeof window !== "undefined"
    ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
    : "";

  // Canvas tabanlı ufak bir hash ile fingerprint'i biraz daha güçlendiriyorum.
  let canvasHash = "";
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillText("botexcel_demo_fingerprint", 2, 2);
      canvasHash = canvas.toDataURL();
    }
  } catch {
    canvasHash = "";
  }

  return [ua, lang, langs, tz, screenInfo, canvasHash].join("||");
}

export default function DemoUploader({ variant = "anonymous" }: DemoUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [state, setState] = useState<DemoState>("idle");
  const [planInfo, setPlanInfo] = useState<{ plan: string; limit: number } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<{ real: boolean; originalName: string; outputName: string }>({
    real: false,
    originalName: "",
    outputName: "",
  });

  // Burada demo hakkını anonim kullanıcı bazında sadece 1 kez verecek akışı yönetiyorum.
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    track("demo_started", { source: "landing" });
    setState("uploading");
    setErrorMessage(null);
    setDownloadUrl(null);
    setPlanInfo(null);
    setResultInfo({ real: false, originalName: "", outputName: "" });

    const fingerprint = buildSimpleFingerprint();

    const form = new FormData();
    form.append("file", file);
    form.append("fingerprint", fingerprint);

    // İleride captcha entegrasyonu yaptığımda buraya token'ı ekleyeceğim.
    // form.append("captcha_token", captchaToken);

    try {
      const res = await fetch(`${getApiBase()}/api/demo-convert`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.error === "demo_limit_reached") {
          setState("limit");
          setErrorMessage(
            data?.message ||
              "Demo hakkını zaten kullandın. Devam etmek için ücretsiz hesap açman gerekiyor."
          );
          track("demo_limit_reached", { source: "landing" });
          return;
        }
        if (data?.error === "plan_limit") {
          setPlanInfo({
            plan: data?.plan || "plan",
            limit: Number(data?.limit) || 0,
          });
          setState("plan_limit");
          track("plan_limit_reached", { plan: data?.plan || "unknown" });
          return;
        }
        if (data?.error === "ip_rate_limited") {
          setState("error");
          setErrorMessage(
            data?.message ||
              "Bu IP adresinden şu anda çok fazla demo denemesi var. Bir süre beklemen gerekiyor."
          );
          return;
        }
        setState("error");
        setErrorMessage(
          data?.message || "Demo çalışırken beklenmeyen bir hata oluştu."
        );
        track("demo_failed", { status: res.status });
        return;
      }

      if (!data?.download_url) {
        setState("error");
        setErrorMessage("Sunucudan indirme bağlantısı alamadım.");
        return;
      }

      setDownloadUrl(data.download_url);
      setResultInfo({
        real: Boolean(data.real_conversion),
        originalName: data.original_name || file.name,
        outputName: data.output_name || "botexcel_demo.xlsx",
      });
      setState("success");
      track("demo_succeeded", { source: "landing", mode: data.real_conversion ? "real" : "stub" });

      // Çıktıyı otomatik indirmeyi tercih ediyorum; kullanıcı ayrıca linke tıklayarak da indirebilir.
      const a = document.createElement("a");
      a.href = data.download_url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setState("error");
      setErrorMessage("Sunucuya ulaşırken bir ağ hatası oluştu.");
      track("demo_failed", { status: "network_error" });
    }
  }

  function handleClickSelect() {
    if (variant === "anonymous") {
      router.push("/upload");
      return;
    }
    fileRef.current?.click();
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
      {state === "idle" && (
        <>
          <p className="text-sm text-gray-700">
            {variant === "authenticated"
              ? "Dosyanı yüklediğinde dönüşüm geçmişine ekleyip Excel çıktını hazırlıyorum."
              : "Anonim ziyaretçi için tek seferlik, tam özellikli bir demo sunuyorum."}
          </p>
          <button
            type="button"
            onClick={handleClickSelect}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Dosya seç ve dene
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.csv,.txt,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          {variant === "anonymous" && (
            <p className="text-xs text-gray-500">
              Not: Demo hakkı tarayıcıya özel sadece 1 kez tanımlanıyor. Sonraki adımda hesap açmaya yönlendirmek istiyorum.
            </p>
          )}
        </>
      )}

      {state === "uploading" && (
        <p className="text-sm text-gray-700">
          Dosyayı yüklüyorum ve demo motorunda işliyorum. Bu aşamada hem kullanım hakkını kilitliyorum
          hem de çıkacak Excel için tek kullanımlık bir indirme linki hazırlıyorum.
        </p>
      )}

      {state === "success" && downloadUrl && (
        <div className="mt-4 space-y-3">
          <a
            href={downloadUrl}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Excel çıktısını indir
          </a>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-slate-400">Belge:</span>
              <span>{resultInfo.originalName || "Dosya"}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-slate-400">Excel:</span>
              <span>{resultInfo.outputName || "botexcel_demo.xlsx"}</span>
            </div>
            <p className="pt-1">
              {resultInfo.real ? (
                <span className="text-emerald-600">
                  Bu çıktı gerçek belgen üzerinden üretildi. Hesabına giriş yaparak sınırsız dönüştürmeye devam edebilirsin.
                </span>
              ) : (
                <>
                  Bu canlı demo gerçek dönüştürme yerine örnek tablo gösterir.
                  Gerçek hesapla bağlandığında dosyan canlı olarak işlenecek.
                </>
              )}
            </p>
            <p>
              Çıktıyı beğendiysen, bunu her gün kullanmak için hesabını oluştur:
              <a
                href="/register"
                className="ml-1 font-semibold text-emerald-700 underline"
                onClick={() => track("signup_clicked", { source: resultInfo.real ? "demo_success_real" : "demo_success" })}
              >
                Ücretsiz hesap aç
              </a>
            </p>
          </div>
        </div>
      )}

      {state === "limit" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-800">
            Demo hakkın doldu.
          </p>
          <p className="text-xs text-amber-800">
            BotExcel&apos;i sınırsız kullanmak için ücretsiz hesap açman gerekiyor.
            Demo sadece tadımlık; faturaların, ekstrelerin ve sözleşmelerin için
            kalıcı alan açalım.
          </p>
          <a
            href="/register"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={() => track("signup_clicked", { source: "demo_limit" })}
          >
            Ücretsiz hesap aç
          </a>
        </div>
      )}

      {state === "plan_limit" && planInfo && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-900">
            {planInfo.plan === "free" ? "Ücretsiz plan limitine ulaştın." : "Plan limitine ulaştın."}
          </p>
          <p className="text-xs text-amber-900">
            Bu ay {planInfo.limit} belge sınırını doldurdun. Daha fazla dosya dönüştürmek için planını yükseltebilirsin.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="/billing"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              onClick={() => track("upgrade_clicked", { source: "plan_limit" })}
            >
              Planı yükselt
            </a>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="text-xs text-amber-900 underline"
            >
              Daha sonra
            </button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-700">
            Demo sırasında bir sorun oluştu.
          </p>
          {errorMessage && (
            <p className="text-xs text-red-700">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setErrorMessage(null);
              setDownloadUrl(null);
            }}
            className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Tekrar dene
          </button>
        </div>
      )}
    </div>
  );
}
