import React, { useMemo, useState } from "react";
import { getApiBase } from "../lib/api";
import { landingPlans } from "../lib/plans";

type RegisterPageProps = {
  searchParams?: { plan?: string | string[] };
};

const RegisterForm: React.FC<{ planSlug: string }> = ({ planSlug }) => {

  const selectedPlan = useMemo(
    () =>
      landingPlans.find(
        (plan) => plan.slug === planSlug.toLowerCase()
      ) ?? landingPlans[0],
    [planSlug]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setError(null);

    try {
      const res = await fetch(`${getApiBase()}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          plan: selectedPlan.slug,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setState("error");
        setError(data.error || "Kayıt başarısız. Tekrar dene.");
        return;
      }

      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("signup_succeeded", {
          props: { email, plan: selectedPlan.slug },
        });
      }

      setState("success");
      setTimeout(() => {
        window.location.href = "/app";
      }, 800);
    } catch (e) {
      setState("error");
      setError("Sunucuya ulaşılamadı. Birazdan tekrar dene.");
    }
  };

  const disabled = state === "loading";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">BotExcel’e kaydol</h1>
        <p className="mb-1 text-xs text-slate-400">Seçtiğin plan:</p>
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
          <div className="text-[12px] font-semibold text-slate-50">
            {selectedPlan.name} · {selectedPlan.price}
          </div>
          <p className="text-slate-400">{selectedPlan.limit}</p>
          <p className="mt-1 text-[11px]">{selectedPlan.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200">
              E-posta adresi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
              placeholder="ornek@firma.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
              placeholder="En az 6 karakter"
            />
          </div>

          {state === "error" && error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          {state === "success" && (
            <p className="text-xs text-emerald-400">
              Kayıt başarılı. Yönlendiriliyorsun…
            </p>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {state === "loading" ? "Kaydediliyor..." : "Ücretsiz hesap aç"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Zaten hesabın var mı?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Giriş yap
          </a>
        </p>
      </div>
    </main>
  );
};

"use client";

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const planSlug =
    typeof searchParams?.plan === "string"
      ? searchParams.plan
      : "free";
  return <RegisterForm planSlug={planSlug} />;
}
