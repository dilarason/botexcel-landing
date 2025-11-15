"use client";

import { ArrowLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND ?? "").replace(/\/$/, "");
const LOGIN_API = BASE_URL ? `${BASE_URL}/api/login` : "/api/login";

type Status = {
  type: "success" | "error";
  message: string;
} | null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!email || !password) {
      setStatus({
        type: "error",
        message: "Lütfen e-posta ve şifrenizi girin.",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            data?.message ||
            "Giriş yapılamadı, bilgilerinizi kontrol edin ve tekrar deneyin.",
        });
        return;
      }

      if (data?.access_token) {
        try {
          localStorage.setItem("botexcel_token", data.access_token);
        } catch {
          //
        }
      }

      setStatus({
        type: "success",
        message: "Giriş başarılı, anasayfaya yönlendiriliyorsunuz...",
      });
      setTimeout(() => router.replace("/"), 700);
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Sunucuya bağlanırken bir hata oluştu, lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="hover:text-emerald-300 transition-colors">
            Ana sayfaya dön
          </Link>
        </div>

        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
            BotExcel hesabına giriş yap
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-200">
            Veri karmaşasından tablo netliğine, kaldığın yerden devam et.
          </h1>
          <p className="mx-auto max-w-sm text-xs text-slate-300">
            Hesabınla giriş yap; PDF, görsel fiş ve ekstrelerini birkaç dakikada
            Excel tablolarına dönüştürmeye devam et.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-6 shadow-xl shadow-emerald-500/5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <Mail className="h-4 w-4 text-emerald-400" />
                E-posta adresi
              </label>
              <input
                id="login-email"
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
                htmlFor="login-password"
                className="flex items-center justify-between text-xs font-medium text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  Şifre
                </span>
                <button
                  type="button"
                  className="text-[11px] font-normal text-emerald-300 hover:text-emerald-200"
                >
                  Şifremi unuttum
                </button>
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/70"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                Beni hatırla
              </label>
              <span className="text-[11px] text-slate-400">
                Deneme planı: <span className="text-emerald-300">Free (3 dosya/ay)</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </button>

            {status && (
              <p
                className={`text-[11px] ${
                  status.type === "error" ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Henüz hesabın yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Kayıt ol
            </Link>
          </p>
        </section>

        <p className="text-center text-[10px] text-slate-500">
          Giriş yaparak BotExcel kullanım şartlarını ve KVKK aydınlatma metnini
          kabul etmiş olursun.
        </p>
      </div>
    </main>
  );
}
