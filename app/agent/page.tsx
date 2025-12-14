import { TopNav } from "@/components/TopNav";
import { capabilityCards } from "@/components/content";

const agentCards = [
  {
    title: "Drive / Dropbox klasörü bağla",
    text: "Seçtiğin klasör BotExcel kuyruğuna bağlanır; yeni dosyalar otomatik alınır ve aynı motorla Excel’e çevrilir.",
  },
  {
    title: "API & CLI otomasyonu",
    text: capabilityCards.find((c) => c.title === "API & CLI Otomasyonu")?.text ?? "",
  },
  {
    title: "Audit trail & doğrulama",
    text: "Her otomatik dönüşüm kim tarafından, ne zaman yapıldı kaydıyla gelir; hücre bazlı log ve uyarılar hazır.",
  },
];

export const metadata = {
  title: "BotExcel Agent | Otomatik Klasör Dönüşümü",
};

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Agent</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Drive / Dropbox klasörünü bağla, dosyalar otomatik Excel’e dönüşsün.
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300 md:text-base">
            Sohbet veya chat demo yok. Sadece klasör izleme, otomatik dönüşüm, audit trail ve mevcut BotExcel güvenlik
            katmanı.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {agentCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(15,23,42,0.35)]"
            >
              <h3 className="text-sm font-semibold text-slate-50">{card.title}</h3>
              <p className="mt-2 text-xs text-slate-300">{card.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:grid-cols-2">
          <article className="space-y-2">
            <h2 className="text-xl font-semibold">Nasıl çalışır?</h2>
            <ol className="space-y-2 text-sm text-slate-300">
              <li>1) BotExcel hesabınla giriş yap ve Agent’ı etkinleştir.</li>
              <li>2) Drive veya Dropbox klasörünü seç; erişim sadece bu klasörle sınırlı kalır.</li>
              <li>3) Yeni dosyalar sıraya alınır, PDF/IMG/CSV fark etmeksizin Excel çıktısı oluşturulur.</li>
              <li>4) Audit log ve uyarılar dashboard’da görünür; ister indir ister API ile çek.</li>
            </ol>
          </article>
          <article className="rounded-2xl border border-emerald-500/50 bg-emerald-900/20 p-4 text-sm text-emerald-50">
            <p className="font-semibold">Neyi değiştirmiyoruz?</p>
            <ul className="mt-2 space-y-1.5 text-emerald-100/90">
              <li>• Aynı dönüşüm motoru ve doğrulama kuralları.</li>
              <li>• KVKK uyumlu saklama ve RBAC.</li>
              <li>• Excel hazır olduğunda bildirim + indirilebilir bağlantı.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-emerald-500/60 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-slate-950 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Agent’ı aktif et</h2>
          <p className="mt-2 text-sm text-slate-300">
            Drive / Dropbox entegrasyonu veya kendi S3/minio klasörlerin için destek ekibine ulaş.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              Hemen Başla
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
