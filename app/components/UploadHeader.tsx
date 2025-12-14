"use client";

import React, { useState } from "react";
import { UsageBar } from "@/components/UsageBar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useWhoAmI } from "@/hooks/useWhoAmI";

const PLAN_LIMITS: Record<string, number | null> = {
  free: 3,
  pro: 200,
  business: 2000,
  enterprise: null,
};

function inferLimit(plan: string | undefined | null): number | null {
  const key = (plan || "free").toLowerCase();
  return PLAN_LIMITS.hasOwnProperty(key) ? PLAN_LIMITS[key] : PLAN_LIMITS.free;
}

type UploadHeaderProps = {
  refreshToken?: number;
  upgradeRequested?: boolean;
  onUpgradeHandled?: () => void;
  onPlanUpgraded?: () => void;
};

export function UploadHeader({
  refreshToken = 0,
  upgradeRequested = false,
  onUpgradeHandled,
  onPlanUpgraded,
}: UploadHeaderProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);
  const who = useWhoAmI(refreshToken + localRefresh);
  const isOpen = upgradeRequested || upgradeOpen;

  const loading = who.status === "idle" || who.status === "loading";
  const hasError = who.status === "error";
  const authenticated = who.status === "authenticated";
  const plan = authenticated ? (who.plan || "free") : "free";
  const limit =
    authenticated && typeof who.usage?.limit !== "undefined"
      ? who.usage?.limit ?? null
      : inferLimit(plan);
  const used = authenticated ? who.usage?.count : undefined;
  const email = authenticated ? who.email : undefined;

  return (
    <header className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/80">
            Canlı Dönüşüm
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-50 sm:text-2xl">
            Belgelerini yükle, Excel çıktısını indir.
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            PDF, görüntü, doküman veya CSV; BotExcel alanları tanır ve temiz bir Excel dosyası üretir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUpgradeOpen(true)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
          >
            Planını yükselt
          </button>
          <span className="rounded-xl border border-white/10 px-3 py-1 text-xs text-neutral-300">
            Plan: <strong className="font-semibold uppercase">{plan}</strong>
          </span>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-neutral-400">Kullanım bilgilerin yükleniyor...</p>
      )}
      {!loading && hasError && (
        <p className="text-xs text-red-300">Kullanıcı bilgisi alınamadı.</p>
      )}
      {!loading && !hasError && <UsageBar used={used} limit={limit} plan={plan} />}

      <UpgradeModal
        open={isOpen}
        onClose={() => {
          setUpgradeOpen(false);
          onUpgradeHandled?.();
        }}
        email={email}
        plan={plan}
        usageCount={used}
        limit={limit}
        onUpgraded={() => {
          onPlanUpgraded?.();
          setUpgradeOpen(false);
          onUpgradeHandled?.();
          setLocalRefresh((n) => n + 1);
        }}
      />
    </header>
  );
}
