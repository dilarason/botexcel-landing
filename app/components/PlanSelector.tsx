"use client";

import React, { useState } from "react";

type PlanName = "free" | "pro" | "business" | "enterprise";

type PlanInfo = {
  id: PlanName;
  label: string;
  description: string;
  highlight?: boolean;
};

const PLANS: PlanInfo[] = [
  {
    id: "free",
    label: "Free",
    description: "Ayda 3 belge. KDV, e-arşiv, temel fatura denemeleri için.",
  },
  {
    id: "pro",
    label: "Pro",
    description: "KOBİ/muhasebe: düzenli fatura, stok ve KDV çıkarmaları.",
    highlight: true,
  },
  {
    id: "business",
    label: "Business",
    description: "Ekipler için yüksek hacim; bordro, irsaliye, büyük PDF setleri.",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Sınırsız; özel entegrasyon, SLA ve denetim/audit gereksinimleri.",
  },
];

export interface PlanSelectorProps {
  currentPlan: PlanName;
  limit?: number | null;
  usageCount?: number | null;
  onPlanChanged?: (plan: PlanName) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  currentPlan,
  limit,
  usageCount,
  onPlanChanged,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanName>(currentPlan);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const usageText = (() => {
    if (typeof usageCount !== "number" || usageCount < 0) {
      return null;
    }
    if (limit == null) {
      return `${usageCount} belge işlendi (limitsiz plan).`;
    }
    return `${usageCount} / ${limit} belge bu ay işledin.`;
  })();

  const handleSelect = async (plan: PlanName) => {
    setMessage(null);
    setError(null);

    if (plan === currentPlan) {
      setSelectedPlan(plan);
      setMessage("Zaten bu plandasın.");
      return;
    }

    setSelectedPlan(plan);
    setLoading(true);
    try {
      const resp = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await resp.json().catch(() => ({} as Record<string, unknown>));

      if (!resp.ok || (data && (data.error || data.code === "error"))) {
        const msg =
          (data && (data.message || data.error)) ||
          "Plan güncelleme başarısız oldu.";
        setError(msg);
        return;
      }

      const newPlan: PlanName =
        (data && data.plan && String(data.plan).toLowerCase()) || plan;

      setSelectedPlan(newPlan);
      setMessage(
        `Planın '${newPlan.toUpperCase()}' olarak güncellendi. Yeni limitin hemen geçerli.`
      );

      if (typeof onPlanChanged === "function") {
        onPlanChanged(newPlan);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Plan güncelleme sırasında beklenmeyen bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border border-neutral-800/60 bg-neutral-950/70 p-4 md:p-5 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400">
            Planın
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-300">
              {currentPlan.toUpperCase()}
            </span>
            {usageText && (
              <span className="text-xs text-neutral-400">{usageText}</span>
            )}
          </div>
        </div>
        {loading && (
          <div className="text-xs text-emerald-300 animate-pulse">
            Plan güncelleniyor...
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
        {PLANS.map((p) => {
          const isCurrent = p.id === currentPlan;
          const isSelected = p.id === selectedPlan;
          const isDisabled =
            p.id === "free" && currentPlan !== "free"; // Free'e geri dönüşü belki ileride açarız.

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => !isDisabled && handleSelect(p.id)}
              disabled={loading || isDisabled}
              className={[
                "group relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                isSelected
                  ? "border-emerald-500/80 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-emerald-500/60 hover:bg-neutral-900/60",
                isDisabled ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-50">
                  {p.label}
                </span>
                {p.highlight && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                    Önerilen
                  </span>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-neutral-700/60 px-2 py-0.5 text-[10px] text-neutral-100">
                    Şu anki planın
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">{p.description}</p>

              {isSelected && !isCurrent && (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                  Seçildi, kaydetmek için birkaç saniye bekle...
                </span>
              )}
              {isDisabled && (
                <span className="mt-1 inline-flex items-center rounded-full bg-neutral-800/60 px-2 py-0.5 text-[10px] text-neutral-300">
                  Free&apos;e dönüş için bize yaz.
                </span>
              )}
            </button>
          );
        })}
      </div>

      {(message || error) && (
        <div className="text-xs">
          {message && (
            <p className="text-emerald-300">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default PlanSelector;
