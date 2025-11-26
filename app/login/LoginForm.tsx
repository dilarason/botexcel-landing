"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { fetchWithTimeout } from "../lib/http";
import { mapErrorCodeToMessage } from "../lib/errorMessages";

type RequestState = "idle" | "loading" | "error" | "success";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setError(null);

    try {
      const res = await fetchWithTimeout("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!data?.ok) {
        setState("error");
        setError(mapErrorCodeToMessage(data?.code, data?.message));
        return;
      }

      setState("success");

      if (typeof window !== "undefined") {
        const win = window as typeof window & {
          plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
        };
        if (typeof win.plausible === "function") {
          win.plausible("login_succeeded", {
            props: { hash: btoa(email).slice(0, 8) },
          });
        }
      }

      setTimeout(() => router.push("/upload"), 400);
    } catch {
      setState("error");
      setError("Sunucuya ulaşılamadı. Birazdan tekrar dene.");
    }
  };

  const disabled = state === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-200" htmlFor="login-email">
          E-posta adresi
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
          placeholder="ornek@firma.com"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-200" htmlFor="login-password">
          Şifre
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
          placeholder="Şifren"
        />
      </div>

      {state === "error" && error && <p className="text-xs text-rose-400">{error}</p>}

      {state === "success" && (
        <p className="text-xs text-emerald-400">Giriş başarılı. Yönlendiriliyorsun…</p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="mt-2 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {state === "loading" ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
