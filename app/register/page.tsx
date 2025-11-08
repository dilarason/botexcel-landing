"use client";

import React, { useState, FormEvent, useEffect } from "react";

import { getApiBase } from "../lib/api";
import { getPersistedSource } from "../lib/source";

type FormState = "idle" | "submitting" | "success" | "error";

const track = (eventName: string, props?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.plausible !== "function") return;
  const source = getPersistedSource();
  const finalProps = {
    ...(props || {}),
    ...(source || {}),
  };
  w.plausible(eventName, Object.keys(finalProps).length ? { props: finalProps } : undefined);
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "success") return;
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/app";
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setError(null);
    track("signup_started", { form: "register_page" });

    try {
      const res = await fetch(`${getApiBase()}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error || data?.message || "Kayıt işlemi başarısız.";
        setError(message);
        setState("error");
        track("signup_failed", { form: "register_page", status: res.status });
        return;
      }

      setState("success");
      track("signup_succeeded", { form: "register_page" });
    } catch (err) {
      setError("Sunucuya ulaşılamadı, lütfen tekrar dene.");
      setState("error");
      track("signup_failed", { form: "register_page", status: "network_error" });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
        <div>
          <h1 className="text-xl font-semibold text-white">BotExcel'e ücretsiz kayıt ol</h1>
          <p className="mt-1 text-xs text-slate-400">
            Demo çıktısını beğendiysen, sınırsız kullanım için birkaç saniyede hesap oluştur.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-300">
              E-posta
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Şifre
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          {state === "success" && (
            <p className="text-xs text-emerald-400">
              Hesabın oluşturuldu. Yönlendirme için e-postanı ve gelen kutunu kontrol et.
            </p>
          )}
          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {state === "submitting" ? "Kaydediliyor..." : "Ücretsiz hesap aç"}
          </button>
        </form>
      </div>
    </main>
  );
}
