import type { Metadata } from "next";

export const defaultSEO: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: {
    default:
      "BotExcel – Belgelerini akıllı Excel panolarına dönüştüren yapay zekâ asistanı",
    template: "%s | BotExcel",
  },
  description:
    "PDF, görsel, doküman ve karmaşık tabloları saniyeler içinde temiz, sunuma hazır Excel panolarına dönüştüren yapay zekâ platformu.",
  alternates: {
    canonical: "https://botexcel.pro/",
  },
  keywords: [
    "excel otomasyonu",
    "pdf to excel",
    "ai excel",
    "ocr excel",
    "botexcel",
    "veri temizleme",
    "ai document processing",
    "belge dönüştürme",
    "excel raporlama",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://botexcel.pro/",
    siteName: "BotExcel",
    title:
      "BotExcel – Belgelerini akıllı Excel panolarına dönüştüren yapay zekâ asistanı",
    description:
      "PDF, resim, belge, CSV ve daha fazlasını saniyeler içinde hatasız, denetime hazır Excel’e çeviren yapay zeka motoru.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel — AI Excel Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@botexcel",
    title:
      "BotExcel – Belgelerini akıllı Excel panolarına dönüştüren yapay zekâ asistanı",
    description:
      "PDF → Excel dönüşümünü yapay zekâ ile otomatikleştir, temiz tabloları saniyeler içinde elde et.",
    images: ["/og-image.png"],
  },
};
