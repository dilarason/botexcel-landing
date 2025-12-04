import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: "Excel’de Barkodlu Stok Takibi Rehberi | BotExcel",
  description:
    "Barkodlu stok takibini Excel ve BotExcel entegrasyonuyla nasıl kuracağınız hakkında adım adım rehber. Şimdilik özet bir taslak sayfa.",
  alternates: {
    canonical: "https://botexcel.pro/guides/barcode-stock-tracking",
  },
  openGraph: {
    title: "Excel’de Barkodlu Stok Takibi Rehberi",
    description:
      "Barkodlu stok takibi, Excel şablonları ve BotExcel entegrasyonuna dair taslak rehber.",
    url: "https://botexcel.pro/guides/barcode-stock-tracking",
    siteName: "BotExcel",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel barkodlu stok takibi rehberi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel’de Barkodlu Stok Takibi Rehberi",
    description:
      "Barkod okuyucu ve BotExcel entegrasyonuyla stok takibi kurulumuna dair taslak rehber.",
    images: ["/og-image.png"],
  },
};

export default function BarcodeStockTrackingGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 md:py-16">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            Rehber
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Excel’de barkodlu stok takibi nasıl yapılır?
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Bu sayfa, barkod okuyucu, Excel şablonları ve BotExcel entegrasyonunu adım adım anlatan
            rehber için yer tutucu olarak hazırlanmıştır. İçerik daha sonra detaylandırılacaktır.
          </p>
        </header>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
          <p>
            Şu anda özet bir dokümantasyon iskeletini görüyorsunuz. Buraya, barkodlu ürün
            girişlerinin nasıl tutulacağı, stok hareketlerinin nasıl izleneceği ve BotExcel &amp;
            Excel şablonlarının birlikte nasıl kullanılacağına dair örnekler eklenecek.
          </p>
          <p>
            Canlı ürün akışını görmek için dosya yükleme ekranına geçebilir, gerçek faturalarınızı
            ve stok listelerinizi BotExcel ile deneyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/upload"
            className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Belge yükle ve dene
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
