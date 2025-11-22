"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageBar } from "./UsageBar";

type PlanKey = "starter" | "pro" | "business";

const PLAN_OPTIONS: { key: PlanKey; label: string; desc: string; limit: string }[] = [
  {
    key: "starter",
    label: "Starter",
    desc: "Ayda 20 belgeye kadar dengeli kullanım.",
    limit: "20 belge/ay",
  },
  {
    key: "pro",
    label: "Pro",
    desc: "Ayda 60 belge, daha hızlı dönüşüm ve şablonlar.",
    limit: "60 belge/ay",
  },
  {
    key: "business",
    label: "Business",
    desc: "Ayda 200 belge, ekipler için öncelikli destek.",
    limit: "200 belge/ay",
  },
];

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  email?: string;
  plan?: string;
  usageCount?: number;
  limit: number | null;
  onUpgraded?: () => void;
};

export function UpgradeModal({
  open,
  onClose,
  email,
  plan,
  usageCount,
  limit,
  onUpgraded,
}: UpgradeModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanKey>("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  const currentPlan = (plan || "free").toLowerCase();

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data.error) {
        throw new Error(
          data?.message || data?.error || "Plan yükseltme sırasında hata oluştu.",
        );
      }
      setSuccess(data?.message || "Planın güncellendi.");
      onUpgraded?.();
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 800);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Beklenmeyen bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterprise = () => {
    onClose();
    router.push("/kurumsal-teklif");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              Planını Yükselt
            </p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-50">
              Daha fazla belge için yeni haklar aç.
            </h2>
            {email && (
              <p className="text-xs text-neutral-400">{email}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white"
          >
            Kapat
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-neutral-900/60 p-4 text-xs text-neutral-200">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="uppercase tracking-[0.18em] text-neutral-400">Plan</span>
            <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              {currentPlan}
            </span>
          </div>
          <UsageBar used={usageCount ?? 0} limit={limit} plan={currentPlan} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {PLAN_OPTIONS.map((opt) => {
            const active = selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelected(opt.key)}
                className={`flex flex-col gap-1 rounded-xl border p-3 text-left text-sm transition ${
                  active
                    ? "border-emerald-400/80 bg-emerald-500/10"
                    : "border-white/10 bg-neutral-900/70 hover:border-emerald-300/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-neutral-300">{opt.limit}</span>
                </div>
                <p className="text-xs text-neutral-300">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-3 text-sm text-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Kurumsal mı?
              </p>
              <p className="text-xs text-neutral-300">
                Sınırsız kullanım, SLA ve entegrasyon için bize ulaş.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEnterprise}
              className="rounded-lg border border-emerald-400/60 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10"
            >
              Özel teklif al
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
        )}
        {success && (
          <p className="mt-3 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">{success}</p>
        )}

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleUpgrade}
            className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Güncelleniyor..." : "Planı güncelle"}
          </button>
        </div>
      </div>
    </div>
  );
}
