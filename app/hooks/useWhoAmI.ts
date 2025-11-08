"use client";

import { useEffect, useState } from "react";
import { getApiBase } from "../lib/api";

type WhoAmIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; email: string }
  | { status: "error"; error: string };

export function useWhoAmI(): WhoAmIState {
  const [state, setState] = useState<WhoAmIState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;

    const fetchWhoAmI = async () => {
      setState({ status: "loading" });
      try {
        const res = await fetch(`${getApiBase()}/whoami`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (!cancelled) {
            setState({ status: "anonymous" });
          }
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (data && data.ok && data.email) {
          setState({ status: "authenticated", email: data.email });
        } else {
          setState({ status: "anonymous" });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ status: "error", error: "WhoAmI isteği başarısız." });
        }
      }
    };

    fetchWhoAmI();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
