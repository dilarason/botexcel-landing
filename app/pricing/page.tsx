import type { Metadata } from "next";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Fiyatlandırma | BotExcel",
  description:
    "BotExcel ile PDF ve görsellerini akıllı Excel tablolara dönüştür. Ücretsiz başla, ihtiyacına göre Starter, Pro veya Business planı seç.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            FİYATLANDIRMA
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Planını seç, veri karmaşasını geride bırak.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-300">
            İlk 3 dönüşüm ücretsiz. Daha fazlası için Starter, Pro veya Business planla kotaları
            büyütebilir; ekip kullanımına geçtiğinde Business plan veya kurumsal teklif ile ölçekleyebilirsin.
          </p>
        </div>
      </header>

      <PricingSection />

      <section className="border-t border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-50">
            Sık sorulan fiyatlandırma soruları
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200">
                Free planda gerçekten kart bilgisi gerekiyor mu?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Hayır. Free plan için kart bilgisi istemiyoruz. Sadece e-posta ile kayıt olup ayda 3
                belgeyi ücretsiz dönüştürebilirsin.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200">
                Planımı daha sonra değiştirebilir miyim?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Evet. Ay içinde istediğin zaman Starter’dan Pro’ya geçebilir, Business veya kurumsal
                plan için satış ekibiyle iletişime geçebilirsin.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200">
                Kurumsal teklif süreci nasıl işliyor?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Kurumsal teklif formunu doldurduğunda; ekip boyutun, belge hacmin ve entegrasyon
                ihtiyacına göre sana özel bir teklif hazırlıyoruz.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200">
                Fiyatlara KDV ve kur farkı dahil mi?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Gösterilen fiyatlara KDV dahil değildir. Faturalama Türk Lirası üzerinden yapılır; kur
                değişiklikleri sadece uluslararası ödemeleri etkiler.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
