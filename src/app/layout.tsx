import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BotExcel Landing (src)",
  description: "Legacy placeholder layout; main app lives under /app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
