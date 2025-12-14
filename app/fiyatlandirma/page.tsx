import { TopNav } from "@/components/TopNav";
import { PricingSection } from "@/components/PricingSection";

export const metadata = {
  title: "Fiyatlandırma | BotExcel",
};

export default function FiyatlandirmaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Fiyatlandırma</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            İlk 3 dönüşüm ücretsiz. Sonrası esnek planlar.
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Eski landing’deki aynı plan kartları: Free, Pro, Business, Enterprise. Yeni claim yok; 3 ücretsiz dönüşüm
            mesajı burada.
          </p>
        </header>

        <PricingSection />

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Deneyip karar ver</h2>
          <p className="mt-2 text-sm text-slate-300">
            Hemen yükle, 3 dosyayı ücretsiz çevir. Daha fazlası için planını dilediğin an yükselt.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              Hemen Başla
            </a>
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Belgeni Yükle
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
