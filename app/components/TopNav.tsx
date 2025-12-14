import Link from "next/link";

const navLinks = [
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/ozellikler", label: "Özellikler" },
  { href: "/guvenlik", label: "Güvenlik" },
  { href: "/agent", label: "Agent" },
  { href: "/kullanicilar", label: "Kullanıcılar" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-slate-50">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/70 bg-emerald-500/10 text-[12px] font-black tracking-tight text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            Bx
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">BotExcel</span>
            <span className="text-[11px] text-slate-400">Veri → Excel</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 text-xs font-medium text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 transition hover:bg-slate-800/80 hover:text-emerald-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-emerald-400/80 bg-emerald-500/15 px-3 py-1.5 font-semibold text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400/30"
          >
            Hemen Başla
          </Link>
        </div>
      </div>
    </header>
  );
}
