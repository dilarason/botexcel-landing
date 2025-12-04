import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: "Veri Güvenliği & KVKK | BotExcel",
  description:
    "BotExcel’in veri güvenliği, KVKK uyumluluğu ve audit katmanı için teknik dokümantasyon iskeleti. Güvenlik politikaları ve loglama modeli daha sonra burada detaylandırılacaktır.",
  alternates: {
    canonical: "https://botexcel.pro/docs/security",
  },
  openGraph: {
    title: "BotExcel Veri Güvenliği & KVKK",
    description:
      "BotExcel’in yerel yapay zekâ mimarisi, erişim kontrolleri ve audit loglaması için güvenlik taslağı.",
    url: "https://botexcel.pro/docs/security",
    siteName: "BotExcel",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel güvenlik dokümantasyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BotExcel Veri Güvenliği & KVKK",
    description:
      "BotExcel veri güvenliği, KVKK uyumluluğu ve audit katmanı için teknik dokümantasyon taslağı.",
    images: ["/og-image.png"],
  },
};

export default function SecurityDocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 md:py-16">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            KVKK &amp; Güvenlik
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Veri Güvenliği &amp; Audit Katmanı
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Bu sayfa, BotExcel’in yerel yapay zekâ mimarisi, erişim kontrolleri, log yönetimi ve
            KVKK uyumluluğu için teknik dokümantasyonun yer tutucusudur. Ayrıntılı politika,
            mimari diagramlar ve denetim örnekleri ilerleyen sürümlerde eklenecektir.
          </p>
        </header>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
          <p>
            Buraya, veri saklama politikaları, şifreleme standartları, erişim yetkileri ve
            audit-log formatı gibi detaylar gelecek. Amaç, iç ve dış denetim ekiplerinin ihtiyaç
            duyduğu tüm bilgileri tek yerde toplamak.
          </p>
          <p>
            Canlı ürün davranışını görmek için, giriş yaptıktan sonra dosya yükleyip{" "}
            <code className="rounded bg-slate-800 px-1 py-0.5 text-[0.75rem]">
              /recent.json
            </code>{" "}
            ve benzeri endpoint’lerden audit kayıtlarını inceleyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/upload"
            className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Dosya yükle
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 underline hover:text-slate-200"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </section>
    </main>
  );
}
