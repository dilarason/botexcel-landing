import GoogleAnalytics from "@/components/GoogleAnalytics";
import IubendaScript from "@/components/IubendaScript";
import PersonSchema from "@/components/PersonSchema";
import ResourceHints from "@/components/ResourceHints";
import SmoothScroll from "@/components/SmoothScroll";
import { BackgroundProvider } from "@/context/BackgroundContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://botexcel.ai"),
  title: {
    default: "BotExcel | Excel, nihayet net.",
    template: "%s | BotExcel",
  },
  description:
    "BotExcel, belge verisini standart tabloya çevirir ve temiz Excel çıktısı üretir.",
  alternates: {
    canonical: "https://botexcel.ai",
  },
  keywords: [
    "Excel otomasyon",
    "Belge dönüştürme",
    "PDF to Excel",
    "Fatura ve ekstre",
    "Tablo standardı",
    "Veri temizleme",
    "Özet ve kontrol",
    "Kurumsal Excel",
    "BotExcel",
  ],
  authors: [{ name: "BotExcel", url: "https://botexcel.ai" }],
  creator: "BotExcel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://botexcel.ai",
    title: "BotExcel | Excel, nihayet net.",
    description:
      "BotExcel, belge verisini standart tabloya çevirir ve temiz Excel çıktısı üretir.",
    siteName: "BotExcel",
    images: [
      {
        url: "/og-image.jpg", // We need to generate or add this
        width: 1200,
        height: 630,
        alt: "BotExcel - Excel, nihayet net.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BotExcel | Excel, nihayet net.",
    description:
      "BotExcel, belge verisini standart tabloya çevirir ve temiz Excel çıktısı üretir.",
    creator: "@botexcel", // Update with real handle if available
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <ResourceHints />
        <PersonSchema />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden w-full`}
      >
        <BackgroundProvider>
          <IubendaScript />
          <GoogleAnalytics />
          <SmoothScroll>
            {children}
            <SpeedInsights />
            <Analytics />
          </SmoothScroll>
        </BackgroundProvider>
      </body>
    </html>
  );
}
