import { TopNav } from "@/components/TopNav";
import { PipelineShowcase } from "@/components/PipelineShowcase";
import { workflowSteps } from "@/components/content";

export const metadata = {
  title: "Nasıl Çalışır | BotExcel",
};

export default function NasilCalisirPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Akış</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            PDF → Excel dönüşümü nasıl işliyor?
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Aynı görsel dil, aynı BotExcel motoru. Aşağıdaki akış, mevcut landing’deki “Dosya yükleniyor / Veri
            ayrıştırılıyor / Excel hazır” anlatısını bire bir taşır.
          </p>
        </header>

        <PipelineShowcase />

        <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:grid-cols-3">
          {workflowSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-[0_0_24px_rgba(16,185,129,0.08)]"
            >
              <h3 className="text-sm font-semibold text-slate-100">{step.title}</h3>
              <p className="mt-2 text-xs text-slate-300">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Kendi belgenle dene</h2>
          <p className="mt-2 text-sm text-slate-300">
            Aynı akışı yükleme ekranında gerçek dosyalarınla gör. İlk 3 dönüşüm ücretsiz.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              Belgeni Yükle
            </a>
            <a
              href="/fiyatlandirma"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Planları Gör
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
