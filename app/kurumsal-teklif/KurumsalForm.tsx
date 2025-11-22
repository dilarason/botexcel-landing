"use client";

import React, { useState } from "react";

export function KurumsalForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [volume, setVolume] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    setError(null);
    setServerMessage(null);

    if (!name.trim() || !email.trim()) {
      setError("İsim ve e-posta alanı zorunludur.");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          volume,
          message,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data?.ok === false) {
        setError(
          data?.message ||
            "Talebin iletilirken bir hata oluştu. Lütfen daha sonra tekrar dene.",
        );
      } else {
        setServerMessage(
          data?.message ||
            "Talebin alındı. Kısa süre içinde seninle iletişime geçeceğiz.",
        );
        setName("");
        setCompany("");
        setEmail("");
        setVolume("");
        setMessage("");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Beklenmeyen bir hata oluştu.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/80">
          Kurumsal Teklif
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Business &amp; Enterprise için teklif iste.
        </h1>
        <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
          Yüksek hacimli belge işleme, KVKK / uyumluluk, özel entegrasyonlar
          veya ekip kullanımı için BotExcel&apos;i kurumsal olarak kullanmak
          istiyorsan formu doldur; birkaç saat içinde sana dönüş yapalım.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 md:p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400"
            >
              Ad Soyad*
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-400/40 placeholder:text-neutral-500 focus:border-emerald-400 focus:ring-1"
              placeholder="Adını ve soyadını yaz"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="company"
              className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400"
            >
              Şirket / Kurum
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-400/40 placeholder:text-neutral-500 focus:border-emerald-400 focus:ring-1"
              placeholder="Şirket adını yaz (opsiyonel)"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400"
          >
            Kurumsal E-posta*
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-400/40 placeholder:text-neutral-500 focus:border-emerald-400 focus:ring-1"
            placeholder="ornek@firma.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="volume"
            className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400"
          >
            Aylık belge hacmi (tahmini)
          </label>
          <input
            id="volume"
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-400/40 placeholder:text-neutral-500 focus:border-emerald-400 focus:ring-1"
            placeholder="Örn: 500 fatura / ay, 5.000 dekont / ay..."
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400"
          >
            İhtiyacını kısaca anlat
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-400/40 placeholder:text-neutral-500 focus:border-emerald-400 focus:ring-1"
            placeholder="Örn: 3 kişilik finans ekibimiz var, muhasebe sistemi ile entegrasyon istiyoruz..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300"
        >
          {submitting ? "Gönderiliyor..." : "Teklif iste"}
        </button>

        {error && (
          <p className="mt-2 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        {serverMessage && (
          <p className="mt-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            {serverMessage}
          </p>
        )}
      </form>

      <p className="text-[0.75rem] text-neutral-500">
        Formu gönderdiğinde, sağladığın bilgileri yalnızca teklif hazırlamak
        ve seninle iletişime geçmek için kullanacağız.
      </p>
    </section>
  );
}
