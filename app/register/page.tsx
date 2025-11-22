"use client";

import { useState } from "react";

const PLANS = [
  { value: "free", label: "Ücretsiz • ayda 3 belge" },
  { value: "pro", label: "Pro • yoğun kullanım için" },
  { value: "business", label: "Business • ekipler için" },
];

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:5000";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, plan }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data.ok === false || data.error) {
        setError(
          data.error ||
            data.message ||
            "Kayıt sırasında bir hata oluştu. Lütfen tekrar dene."
        );
        return;
      }

      const chosenPlan = data.plan || plan;
      setSuccess(
        data.message ||
          `Kayıt tamamlandı. Planın: ${chosenPlan}. Yönlendiriliyorsun...`
      );

      if (typeof window !== "undefined") {
        const win = window as typeof window & {
          plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
        };
        if (typeof win.plausible === "function") {
          win.plausible("signup_succeeded", {
            props: { plan: chosenPlan },
          });
        }
      }

      setTimeout(() => {
        window.location.href = "/upload";
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      setError(message || "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          BotExcel’e kayıt ol
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Planını seç, PDF’lerini akıllı Excel panellerine çevirelim.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              E-posta adresi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              placeholder="ornek@firma.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              placeholder="En az 8 karakter"
            />
            <p className="mt-1 text-xs text-slate-500">
              En az bir büyük harf, bir küçük harf ve bir rakam içermeli.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Planını seç
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            >
              {PLANS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              İstersen önce free ile başla, sonra Pro/Business’a geçebilirsin.
            </p>
          </div>

          {error && (
            <div className="text-xs rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="text-xs rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {loading ? "Kayıt oluyor..." : "Kayıt ol ve devam et"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Zaten hesabın var mı?{" "}
          <a
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
          >
            Giriş yap
          </a>
        </p>
      </div>
    </main>
  );
}
