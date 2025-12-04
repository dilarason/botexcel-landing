"use client";

import React from "react";
import { useAuth } from "./providers/AuthProvider";

export function AuthAwareCTA() {
  const { isLoading, isAuthenticated, user } = useAuth();

  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold px-4 py-2.5 transition";

  if (isLoading) {
    return (
      <button
        className={`${baseClasses} bg-slate-800 text-slate-300 cursor-default opacity-70`}
        disabled
      >
        Durum kontrol ediliyor...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <a
        href="/upload"
        className={`${baseClasses} bg-emerald-500 text-slate-950 hover:bg-emerald-400`}
        data-analytics="authaware_cta_authenticated"
      >
        Belgemle Devam Et
        {user?.plan ? (
          <span className="ml-2 text-[11px] font-normal text-emerald-950/80 bg-emerald-200/80 rounded-full px-2 py-0.5">
            Plan: {user.plan}
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
        data-analytics="authaware_cta_guest"
      >
        Hemen Başla
      </a>
    );
  }
