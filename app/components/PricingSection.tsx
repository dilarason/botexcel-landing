"use client";

import React, { useState } from "react";
import Link from "next/link";

type SpecialOfferFormState = {
  name: string;
  email: string;
  company: string;
  volume: string;
  message: string;
};

const initialForm: SpecialOfferFormState = {
  name: "",
  email: "",
  company: "",
  volume: "",
  message: "",
};

export const PricingSection: React.FC = () => {
  const [offerOpen, setOfferOpen] = useState(false);
  const [form, setForm] = useState<SpecialOfferFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    setSubmitError(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        monthly_document_volume: form.volume
          ? Number.isFinite(Number(form.volume))
            ? Number(form.volume)
            : form.volume
          : undefined,
        message: form.message || undefined,
      };

      const resp = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data.error) {
        throw new Error(
          data.message || data.error || "Talep gönderilirken bir hata oluştu.",
        );
      }

      setSubmitMsg(
        data.message ||
          "Talebin alındı, en kısa sürede seninle iletişime geçeceğiz.",
      );
      setForm(initialForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Form gönderilirken beklenmeyen bir hata oluştu.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openOffer = () => {
    setOfferOpen(true);
    setSubmitMsg(null);
    setSubmitError(null);
  };

  const closeOffer = () => {
    setOfferOpen(false);
  };

  return (
    <section
      id="pricing"
      className="border-t border-white/5 bg-neutral-950/90 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
            Planını seç, veri karmaşasını geride bırak.
          </h2>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            İlk 3 dönüşüm ücretsiz. Daha fazlası için Starter, Pro veya Business
            planla kotaları büyütebilir, gerekirse ekip boyutuna özel teklif
            oluşturabiliriz.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-neutral-950/80 p-4 shadow-lg shadow-emerald-500/20">
            <h3 className="text-sm font-semibold text-neutral-50">Free</h3>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              0₺
              <span className="ml-1 text-xs font-normal text-neutral-400">
                /ay
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Ayda 3 belgeye kadar dene. Tek kişilik hızlı testler için ideal.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-neutral-300">
              <li>• Ayda 3 belge dönüşümü</li>
              <li>• PDF / görsel / Excel desteği</li>
              <li>• Temel dashboard</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
              >
                Ücretsiz başla
              </Link>
            </div>
          </div>

          {/* Starter */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold text-neutral-50">Starter</h3>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              149₺
              <span className="ml-1 text-xs font-normal text-neutral-400">
                /ay
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Düzenli ama düşük hacimli kullanım için; küçük işletmeler ve
              freelancer&apos;lar.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-neutral-300">
              <li>• Ayda 20 belgeye kadar</li>
              <li>• Standart dönüşüm hızı</li>
              <li>• Gelişmiş dashboard şablonları</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/upload"
                className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-400/60 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/10"
              >
                Starter ile devam et
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold text-neutral-50">Pro</h3>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              249₺
              <span className="ml-1 text-xs font-normal text-neutral-400">
                /ay
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Freelancer&apos;lar ve küçük ekipler için. Fatura, rapor ve stok
              takibini otomatikleştir.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-neutral-300">
              <li>• Ayda 60 belgeye kadar</li>
              <li>• Hızlı öncelikli dönüşüm kuyruğu</li>
              <li>• Gelişmiş Excel dashboard şablonları</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/upload"
                className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-white"
              >
                Pro ile devam et
              </Link>
            </div>
          </div>

          {/* Business */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold text-neutral-50">Business</h3>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              Takım bazlı
              <span className="ml-1 text-xs font-normal text-neutral-400">
                teklif
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Muhasebe, operasyon veya satış ekipleri için çok kullanıcılı
              kullanım ve geniş kota.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-neutral-300">
              <li>• 5+ kullanıcı desteği</li>
              <li>• Ayda 200 belgeye kadar</li>
              <li>• Öncelikli destek & onboarding</li>
            </ul>
            <div className="mt-4">
              <button
                type="button"
                onClick={openOffer}
                className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-400/60 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/10"
              >
                Özel teklif al
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold text-neutral-50">
              Enterprise
            </h3>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              Sınırsız
              <span className="ml-1 text-xs font-normal text-neutral-400">
                kurumsal
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Çok departmanlı ekipler, özel entegrasyonlar ve SLA isteyenler
              için.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-neutral-300">
              <li>• Sınırsız belge işleme</li>
              <li>• Özel entegrasyon & API</li>
              <li>• Kurumsal SLA ve destek</li>
            </ul>
            <div className="mt-4">
              <button
                type="button"
                onClick={openOffer}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-neutral-100 hover:bg-neutral-900"
              >
                Özel teklif al
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ÖZEL TEKLİF FORMU MODALI */}
      {offerOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-950/95 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-neutral-50">
                  Özel teklif iste
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  İş hacmini, ekip boyutunu ve temel kullanım senaryonu
                  yaz; sana uygun Business/Enterprise teklifini hazırlayalım.
                </p>
              </div>
              <button
                type="button"
                onClick={closeOffer}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300">
                    Ad Soyad
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300">
                  Şirket / Marka adı
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300">
                  Aylık yaklaşık belge sayısı
                </label>
                <input
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="Örn: 500 fatura / 200 irsaliye"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300">
                  Kısaca kullanım senaryon
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Örn: 3 kişilik muhasebe ekibi; haftalık PDF faturaları ve Excel raporlarını BotExcel ile otomatikleştirmek istiyoruz."
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-1"
                />
              </div>

              {submitError && (
                <p className="text-sm text-rose-300">{submitError}</p>
              )}
              {submitMsg && (
                <p className="text-sm text-emerald-300">{submitMsg}</p>
              )}

              <div className="mt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeOffer}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-900"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {submitting ? "Gönderiliyor..." : "Teklif iste"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
