"use client";

import React, { useMemo, useState } from "react";
import { getApiBase } from "../lib/api";
import { landingPlans } from "../lib/plans";

type LoginPageProps = {
  searchParams?: { plan?: string | string[] };
};

const LoginForm: React.FC<{ planSlug?: string }> = ({ planSlug }) => {
const selectedPlan = useMemo(() => {
    if (!planSlug) return null;
    return (
      landingPlans.find(
        (plan) => plan.slug === planSlug.toLowerCase()
      ) ?? null
    );
  }, [planSlug]);

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
      const res = await fetch(`${getApiBase()}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          plan: selectedPlan?.slug,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setState("error");
        setError(data.error || "Giriş başarısız. Email veya şifre hatalı.");
        return;
      }

      setState("success");

      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("login_succeeded", {
          props: { email, plan: selectedPlan?.slug },
        });
      }

      setTimeout(() => {
        window.location.href = "/app";
      }, 500);
    } catch (e) {
      setState("error");
      setError("Sunucuya ulaşılamadı. Birazdan tekrar dene.");
    }
  };

  const disabled = state === "loading";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">Giriş yap</h1>
        {selectedPlan ? (
          <p className="mb-6 text-xs text-emerald-300">
            {selectedPlan.name} planını seçmiştin; giriş yapıp hemen kullanmaya
            başlayabilirsin.
          </p>
        ) : (
          <p className="mb-6 text-xs text-slate-400">
            BotExcel hesabınla kaldığın yerden devam et.
          </p>
        )}

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
              placeholder="Şifren"
            />
          </div>

          {state === "error" && error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          {state === "success" && (
            <p className="text-xs text-emerald-400">
              Giriş başarılı. Yönlendiriliyorsun…
            </p>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {state === "loading" ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Henüz hesabın yok mu?{" "}
          <a href="/register" className="text-emerald-400 hover:underline">
            Ücretsiz hesap aç
          </a>
        </p>
      </div>
    </main>
  );
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const planSlug =
    typeof searchParams?.plan === "string" ? searchParams.plan : undefined;
  return <LoginForm planSlug={planSlug} />;
}
