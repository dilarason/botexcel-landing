"use client";

type UserStory = {
  title: string;
  description: string;
  bullets: string[];
};

interface UseCasesSectionProps {
  stories: UserStory[];
}

export function UseCasesSection({ stories }: UseCasesSectionProps) {
  return (
    <section
      id="use-cases"
      aria-label="BotExcel kullanım alanları"
      className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50"
    >
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-2">
          Kullanıcı hikayeleri
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          "İşte ihtiyacım olan buydu" dedirten çözümler.
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl">
          BotExcel yalnızca dönüştürmekle kalmaz; doğrulama, audit trail ve zengin Excel çıktılarıyla
          finans, operasyon ve KOBİ ekiplerinin günlük işini hızlandırır.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {stories.map((story) => (
          <article
            key={story.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-2"
          >
            <h3 className="text-sm font-semibold text-slate-50">{story.title}</h3>
            <p className="text-xs text-slate-300 mb-1">{story.description}</p>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {story.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
