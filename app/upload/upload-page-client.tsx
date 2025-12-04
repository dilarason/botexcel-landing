"use client";

import Link from "next/link";
import { useMemo } from "react";
import { UploadCtaSection } from "../components/sections/UploadCtaSection";
import { UploadDemoSection } from "../components/sections/UploadDemoSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { useAuth } from "../components/providers/AuthProvider";
import { usePlan } from "../hooks/usePlan";
import { useRecentJobs } from "../hooks/useRecentJobs";

const features = [
  {
    title: "Akıllı Dönüştürme Motoru",
    desc:
      "PDF, DOCX, CSV veya görsel fark etmez - BotExcel tüm formatları tanır ve dakikalar içinde okunabilir Excel tablolara dönüştürür.",
  },
  {
    title: "Yapay Zekâ ile Alan Tanıma",
    desc:
      "LLM destekli analiz; belge içindeki tarih, tutar, hesap, firma gibi alanları otomatik algılar ve doğru sütunlara yerleştirir.",
  },
  {
    title: "Gerçek Excel, Gerçek Formüller",
    desc:
      "Sadece veri değil, yapısıyla anlamlı bir Excel üretir: formüller, koşullu biçimler ve özet tablolar otomatik olarak eklenir.",
  },
  {
    title: "Audit Trail ve Güvenlik",
    desc:
      "Her dönüşüm kim tarafından, ne zaman yapıldı - kayıt altındadır. Veriler şifreli, KVKK ve GDPR uyumlu şekilde saklanır.",
  },
  {
    title: "Doğrulama ve Tutarlılık Kontrolü",
    desc:
      "AI, tablo içindeki toplam değerleri, tekrar eden kayıtları ve hatalı alanları tespit ederek tutarlılık konusunda uyarır.",
  },
  {
    title: "Barkod ve Görsel Tanıma",
    desc:
      "Kamera veya dosyadan barkod okutur, ürün bilgisini tanır ve doğrudan Excel'e işler - özellikle küçük işletmeler için ideal.",
  },
];

export default function UploadPageClient() {
  const { isAuthenticated } = useAuth();
  const { planInfo, remaining, isLimitedOut, isLoading: isPlanLoading } = usePlan();
  const recent = useRecentJobs(3, isAuthenticated);
  const recentItems = useMemo(() => {
    if (recent.status !== "loaded") return [];
    return recent.items.slice(0, 3);
  }, [recent]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 md:py-14 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            Hemen Başla
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Belgeni yükle, dakikalar içinde Excel dashboard’una dönüştür.
          </h1>
          <p className="mx-auto max-w-3xl text-sm md:text-base text-slate-300 md:mx-0">
            BotExcel’in yapay zekâ motoru, PDF, görsel ve dekontları saniyeler içinde temiz, sunuma
            hazır Excel dosyalarına dönüştürür. İlk 3 dönüşüm ücretsiz, hemen dene.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-200 space-y-3">
        {isAuthenticated ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-100">
                {isPlanLoading ? "Plan kontrol ediliyor…" : planInfo?.plan_name ?? "Plan okunamadı"}
              </span>
              <span className="text-xs text-emerald-200">
                {isPlanLoading
                  ? "Kota bilgisi yükleniyor…"
                  : planInfo
                  ? `Bu ay ${planInfo.used_this_month}/${planInfo.monthly_limit} dönüşüm kullandın.`
                  : "Plan bilgisi alınamadı."}
              </span>
              {!isPlanLoading && planInfo ? (
                <span className="text-xs text-emerald-100">
                  Kalan: {remaining} • Yenilenme:{" "}
                  {planInfo.renews_at ? new Date(planInfo.renews_at).toLocaleDateString("tr-TR") : "—"}
                </span>
              ) : null}
            </div>
            {isLimitedOut ? (
              <div className="flex flex-col gap-2 text-xs text-emerald-100">
                <span>Bu ay ücretsiz dönüşüm hakkını doldurdun. Planını yükselt.</span>
                <Link
                  href="/pricing"
                  data-analytics="quota_upgrade_cta"
                  className="inline-flex w-fit items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Planımı Yükselt
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            Ücretsiz denemek için giriş yap veya kayıt ol. Hesabın yoksa{" "}
            <Link href="/register" className="text-emerald-300 underline">
              hemen kaydol
            </Link>{" "}
            veya{" "}
            <Link href="/login" className="text-emerald-300 underline">
              giriş yap
            </Link>
            .
          </div>
        )}
      </div>

      <UploadCtaSection />
      <UploadDemoSection />
      <HowItWorksSection features={features} />
      {isAuthenticated && recentItems.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 text-slate-50">
          <h3 className="mb-3 text-sm font-semibold text-slate-100">Son dönüşümler</h3>
          <div className="grid gap-3 sm:grid-cols-3 text-xs text-slate-200">
            {recentItems.map((item) => (
              <div
                key={item.id ?? item.file_name}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
              >
                <div className="font-semibold text-slate-50 truncate">{item.file_name ?? "Dosya"}</div>
                <div className="text-[11px] text-slate-400">
                  {item.status ? item.status : "Durum bilgisi yok"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("tr-TR")
                    : "Tarih yok"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
