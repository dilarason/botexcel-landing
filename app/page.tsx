"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AuthDialog } from "./components/AuthDialog";

type AuthMode = "login" | "register";

const heroStats = [
  { value: "1,2M+", label: "Belgeler" , detail: "AI ile Excel'e dönüştü" },
  { value: "48%", label: "Zaman tasarrufu", detail: "ortalama manuel çaba" },
  { value: "15+", label: "Desteklenen format", detail: "PDF, JPG, CSV, XLSX" },
  { value: "KVKK", label: "Ülke odaklı", detail: "Türkiye ve EU veri bölgeleri" },
];

const featureHighlights = [
  {
    title: "Hayal ettiğiniz Excel, otomatik kurulum",
    description:
      "Formüller, koşullu biçimler ve audit-log destekli tablolar birkaç dakika içinde hazır olur.",
  },
  {
    title: "Her formattan veri alır",
    description:
      "PDF, e-posta, mobil fotoğraflar veya eski Excel şablonları fark etmez; BotExcel anlamlı sütunlara yerleştirir.",
  },
  {
    title: "Güvenlik + KVKK",
    description:
      "Roller, AES-256 şifreleme ve sabit audit-trail zinciriyle verileriniz sadece işleminiz süresince saklanır.",
  },
  {
    title: "API + CLI & şablonlar",
    description:
      "REST API, CLI ve hazır Excel şablonlarıyla ERP/CRM entegrasyonları birkaç komut içinde canlıya alınır.",
  },
];

const proofPills = [
  "On-prem / hybrid motor opsiyonları",
  "Audit trail + kapsamlı loglama",
  "Yerel veri merkezlerinde KVKK ve GDPR",
  "Takım ve rol bazlı erişim kontrolleri",
];

export default function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<AuthMode>("login");

  const openDialog = (mode: AuthMode) => {
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const heroBadge = useMemo(
    () => [
      "PDF → Excel dönüşümleri",
      "Barkod & OCR",
      "Audit-ready raporlar",
    ],
    []
  );

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-emerald-300">
              <span>BotExcel · AI Excel</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
                Verileri biriktirme, onları anlamlı Excel raporlarına dönüştür.
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Faturalardan banka ekstrelerine, ocak ayı teslimatlarından
                OCR’lı kasa fişlerine kadar belgeleriniz BotExcel’de bir daha
                hiçbir zaman elle düzenlenmez. AI motoru, audit trail ve
                indirmeye hazır Excel çıktılarıyla ekibiniz hazır hissetsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openDialog("login")}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Giriş yap
              </button>
              <button
                onClick={() => openDialog("register")}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:border-emerald-400 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Hesap oluştur
              </button>
              <Link
                href="/purchase"
                className="inline-flex items-center justify-center rounded-full bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Planları incele
              </Link>
            </div>

            <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm sm:grid-cols-2 md:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-base font-semibold text-emerald-300">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </div>
                  <p className="text-[11px] text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900/40 to-slate-950/40 p-6 shadow-2xl shadow-black/40">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
              Hemen çalışmaya hazır
            </p>
            <h2 className="text-2xl font-semibold text-slate-50">
              Sadece bir dosya seç, AI motoru gerisini halletsin.
            </h2>
            <p className="text-sm text-slate-300">
              Kullanıcıların %86’sı ilk 5 dakikada bir PDF’i Excel’e çevirdi ve
              audit-ready raporu paylaştı. Sen de planlarından birini seç,
              slogan değil; gerçek çıktılar üret.
            </p>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {heroBadge.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-300">
                <p className="font-semibold text-emerald-200">
                  Bekleyen belgelerim
                </p>
                <p className="text-[11px] text-slate-400">
                  Günlük Excel üretimi, özel şablonlar, API çağrıları ve
                  entegre KPI panellerine ait özet raporlar. Hepsi audit log
                  ile kaydedilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-slate-900 md:grid-cols-2">
          {featureHighlights.map((feature) => (
            <article
              key={feature.title}
              className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-50">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">
            Güven, hız ve net hesap
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl">
            BotExcel sadece veriyi dönüştürmez; onu anlamlandırır, sahadaki
            ekiplerle eşleştirir ve net Excel tablolarıyla paylaşılmasını sağlar.
            KVKK uyumlu altyapı, audit-ready loglama, API ve CLI ile otomasyon.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proofPills.map((pill) => (
              <div
                key={pill}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-slate-300"
              >
                {pill}
              </div>
            ))}
          </div>
        </section>
      </div>

      <AuthDialog
        open={dialogOpen}
        mode={dialogMode}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
