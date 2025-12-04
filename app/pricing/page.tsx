import type { Metadata } from "next";
import { PricingSection } from "../components/PricingSection";
import { FAQSection } from "../components/sections/FAQSection";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: "BotExcel Fiyatlandırma | Planlar ve Özellikler",
  description:
    "BotExcel ile PDF ve görsellerini akıllı Excel tablolara dönüştür. Ücretsiz başla, ihtiyacına göre Free, Pro, Business veya Enterprise planını seç.",
  alternates: {
    canonical: "https://botexcel.pro/pricing",
  },
  openGraph: {
    title: "BotExcel Fiyatlandırma | Planlar ve Özellikler",
    description:
      "BotExcel planlarını karşılaştır: Free, Pro, Business ve Enterprise seçenekleriyle belge dönüşümünü ölçeklendir.",
    url: "https://botexcel.pro/pricing",
    siteName: "BotExcel",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel fiyatlandırma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BotExcel Fiyatlandırma | Planlar ve Özellikler",
    description:
      "BotExcel planlarını incele ve belge dönüşüm hacmini ihtiyacına göre büyüt.",
    images: ["/og-image.png"],
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            FİYATLANDIRMA
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Planını seç, veri karmaşasını geride bırak.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-300">
            İlk 3 dönüşüm ücretsiz. Daha fazlası için Starter, Pro veya Business planla kotaları
            büyütebilir; ekip kullanımına geçtiğinde Business plan veya kurumsal teklif ile ölçekleyebilirsin.
          </p>
        </div>
      </header>

      <PricingSection />

      <FAQSection title="Sık sorulan fiyatlandırma soruları" />
    </main>
  );
}
