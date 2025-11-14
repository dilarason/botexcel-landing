import Link from "next/link";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
  business: "Business",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { plan?: string | string[] | undefined };
}) {
  const planParam = searchParams?.plan;
  const planSlug =
    typeof planParam === "string" ? planParam.toLowerCase() : undefined;

  const planLabel =
    planSlug && PLAN_LABELS[planSlug]
      ? PLAN_LABELS[planSlug]
      : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            BotExcel hesabına giriş
          </h1>
          <p className="text-sm text-slate-400">
            Belgelerini otomatik olarak Excel'e çevir, audit trail ve AI
            etiketleme ile takip et.
          </p>
          {planLabel && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              Seçili plan: <span className="font-medium">{planLabel}</span>
            </p>
          )}
        </header>

        <form
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Giriş yap
          </button>

          <p className="mt-2 text-center text-xs text-slate-500">
            Hesabın yok mu?{' '}
            <Link
              href={
                planSlug
                  ? `/register?plan=${encodeURIComponent(planSlug)}`
                  : "/register"
              }
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Kayıt ol
            </Link>
          </p>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Bu ekran şimdilik sadece arayüzdür. Giriş akışını daha sonra kimlik
          doğrulama ve plan atamasıyla backend'e bağlayacağız.
        </p>
      </div>
    </main>
  );
}
