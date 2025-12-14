import { TopNav } from "@/components/TopNav";
import { OutputQualitySection } from "@/components/OutputQualitySection";
import {
  capabilityCards,
  featureCards,
  resourceCards,
  templateCards,
} from "@/components/content";

export const metadata = {
  title: "Özellikler | BotExcel",
};

export default function OzelliklerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Özellikler</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Veri karmaşasından tablo netliğine.</h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Eski landing’deki tüm kartlar ve yetkinlikler burada: dönüştürme motoru, audit trail, OCR, API ve şablonlar
            aynı görsel dilde.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {featureCards.map((feat) => (
            <article
              key={feat.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(15,23,42,0.35)]"
            >
              <h3 className="text-sm font-semibold text-slate-50">{feat.title}</h3>
              <p className="mt-2 text-xs text-slate-300">{feat.desc}</p>
            </article>
          ))}
        </section>

        <OutputQualitySection />

        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Öne çıkan yetkinlikler</p>
            <h2 className="text-2xl font-semibold">Sadece dönüştürmek değil; doğrulamak, anlamlandırmak.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {capabilityCards.map((cap) => (
              <article
                key={cap.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(16,185,129,0.1)]"
              >
                <h3 className="text-sm font-semibold text-slate-50">{cap.title}</h3>
                <p className="mt-2 text-xs text-slate-300">{cap.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Hazır Excel şablonları</p>
            <h2 className="text-2xl font-semibold">En çok kullanılan raporlar tek tıkla.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {templateCards.map((tpl) => (
              <article
                key={tpl.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-50">{tpl.title}</h3>
                <p className="mt-2 text-xs text-slate-300">{tpl.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Kaynaklar</p>
            <h2 className="text-2xl font-semibold">BotExcel’i ekibinize daha hızlı taşıyın.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {resourceCards.map((res) => (
              <article
                key={res.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{res.label}</span>
                <h3 className="mt-1 text-sm font-semibold text-slate-50">{res.title}</h3>
                <p className="mt-2 text-xs text-slate-300">{res.text}</p>
                <span className="mt-3 inline-flex text-[11px] text-emerald-200">{res.cta} →</span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Özellikleri kendi dosyanla gör</h2>
          <p className="mt-2 text-sm text-slate-300">
            Aynı kartlar, aynı çıktı kalitesi. Belgeni yükle, ilk 3 dönüşüm ücretsiz.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              Belgeni Yükle
            </a>
            <a
              href="/nasil-calisir"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Akışı Gör
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
