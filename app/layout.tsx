import type { ReactNode } from "react";
import "./globals.css";
import { defaultSEO } from "./seo";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";

export const metadata = defaultSEO;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          defer
          data-domain="botexcel.pro"
          src="https://plausible.io/js/script.js"
        />
        <script
          key="botexcel-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "BotExcel",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any",
              description:
                "PDF, görüntü, belge ve CSV dosyalarını yapay zeka ile temiz Excel tablolarına dönüştüren SaaS platformu.",
              url: "https://www.botexcel.pro",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}


