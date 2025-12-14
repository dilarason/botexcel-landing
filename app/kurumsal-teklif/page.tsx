import type { Metadata } from "next";
import { KurumsalForm } from "./KurumsalForm";

export const metadata: Metadata = {
  title: "Kurumsal Teklif Al | BotExcel",
  description:
    "BotExcel için Business ve Enterprise planları hakkında kurumsal teklif almak için formu doldur.",
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
