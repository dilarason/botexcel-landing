"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  error?: boolean;
  code?: string;
  message?: string;
  access_token?: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse | null = null;
      try {
        data = (await res.json()) as LoginResponse;
      } catch {
        data = null;
      }

      if (!res.ok || !data || data.error) {
        const msg =
          data?.message ||
          (res.status === 401
            ? "E-posta veya şifre hatalı."
            : "Giriş sırasında bir hata oluştu.");
        setErrorMsg(msg);
        return;
      }

      if (data.access_token) {
        try {
          localStorage.setItem("botexcel_token", data.access_token);
        } catch {
          // ignore storage issues
        }
      }

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/60 border border-slate-700 rounded-2xl shadow-xl p-8 backdrop-blur-md">
      <h1 className="text-2xl font-semibold text-slate-50 mb-2">
        BotExcel hesabına giriş yap
      </h1>
      <p className="text-sm text-slate-300 mb-6">
        Dönüşümlerini, geçmiş tablolarını ve ayarlarını tek yerden yönet.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-200"
          >
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            placeholder="sen@şirketin.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-200"
          >
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400">
        Henüz hesabın yok mu?{' '}
        <a
          href="/register"
          className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
        >
          Kayıt ol
        </a>
      </p>
    </div>
  );
}
