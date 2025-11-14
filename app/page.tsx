"use client";

import React, { useState } from "react";
import { AuthDialog } from "./components/AuthDialog";

type AuthMode = "login" | "register";

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-emerald-400/90" />
            <span className="text-sm font-semibold tracking-tight">BotExcel</span>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => openAuth("login")}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => openAuth("register")}
              className="rounded-full bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow hover:bg-emerald-300"
            >
              Kayıt Ol
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-24">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-300/80">
              Veri dönüşümünde ikinci bahar
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              Fatura, sözleşme, fotoğraf, CSV… hepsini dakikalar içinde anlamlı Excel
              tablolara çevirin.
            </h1>
            <p className="text-sm text-slate-300">
              BotExcel belgeleri sadece Excel'e dönüştürmekle kalmaz; yapay zekâ ile
              belgenizi anlar, doğrular ve paylaşılabilir hale getirir.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openAuth("register")}
                className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-300"
              >
                Ücretsiz Dene
              </button>
              <button className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-900/60">
                Örnek çıktıyı gör
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="h-48 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
          </div>
        </section>

        {/* Placeholder: mevcut long-form bölümleri buraya konulmalı */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          {/* Detaylı içerik burada yer alacak. Şu an placeholder. */}
          <p>Mevcut landing içeriğin bu alanda kalacak.</p>
        </section>
      </main>

      <AuthDialog open={authOpen} mode={authMode} onClose={closeAuth} />
    </div>
  );
}
TSX
