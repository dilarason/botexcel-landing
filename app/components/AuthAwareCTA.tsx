"use client";

import React, { useEffect, useState } from "react";

type WhoAmIResponse = {
  ok: boolean;
  authenticated: boolean;
  email?: string;
  plan?: string;
};

type AuthStatus = "loading" | "guest" | "user";

export function AuthAwareCTA() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [plan, setPlan] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch("/api/whoami", {
          credentials: "include",
        });
        const data: WhoAmIResponse = await res.json().catch(() => ({
          ok: false,
          authenticated: false,
        }));

        if (cancelled) return;

        if (data.ok && data.authenticated) {
          setStatus("user");
          setPlan(data.plan);
        } else {
          setStatus("guest");
        }
      } catch {
        if (!cancelled) setStatus("guest");
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold px-4 py-2.5 transition";

  if (status === "loading") {
    return (
      <button
        className={`${baseClasses} bg-slate-800 text-slate-300 cursor-default opacity-70`}
        disabled
      >
        Durum kontrol ediliyor...
      </button>
    );
  }

  if (status === "user") {
    return (
      <a
        href="/upload"
        className={`${baseClasses} bg-emerald-500 text-slate-950 hover:bg-emerald-400`}
      >
        Belgemle Devam Et
        {plan ? (
          <span className="ml-2 text-[11px] font-normal text-emerald-950/80 bg-emerald-200/80 rounded-full px-2 py-0.5">
            Plan: {plan}
          </span>
        ) : null}
      </a>
    );
  }

  // guest
  return (
    <a
      href="/register"
      className={`${baseClasses} bg-emerald-500 text-slate-950 hover:bg-emerald-400`}
    >
      Hemen Başla
    </a>
  );
}
