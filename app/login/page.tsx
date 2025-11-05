import Link from "next/link";

export const metadata = {
  title: "Giriş Yap | BotExcel",
  description:
    "BotExcel hesabınıza giriş yapın, belgelerinizi dakikalar içinde Excel'e dönüştürün.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-8 shadow-lg shadow-emerald-500/10">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-200">
            BotExcel hesabına giriş yap
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Belgelerinizi yükleyin, AI destekli Excel çıktısına dakikalar
            içinde ulaşın.
          </p>
        </header>

        <form className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">E-posta adresi</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="ornek@botexcel.com"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">Şifre</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-slate-400">
          <Link
            href="/register"
            className="text-emerald-300 transition hover:text-emerald-200"
          >
            Henüz hesabın yok mu? Kayıt Ol
          </Link>
          <p>
            Şifreni mi unuttun?{" "}
            <a
              href="mailto:support@botexcel.com"
              className="text-emerald-300 transition hover:text-emerald-200"
            >
              support@botexcel.com
            </a>{" "}
            adresine yaz.
          </p>
        </div>
      </div>
    </main>
  );
}
