"use client";

import React from "react";

type UsageBarProps = {
  used?: number | null;
  limit: number | null;
  plan: string;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  business: "Business",
  enterprise: "Enterprise",
};

export function UsageBar({ used, limit, plan }: UsageBarProps) {
  const safeUsed = typeof used === "number" && used >= 0 ? used : 0;
  const label = PLAN_LABELS[plan?.toLowerCase()] || (plan || "Unknown");

  if (limit === null) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-neutral-300">
          <span>Kullanım</span>
          <span className="font-semibold text-emerald-200">Sınırsız</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-800">
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        </div>
        <p className="text-[11px] text-neutral-400">Plan: {label}</p>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((safeUsed / Math.max(limit, 1)) * 100));
  const nearLimit = pct >= 80;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-neutral-300">
        <span>Kullanım</span>
        <span className="font-semibold text-neutral-100">
          {safeUsed} / {limit} belge
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            nearLimit
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
              : "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>Plan: {label}</span>
        <span>%{pct}</span>
      </div>
      {nearLimit && (
        <p className="text-[11px] text-amber-300">
          Limite yaklaştın, daha yüksek plana geçebilirsin.
        </p>
      )}
    </div>
  );
}
