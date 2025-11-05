import "./globals.css";

export const metadata = {
  title: "BotExcel — Veri karmaşasından tablo netliğine",
  description: "Fatura, sözleşme, görsel… dağınık veriyi profesyonel Excel tablolarına dönüştürün.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
