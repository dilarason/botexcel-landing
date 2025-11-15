"use client";

import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND ?? "").replace(/\/$/, "");
const REGISTER_API = BASE_URL ? `${BASE_URL}/api/register` : "/api/register";

type Status = {
  type: "success" | "error";
  message: string;
} | null;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!termsAccepted) {
      setStatus({
        type: "error",
        message: "KVKK metnini kabul etmelisiniz.",
      });
      return;
    }

    if (password !== passwordConfirm) {
      setStatus({
        type: "error",
        message: "Şifreler eşleşmeli.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          plan: "free",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data?.message || "Kayıt alınamadı, bilgileri kontrol edin.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Sunucuya bağlanamadı, tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-50">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="hover:text-emerald-300 transition-colors">
            Ana sayfaya dön
          </Link>
        </div>

        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
            BotExcel’e kayıt ol
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-200">
            PDF, görsel fiş ve ekstrelerden otomatik Excel tablolara geç.
          </h1>
          <p className="mx-auto max-w-md text-xs text-slate-300">
            Free plan ile başlayabilir, daha sonra Plus veya Pro plana geçerek
            aylık dosya limitinizi ve AI özelliklerinizi artırabilirsiniz.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-6 shadow-xl shadow-emerald-500/5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="register-name"
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <User className="h-4 w-4 text-emerald-400" />
                Ad Soyad / Ekip adı
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/70"
                placeholder="Örn. Aylin Yılmaz veya Finans Ekibi"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="register-email"
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <Mail className="h-4 w-4 text-emerald-400" />
                İş e-posta adresi
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/70"
                placeholder="ornek@firma.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <Lock className="h-4 w-4 text-emerald-400" />
                Şifre
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/70"
                placeholder="En az 8 karakter"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-passwordConfirm"
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <Lock className="h-4 w-4 text-emerald-400" />
                Şifre (tekrar)
              </label>
              <input
                id="register-passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/70"
                placeholder="Şifreni tekrar gir"
              />
            </div>

            <div className="md:col-span-2 space-y-3 pt-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-[11px] text-slate-300">
                  <input
                    id="register-terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    className="h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  KVKK metnini ve kullanım şartlarını okudum, kabul ediyorum.
                </label>
                <p className="text-[11px] text-slate-400">
                  Başlangıç planı:{" "}
                  <span className="text-emerald-300">Free (3 dosya/ay)</span>. Dilediğin zaman Plus veya Pro’ya geçebilirsin.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {loading ? "Kaydediliyor..." : "Hesap oluştur"}
              </button>
            </div>

            {status && (
              <div className="md:col-span-2">
                <p
                  className={`text-[11px] ${
                    status.type === "error" ? "text-rose-300" : "text-emerald-300"
                  }`}
                >
                  {status.message}
                </p>
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Zaten hesabın var mı?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Giriş yap
            </Link>
          </p>
        </section>

        <p className="text-center text-[10px] text-slate-500">
          BotExcel, verilerinizi KVKK uyumlu şekilde işler. Detaylar için
          güvenlik &amp; KVKK sayfamıza göz atabilirsiniz.
        </p>
      </div>
    </main>
  );
}
