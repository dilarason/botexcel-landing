import type { Metadata } from "next";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Fiyatlandırma ve Planlar | BotExcel",
  description:
    "BotExcel ile PDF, görsel ve dokümanlarınızı Excel'e dönüştürmek için Free, Pro ve Kurumsal planlardan size uygun olanı seçin.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-28 md:px-6">
        <header className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/80">
            Fiyatlandırma
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Karmaşık dokümanlar, net planlar.
          </h1>
          <p className="text-sm text-neutral-300 md:text-base">
            Free plan ile ayda birkaç belgeyi dene, Pro ile operasyonunu
            otomatize et, Business ile ekibini tek panelden yönet. Planını
            istediğin zaman yükseltebilirsin.
          </p>
        </header>

        {/* Var olan fiyatlandırma bloklarını buraya alıyoruz */}
        <PricingSection />

        <p className="mt-6 text-xs text-neutral-400">
          Kurumsal ihtiyaçlar için özel teklif almak istiyorsan Business / Enterprise
          kartındaki “Özel Teklif Al” butonuna tıklayabilirsin. Bu alanı daha sonra
          Upload sayfasındaki upgrade akışıyla birleştireceğiz.
        </p>
      </section>
    </main>
  );
}
