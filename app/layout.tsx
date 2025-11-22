import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "BotExcel – AI destekli PDF → Excel dönüşümleri",
  description: "Faturaları, ekstreleri ve sözleşmeleri dakikalar içinde temiz Excel tablolarına çevir.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script
          defer
          data-domain="botexcel.pro"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
