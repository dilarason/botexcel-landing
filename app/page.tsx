import type { Metadata } from "next";
import LandingPage from "./components/LandingPage";

const pageTitle =
  "BotExcel – Belgelerini akıllı Excel panolarına dönüştüren yapay zekâ asistanı";
const pageDescription =
  "BotExcel, PDF, görsel, fatura ve dekontları saniyeler içinde temiz Excel panolarına dönüştüren yapay zekâ destekli dönüşüm platformudur.";

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.pro"),
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://botexcel.pro/",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://botexcel.pro/",
    siteName: "BotExcel",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BotExcel — Yapay zekâ destekli Excel otomasyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BotExcel",
    url: "https://botexcel.pro",
    description: pageDescription,
  };

  return (
    <>
      <LandingPage />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
