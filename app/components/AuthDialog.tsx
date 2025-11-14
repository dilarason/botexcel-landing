"use client";

import React, { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_BOTEXCEL_API_BASE || "https://api.botexcel.pro";

type Mode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, mode, onClose }) => {
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [mode, open]);

  if (!open) return null;

  const isRegister = activeMode === "register";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Email ve şifre zorunludur.");
      return;
    }

    if (isRegister && password !== password2) {
      setErrorMsg("Şifreler uyuşmuyor.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (isRegister
            ? "Kayıt sırasında bir hata oluştu."
            : "Giriş sırasında bir hata oluştu.");
        setErrorMsg(msg);
        return;
      }

      if (isRegister) {
        setSuccessMsg("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
        setActiveMode("login");
        setPassword("");
        setPassword2("");
        return;
      }

      if (data.access_token) {
        try {
          localStorage.setItem("botexcel_jwt", data.access_token);
        } catch {
          //
        }
      }

      setSuccessMsg("Giriş başarılı. Yönlendiriliyorsunuz...");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl shadow-black/60">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:text-slate-100"
        >
          ESC
        </button>
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300">BotExcel Hesabı</div>
          <h2 className="text-2xl font-semibold text-slate-50">
            {isRegister ? "Hesap Oluştur" : "Giriş Yap"}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister
              ? "Belgeleriniz, geçmiş dönüşümleriniz ve audit log’larınız tek yerde."
              : "Kayıtlı hesapla giriş yap ve tüm dönüşümlerine ulaş."}
          </p>
        </div>

        <div className="mt-4 flex gap-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => setActiveMode("login")}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              activeMode === "login"
                ? "bg-slate-800 text-white"
                : "hover:bg-slate-800/70"
            }`}
          >
            Giriş
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("register")}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              activeMode === "register"
                ? "bg-slate-800 text-white"
                : "hover:bg-slate-800/70"
            }`}
          >
            Kayıt
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-xs text-slate-400">
            <label>E-posta adresi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              placeholder="finans@firma.com"
            />
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <label>Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              placeholder="••••••••"
            />
          </div>
          {isRegister && (
            <div className="space-y-1 text-xs text-slate-400">
              <label>Şifre (tekrar)</label>
              <input
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                placeholder="••••••••"
              />
            </div>
          )}
          {errorMsg && (
            <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {successMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading
              ? isRegister
                ? "Kayıt yapılıyor..."
                : "Giriş yapılıyor..."
              : isRegister
              ? "Kayıt Ol"
              : "Giriş Yap"}
          </button>
          {!isRegister && (
            <p className="text-[11px] text-slate-400 text-center">
              Henüz hesabın yok mu?{" "}
              <button
                type="button"
                onClick={() => setActiveMode("register")}
                className="text-emerald-300 underline-offset-2 hover:underline"
              >
                Hesap oluştur
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
