"use client";

import React, { useEffect, useState } from "react";
import { UsageBar } from "./UsageBar";
import { UpgradeModal } from "./UpgradeModal";

const PLAN_LIMITS: Record<string, number | null> = {
  free: 3,
  starter: 20,
  pro: 60,
  business: 200,
  enterprise: null,
};

function inferLimit(plan: string | undefined | null): number | null {
  const key = (plan || "free").toLowerCase();
  return PLAN_LIMITS.hasOwnProperty(key) ? PLAN_LIMITS[key] : PLAN_LIMITS.free;
}

type WhoAmIResponse = {
  authenticated: boolean;
  email?: string;
  plan?: string;
  usage?: {
    count?: number;
    month?: string;
    limit?: number | null;
  };
};

export function UploadHeader() {
  const [who, setWho] = useState<WhoAmIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/whoami", { cache: "no-store" });
      const data = (await resp.json()) as WhoAmIResponse;
      setWho(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Kullanıcı bilgisi alınamadı.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const plan = (who?.plan || "free").toLowerCase();
  const limit =
    typeof who?.usage?.limit === "number" ? who?.usage?.limit : inferLimit(plan);
  const used = who?.usage?.count ?? undefined;

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
      {!loading && error && (
        <p className="text-xs text-red-300">{error}</p>
      )}
      {!loading && !error && <UsageBar used={used} limit={limit} plan={plan} />}

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        email={who?.email}
        plan={plan}
        usageCount={used}
        limit={limit}
        onUpgraded={reload}
      />
    </header>
  );
}
