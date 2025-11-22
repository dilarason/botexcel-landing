import Link from "next/link";

import { landingPlans, mockUser } from "../lib/plans";

type PricingSectionProps = {
  showSession?: boolean;
};

export default function PricingSection({ showSession = false }: PricingSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
          Fiyatlandırma
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Ekibiniz büyüdükçe ölçeklenen planlar.
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Küçük bir KOBİ’den kurumsal finans ekibine kadar, ihtiyaçlarınıza uygun bir BotExcel planı tasarladık.
        </p>
      </header>

      {showSession && (
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-200 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="uppercase tracking-[0.3em] text-emerald-300">Giriş yapan kullanıcı</p>
            <p className="text-base font-semibold text-slate-50">{mockUser.name}</p>
            <p className="text-slate-400">{mockUser.email}</p>
          </div>
          <div className="mt-3 sm:mt-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-200">
            Aktif plan: {mockUser.currentPlan}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {landingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl border p-4 flex flex-col gap-2 ${
              plan.highlight ? "border-emerald-400 bg-emerald-950/40" : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-50 flex items-center justify-between">
                <span>{plan.name}</span>
              </h3>
              <div className="text-lg font-semibold text-slate-50">{plan.price}</div>
              <p className="text-[11px] text-slate-400">{plan.limit}</p>
            </div>
            <p className="text-[11px] text-slate-300">{plan.tagline}</p>
            <ul className="text-[11px] text-slate-300 space-y-1 mb-2">
              {plan.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
            {plan.contact ? (
              <a
                href={plan.href}
                className="mt-auto inline-flex justify-center px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-100 hover:bg-emerald-400 hover:text-emerald-900 transition"
              >
                Hemen Başla
              </a>
            ) : (
              <Link
                href="/register"
                className={`mt-auto inline-flex justify-center px-3 py-1.5 rounded-full font-medium transition ${
                  plan.highlight
                    ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                    : "border border-slate-600 text-slate-100 hover:bg-slate-800"
                }`}
              >
                Hemen Başla
              </Link>
            )}
          </article>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Business planını ekip ihtiyaçlarınıza göre şekillendirmek için {" "}
        <a href="mailto:sales@botexcel.com" className="text-emerald-300 hover:text-emerald-200">
          sales@botexcel.com
        </a>{" "}
        adresindeki ekiple iletişime geçebilirsiniz.
      </p>

      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Kurumsal mı düşünüyorsun?
            </p>
            <h3 className="text-lg font-semibold text-slate-50">
              KVKK, audit trail, SLA, uptime ve özel destek
            </h3>
            <ul className="mt-2 space-y-1 text-[11px] text-slate-200">
              <li>• Dosyalar Türkiye/EU bölgesinde kalır, log’lar denetlenebilir.</li>
              <li>• Hücre bazlı audit trail ve izlenebilirlik.</li>
              <li>• SLA + uptime taahhütleri ve özel destek hattı.</li>
              <li>• Aylık 10.000+ belge için özel fiyatlandırma.</li>
            </ul>
          </div>
          <a
            href="mailto:sales@botexcel.com?subject=Kurumsal%20Plan%20Talebi"
            className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Kurumsal teklif al
          </a>
        </div>
      </div>
    </section>
  );
}
