import { TopNav } from "@/components/TopNav";

const quickLinks = [
  { href: "/nasil-calisir", label: "Nasıl çalışır" },
  { href: "/agent", label: "Agent" },
  { href: "/guvenlik", label: "Güvenlik" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-14 text-center">
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black px-6 py-16 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_at_30%_20%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(900px_at_80%_80%,rgba(16,185,129,0.22),transparent_55%)]" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="bx-gradient-text">Veri karmaşasından tablo</span>{" "}
              <span className="text-white">netliğine.</span>
            </h1>
            <p className="max-w-2xl text-base text-slate-300 md:text-lg">
              <span className="bx-gradient-text">
                PDF, resim, fatura, dekont ve karmaşık tablolar BotExcel’de dakikalar içinde temiz Excel’e döner.
              </span>{" "}
              <span className="text-white">İlk 3 dönüşüm ücretsiz.</span>
            </p>
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/15 px-6 py-3 text-sm font-semibold text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500/30"
            >
              Belgeni Yükle
            </a>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-800/70 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 flex flex-col items-center gap-3">
            {[0.18, 0.24, 0.3, 0.36, 0.42, 0.36, 0.3, 0.24].map((opacity, idx) => (
              <div
                key={idx}
                className="h-3 w-full max-w-3xl rounded-full bg-gradient-to-r from-sky-500/50 via-emerald-400/60 to-sky-500/50"
                style={{ opacity }}
              />
            ))}
          </div>
        </div>

        <section className="mt-12 grid w-full gap-4 text-left md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Nasıl</span>{" "}
              <span className="text-white">çalışır</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">Yükle → ayrıştır → Excel hazır akışının</span>{" "}
              <span className="text-white">kısa özeti.</span>
            </p>
            <a
              href="/nasil-calisir"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Özellik</span>{" "}
              <span className="text-white">ler</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">OCR, doğrulama, audit trail ve şablonların</span>{" "}
              <span className="text-white">tamamı.</span>
            </p>
            <a
              href="/ozellikler"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Agen</span>
              <span className="text-white">t</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">Drive/Dropbox klasörü bağla, dosyalar otomatik</span>{" "}
              <span className="text-white">Excel olsun.</span>
            </p>
            <a
              href="/agent"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Fiyatlandır</span>
              <span className="text-white">ma</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">İlk 3 dönüşüm ücretsiz; plan detayları</span>{" "}
              <span className="text-white">burada.</span>
            </p>
            <a
              href="/fiyatlandirma"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Güvenli</span>
              <span className="text-white">k</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">KVKK/GDPR, RBAC ve audit log</span>{" "}
              <span className="text-white">politikaları.</span>
            </p>
            <a
              href="/guvenlik"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-semibold text-slate-50">
              <span className="bx-gradient-text">Kullanıcı</span>
              <span className="text-white">lar</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              <span className="bx-gradient-text">Finans ve operasyon ekiplerinden gerçek</span>{" "}
              <span className="text-white">hikayeler.</span>
            </p>
            <a
              href="/kullanicilar"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-200 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-100"
            >
              Devamını gör →
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}
