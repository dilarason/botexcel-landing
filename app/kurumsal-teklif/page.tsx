import type { Metadata } from "next";
import { KurumsalForm } from "./KurumsalForm";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: "Kurumsal Teklif Al | BotExcel",
  description:
    "BotExcel için Business ve Enterprise planları hakkında kurumsal teklif almak için formu doldur.",
  alternates: {
    canonical: "https://botexcel.pro/kurumsal-teklif",
  },
  openGraph: {
    title: "Kurumsal Teklif Al | BotExcel",
    description:
      "BotExcel’in Business ve Enterprise planları için kurumsal teklif iste. KVKK uyumlu, güvenli veri dönüşümleri.",
    url: "https://botexcel.pro/kurumsal-teklif",
    siteName: "BotExcel",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel kurumsal teklif",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurumsal Teklif Al | BotExcel",
    description:
      "BotExcel Business ve Enterprise planları için kurumsal teklif talep et.",
    images: ["/og-image.png"],
  },
};

export default function KurumsalTeklifPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 md:px-6">
        <KurumsalForm />
      </section>
    </main>
  );
}
