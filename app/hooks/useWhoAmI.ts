"use client";

import { useEffect, useState } from "react";

type WhoAmIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; email: string; plan?: string; usage?: { count?: number; limit?: number | null } }
  | { status: "error"; error: string };

export function useWhoAmI(refreshToken = 0): WhoAmIState {
  const [state, setState] = useState<WhoAmIState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;

    const fetchWhoAmI = async () => {
      setState({ status: "loading" });
      try {
        const res = await fetch(`/api/whoami`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled) {
            setState({ status: "anonymous" });
          }
          return;
        }

        const payload = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (payload?.ok && payload?.data?.authenticated) {
          setState({
            status: "authenticated",
            email: payload.data.email,
            plan: payload.data.plan,
            usage: {
              count: payload.data.usage_count ?? payload.data.usage?.count,
              limit:
                payload.data.limit ??
                payload.data.usage?.limit ??
                payload.data.plan_limit ??
                null,
            },
          });
        } else {
          setState({ status: "anonymous" });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", error: "WhoAmI isteği başarısız." });
        }
      }
    };

    fetchWhoAmI();

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return state;
}
