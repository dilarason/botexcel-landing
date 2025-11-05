import Link from "next/link";

export const metadata = {
  title: "Satın Al | BotExcel",
  description:
    "BotExcel planınızı seçin ve belgelerinizi dakikalar içinde Excel'e dönüştürmeye başlayın.",
};

const plans = [
  {
    name: "Pro",
    price: "₂.490 ₺ / ay",
    description:
      "Finans ve operasyon ekipleri için sınırsız dönüşüm, audit trail ve premium destek.",
  },
  {
    name: "Business",
    price: "₺ 6.900 ₺ / ay",
    description:
      "Ekipler için REST API, CLI entegrasyonları, log arşivleme ve SSO desteği.",
  },
  {
    name: "Enterprise",
    price: "İletişime geçin",
    description:
      "On-prem AI, özel SLA, KVKK uyum danışmanlığı ve beyaz etiket seçenekleri.",
  },
];

export default function PurchasePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-20 text-slate-50">
      <div className="w-full max-w-5xl space-y-10">
        <header className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Satın Alma
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-200">
            BotExcel ile PDF → Excel dönüşümünü dakikalar içinde otomatikleştir
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300">
            Planını seç, hesabını oluştur ve belgelerini yüklemeye başla. Tüm
            planlarda audit trail, KVKK uyumlu veri saklama ve sınırsız destek
            standarttır.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex h-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h2 className="text-lg font-semibold text-slate-100">
                {plan.name}
              </h2>
              <p className="text-sm text-emerald-300">{plan.price}</p>
              <p className="flex-1 text-xs text-slate-300">{plan.description}</p>
              <Link
                href="/register"
                className="inline-flex justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-950 transition hover:bg-emerald-400"
              >
                Planı Seç
              </Link>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-slate-100">Soruların mı var?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Satın alma sürecinde destek ekibimizle konuşmak istersen{" "}
            <a
              href="mailto:sales@botexcel.com"
              className="text-emerald-300 transition hover:text-emerald-200"
            >
              sales@botexcel.com
            </a>{" "}
            adresine hemen yazabilirsin.
          </p>
        </section>
      </div>
    </main>
  );
}
