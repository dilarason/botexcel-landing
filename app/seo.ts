import type { Metadata } from "next";

export const defaultSEO: Metadata = {
  metadataBase: new URL("https://www.botexcel.pro"),
  title: {
    default: "BotExcel — Belgelerden Excel'e Anında Dönüşüm",
    template: "%s | BotExcel",
  },
  description:
    "PDF, görsel, doküman ve karmaşık tabloları saniyeler içinde temiz bir Excel’e çeviren yapay zeka platformu.",
  keywords: [
    "excel",
    "pdf to excel",
    "tablo otomasyon",
    "ai excel",
    "ocr excel",
    "botexcel",
    "veri temizleme",
    "ai document processing",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.botexcel.pro",
    siteName: "BotExcel",
    title: "BotExcel — Belgelerden Excel'e Anında Dönüşüm",
    description:
      "PDF, resim, belge, CSV ve daha fazlasını saniyeler içinde hatasız Excel’e çeviren yapay zeka motoru.",
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
    title: "BotExcel — Belgelerden Excel'e Anında Dönüşüm",
    description: "PDF → Excel dönüşümünü yapay zeka ile otomatikleştir.",
    images: ["/og-image.png"],
  },
};
