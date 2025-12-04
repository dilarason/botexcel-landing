"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { usePlan } from "../../hooks/usePlan";

export function UploadCtaSection() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isLimitedOut, planInfo, remaining } = usePlan();
  const heroCtaHref = isAuthenticated ? "/upload" : "/register";
  const buttonLabel = !isAuthenticated
    ? "Hemen Başla"
    : isLimitedOut
    ? "Limit doldu – planını yükselt"
    : "Belgemle Devam Et";

  return (
    <section
      id="upload"
      aria-label="Belgeni yükle çağrısı"
      className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-6 text-center text-slate-50"
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">
        Belgeni yükle, 3 ücretsiz dönüşüm al
      </h2>
      <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
        Animasyon bitti, şimdi tek aksiyonla kendi belgeni dene. BotExcel karmaşık dosyaları
        dakikalar içinde Excel&apos;e çevirir.
      </p>
      {isAuthenticated && planInfo ? (
        <div className="mt-3 text-xs text-emerald-200/80">
          Planın: <span className="font-semibold text-emerald-100">{planInfo.plan_name}</span> • Bu
          ay {planInfo.used_this_month}/{planInfo.monthly_limit} dönüşüm kullandın
          {remaining > 0 ? ` (${remaining} kaldı)` : " (limit dolu)"}
        </div>
      ) : null}
      <div className="mt-4 flex justify-center">
        <Link
          href={heroCtaHref}
          data-analytics="hero_primary_cta"
          aria-disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-70"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
