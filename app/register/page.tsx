/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
import Link from "next/link";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
  business: "Business",
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  const planParam = searchParams?.plan;
  const planSlugRaw =
    typeof planParam === "string" ? planParam.toLowerCase() : undefined;
  const planSlug =
    planSlugRaw && PLAN_LABELS[planSlugRaw] ? planSlugRaw : "free";
  const planLabel = PLAN_LABELS[planSlug] ?? "Free";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            BotExcel hesabı oluştur
          </h1>
          <p className="text-sm text-slate-400">
            Belgelerini Excel&apos;e otomatik aktarmak için birkaç saniyede kayıt ol.
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            Seçilen plan: <span className="font-medium">{planLabel}</span>
          </p>
        </header>

        <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <input type="hidden" name="plan" value={planSlug} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              E-posta
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="ornek@firma.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="En az 8 karakter"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Kayıt ol
          </button>

          <p className="mt-2 text-center text-xs text-slate-500">
            Zaten hesabın var mı?{' '}
            <Link
              href={
                planSlug
                  ? `/login?plan=${encodeURIComponent(planSlug)}`
                  : "/login"
              }
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Giriş yap
            </Link>
          </p>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Şu an sadece arayüz hazırlanıyor. Kayıt olduğunda seçtiğin plan
          backend'e gönderilecek; plan limitleri ve faturalama orada devreye
          girecek.
        </p>
      </div>
    </main>
  );
}
