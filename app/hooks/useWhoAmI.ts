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

        if (payload?.ok && (payload?.data?.authenticated || payload?.data?.user)) {
          const user = payload.data.user ?? payload.data;
          setState({
            status: "authenticated",
            email: user.email,
            plan: user.plan,
            usage: {
              count:
                user.usage_count ??
                user.usage?.count ??
                user.usage_count ??
                payload.data?.usage?.count,
              limit:
                user.limit ??
                user.usage?.limit ??
                user.plan_limit ??
                payload.data?.usage?.limit ??
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
