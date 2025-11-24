"use client";

import { useState } from "react";

type CustomOfferFormState = {
  email: string;
  company: string;
  monthlyVolume: string;
  message: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function CustomOfferForm() {
  const [form, setForm] = useState<CustomOfferFormState>({
    email: "",
    company: "",
    monthlyVolume: "",
    message: "",
  });

  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const disabled = status === "submitting" || status === "success";

  const handleChange = (field: keyof CustomOfferFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setStatus("error");
      setErrorMsg("Lütfen e-posta adresinizi girin.");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/custom-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          monthlyVolume: form.monthlyVolume.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });

      const data = (await resp.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      const raw = data as { [key: string]: unknown };
      const hasError = Boolean((raw as { error?: unknown }).error);

      if (!resp.ok || hasError) {
        setStatus("error");
        setErrorMsg(
          (typeof raw.message === "string"
            ? raw.message
            : undefined) ||
            "Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
        return;
      }

      setStatus("success");
      setForm((prev) => ({
        ...prev,
        company: "",
        monthlyVolume: "",
        message: "",
      }));
    } catch (err) {
      console.error("custom-offer submit error:", err);
      setStatus("error");
      setErrorMsg("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-xl rounded-2xl border border-neutral-800/60 bg-neutral-950/60 p-6 backdrop-blur-md shadow-lg space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">
        İhtiyacına göre <span className="text-emerald-400">özel teklif</span> al
      </h3>
      <p className="text-sm text-neutral-400">
        Kurumsal hacim, ekip kullanımı veya entegrasyon ihtiyacın varsa formu
        doldur, sana uygun paketi birlikte kuralım.
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-200">
          E-posta <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/70"
          placeholder="sen@şirketin.com"
          value={form.email}
          onChange={handleChange("email")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-200">
          Şirket / Marka
        </label>
        <input
          type="text"
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/70"
          placeholder="Örn: BotExcel Dijital"
          value={form.company}
          onChange={handleChange("company")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-200">
          Aylık tahmini belge sayısı
        </label>
        <input
          type="number"
          min={0}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/70"
          placeholder="Örn: 200"
          value={form.monthlyVolume}
          onChange={handleChange("monthlyVolume")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-200">
          Notlar / İhtiyaç tarifi
        </label>
        <textarea
          rows={3}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/70 resize-none"
          placeholder="Örn: ERP/Logo entegrasyonu, farklı departman kullanıcıları, özel SLA vb."
          value={form.message}
          onChange={handleChange("message")}
          disabled={disabled}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400">
          {errorMsg}
        </p>
      )}

      {status === "success" && (
        <p className="text-sm text-emerald-400">
          Talebin alındı. İhtiyacına göre paket önerisiyle en kısa sürede dönüş
          yapacağız.
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-black bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {status === "submitting" ? "Gönderiliyor..." : "Özel teklif iste"}
      </button>

      <p className="text-[11px] leading-snug text-neutral-500">
        Bu formu göndererek yalnızca BotExcel ürününe yönelik ticari iletişim
        almayı kabul etmiş olursun. Spam yok, sadece ürünle ilgili net cevaplar.
      </p>
    </form>
  );
}
