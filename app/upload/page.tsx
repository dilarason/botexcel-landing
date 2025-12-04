import type { Metadata } from "next";
import UploadPageClient from "./upload-page-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: "BotExcel | Belgeni Yükle",
  description:
    "Belgeni yükle ve BotExcel’in yapay zekâ destekli dönüştürme motoru ile saniyeler içinde Excel’e çevir.",
  alternates: {
    canonical: "https://botexcel.pro/upload",
  },
  openGraph: {
    title: "BotExcel | Belgeni Yükle",
    description:
      "PDF, görsel ve dokümanlarını yükle; BotExcel ile saniyeler içinde temiz Excel tablolara dönüştür.",
    url: "https://botexcel.pro/upload",
    siteName: "BotExcel",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel yükleme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BotExcel | Belgeni Yükle",
    description:
      "Belgeni BotExcel’e yükle, yapay zekâ ile saniyeler içinde Excel’e dönüştür ve 3 ücretsiz dönüşümle dene.",
    images: ["/og-image.png"],
  },
};

export default function UploadPage() {
  return <UploadPageClient />;
}
