import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

import { mockUser, purchasePlans } from "../lib/plans";

export const metadata = {
  title: "Satın Al | BotExcel",
  description:
    "BotExcel planınızı seçin ve belgelerinizi dakikalar içinde Excel'e dönüştürmeye başlayın.",
};


export default function PurchasePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-20 text-slate-50">
      <div className="w-full max-w-5xl space-y-10">
        <header className="space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Satın Alma
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-200">
            BotExcel ile PDF → Excel dönüşümünü dakikalar içinde otomatikleştir
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300">
            Giriş yaptın ve verilerin güvende. Artık Plus planı 299 ₺/ay, Pro planı 799 ₺/ay&rsquo;dan başlıyor; Business planı ise tamamen sana özel tasarlanıyor.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-5 text-sm text-slate-200">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Giriş yapan kullanıcı</p>
              <p className="text-base font-semibold text-slate-50">{mockUser.name}</p>
              <p className="text-xs text-slate-400">{mockUser.email}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
              Aktif plan: {mockUser.currentPlan}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {purchasePlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col gap-3 rounded-2xl border p-5 ${
                plan.highlight
                  ? "border-emerald-400 bg-emerald-950/40"
                  : "border-slate-800 bg-slate-900/70"
              }`}
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{plan.name}</h2>
                <p className="text-sm text-emerald-300">{plan.price}</p>
                <p className="text-xs text-slate-400">{plan.limit}</p>
              </div>
              <p className="text-xs text-slate-300">{plan.description}</p>
              <ul className="space-y-2 text-xs text-slate-200">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              {plan.contact ? (
                <a
                  href={plan.href}
                  className="mt-auto inline-flex items-center justify-center rounded-full border border-emerald-400 px-3 py-1.5 text-xs font-medium text-emerald-100 transition hover:bg-emerald-400 hover:text-emerald-900"
                >
                  <Mail className="mr-1.5 h-4 w-4" />
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  className={`mt-auto inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    plan.highlight
                      ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                      : "border border-slate-700 text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-slate-100">Soruların mı var?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Satın alma sürecinde destek ekibimizle konuşmak istersen{" "}
            <a
              href="mailto:sales@botexcel.com"
              className="text-emerald-300 transition hover:text-emerald-200"
            >
              sales@botexcel.com
            </a>{" "}
            adresine hemen yazabilirsin.
          </p>
        </section>
      </div>
    </main>
  );
}
