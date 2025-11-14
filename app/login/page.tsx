import React from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Giriş Yap | BotExcel",
  description:
    "BotExcel hesabına giriş yap ve yapay zekâ destekli Excel otomasyonunu kullan.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 md:gap-16 items-center">
        <section className="hidden md:block">
          <h2 className="text-sm font-semibold tracking-wide text-emerald-400 uppercase mb-3">
            BotExcel · Kontrol paneline dönüş
          </h2>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-4">
            Veri karmaşasından tablo netliğine, kaldığın yerden devam et.
          </h1>
          <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
            Daha önce yüklediğin faturalar, ekstreler ve raporlar hesap
            altında saklanır. Giriş yaptıktan sonra son dönüşümlerini, audit
            loglarını ve Excel çıktılarının tamamını tek ekrandan yönetebilirsin.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Geçmiş dönüşümlerine eriş</li>
            <li>• Aynı şablonla tekrar tekrar Excel üret</li>
            <li>• Audit log ile kim, ne zaman, hangi dosyayı işledi gör</li>
          </ul>
        </section>

        <section>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
