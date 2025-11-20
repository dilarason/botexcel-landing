import React from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">Giriş yap</h1>
        <p className="mb-6 text-xs text-slate-400">
          BotExcel hesabınla kaldığın yerden devam et.
        </p>

        <LoginForm />

        <p className="mt-4 text-xs text-slate-400">
          Henüz hesabın yok mu?{" "}
          <a href="/register" className="text-emerald-400 hover:underline">
            Ücretsiz hesap aç
          </a>
        </p>
      </div>
    </main>
  );
}
