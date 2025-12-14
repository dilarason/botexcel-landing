import { TopNav } from "@/components/TopNav";
import { userStories } from "@/components/content";

export const metadata = {
  title: "Kullanıcı Hikayeleri | BotExcel",
};

export default function KullanicilarPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Kullanıcı hikayeleri</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">"İşte ihtiyacım olan buydu."</h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Finans, operasyon, KOBİ ve kurumsal ekipler için eski landing’deki aynı kartlar burada. Yeni iddia yok, aynı
            dil ve görsel yapı.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {userStories.map((story) => (
            <article
              key={story.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(15,23,42,0.35)]"
            >
              <h3 className="text-sm font-semibold text-slate-50">{story.title}</h3>
              <p className="mt-2 text-xs text-slate-300">{story.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                {story.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-950 p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <h2 className="text-xl font-semibold text-emerald-50">
            Tİ İthalat & İhracat ve yüzlerce kurum BotExcel’e güveniyor.
          </h2>
          <p className="mt-2 text-sm text-emerald-50/90">
            “PDF dekontlarını ve banka ekstrelerini BotExcel ile 8 dakikada rapora dönüştürüyoruz. Audit trail sayesinde
            denetim raporları hiç olmadığı kadar hızlı hazırlandı.”
          </p>
        </section>

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Kendi hikayeni ekle</h2>
          <p className="mt-2 text-sm text-slate-300">
            İlk 3 dönüşüm ücretsiz. Finans, operasyon veya denetim akışında nasıl hızlandığını test et.
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
