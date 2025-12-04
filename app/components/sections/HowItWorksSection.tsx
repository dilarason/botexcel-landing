"use client";

type Feature = {
  title: string;
  desc: string;
};

interface HowItWorksSectionProps {
  features: Feature[];
}

export function HowItWorksSection({ features }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      aria-label="BotExcel nasıl çalışır"
      className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-14 text-slate-50"
    >
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
          Özellikler
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Veri karmaşasından tablo netliğine giden tüm adımlar tek yerde.
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl mx-auto">
          BotExcel belgeleri yalnızca Excel&apos;e dönüştürmekle kalmaz; yapay zekâ ile anlar,
          doğrular, açıklar ve güvenle saklanabilir hale getirir.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feat) => (
          <article
            key={feat.title}
            className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <h3 className="text-sm font-semibold text-slate-50">{feat.title}</h3>
            <p className="text-xs text-slate-300">{feat.desc}</p>
          </article>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-6 max-w-2xl mx-auto">
        Manuel veri girişi, dosya birleştirme ve tablo temizleme derdine son. BotExcel, belgelerinizi
        dakikalar içinde anlamlı, doğrulanmış ve paylaşılabilir Excel tablolara dönüştürür.
        <br />
        AI + PDF + Görsel + Audit + Excel
      </p>
    </section>
  );
}
