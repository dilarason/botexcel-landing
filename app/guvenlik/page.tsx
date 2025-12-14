import { TopNav } from "@/components/TopNav";
import { faqItems } from "@/components/content";

const securityBullets = [
  "Veriler AES-256 ile şifrelenir.",
  "Erişim rolleri RBAC (Role Based Access Control) ile sınırlandırılır.",
  "Tüm işlemler audit log’lara JSON formatında kaydedilir.",
  "Veri saklama bölgeleri Türkiye ve EU datacenter lokasyonlarıyla sınırlıdır.",
];

export const metadata = {
  title: "Güvenlik & Denetim | BotExcel",
};

export default function GuvenlikPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Güven & KVKK</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Veriniz size aittir. Biz sadece düzenleriz.
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Landing’deki güvenlik ve audit içeriği ayrı bir sayfada: şifreleme, RBAC, audit log ve veri saklama
            politikaları aynı dili koruyarak taşındı.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
            <h2 className="text-xl font-semibold text-slate-50">Önce güvenlik</h2>
            <p className="text-sm text-slate-300">
              BotExcel, finansal ve operasyonel verilerin ne kadar kritik olduğunun farkında. Verileriniz yalnızca
              işlenmek üzere kullanılır, mülkiyeti daima sizde kalır.
            </p>
            <ul className="space-y-2 text-sm text-slate-200">
              {securityBullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-200 font-mono shadow-[0_0_24px_rgba(16,185,129,0.12)]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Audit log örneği</div>
            <pre className="whitespace-pre leading-snug">
{`{
  "document_id": "FATURA-2025-03-0012",
  "row": 42,
  "column": "KDV_TUTAR",
  "old_value": "0",
  "new_value": "1.280,50",
  "model_version": "botexcel-gemma-1.3",
  "updated_by": "ai_engine",
  "timestamp": "2025-03-21T10:14:32Z"
}`}
            </pre>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Sık sorulanlar</p>
            <h2 className="text-2xl font-semibold">KVKK, veri saklama ve on-prem</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-50">{item.question}</h3>
                <p className="mt-2 text-xs text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Güvenlik gereksinimlerinizi karşılayalım</h2>
          <p className="mt-2 text-sm text-slate-300">
            KVKK uyumlu akış ve audit trail’i kendi belgelerinizle görün. Gerekirse on-prem paket için iletişime geçin.
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
