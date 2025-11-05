import Link from "next/link";

export const metadata = {
  title: "Kayıt Ol | BotExcel",
  description:
    "BotExcel'e kaydolun, PDF ve görselleri saniyeler içinde Excel tablolarına dönüştürün.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-8 shadow-lg shadow-emerald-500/10">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-200">
            BotExcel’e kayıt ol
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            AI destekli dönüşüm motoru ile belgelerinden saniyeler içinde Excel
            dosyaları üret.
          </p>
        </header>

        <form className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">Ad Soyad</span>
            <input
              type="text"
              required
              placeholder="Örnek Kullanıcı"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>

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
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              required
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40"
            />
            <span>
              Kullanım koşullarını ve KVKK metnini okudum, kabul ediyorum.
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="text-emerald-300 transition hover:text-emerald-200"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </main>
  );
}
