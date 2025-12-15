"use client";

import { useEffect, useState } from "react";
import { getApiBase } from "../lib/api";
import { isRecord } from "../lib/typeguards";

export type RecentJob = {
  id?: string;
  file_name?: string;
  file_type?: string;
  created_at?: string;
  status?: string;
  download_url?: string;
};

type RecentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; items: RecentJob[] }
  | { status: "error"; error: string };

export function useRecentJobs(limit: number = 10, enabled: boolean = true): RecentState {
  const [state, setState] = useState<RecentState>(() => (enabled ? { status: "loading" } : { status: "idle" }));

  useEffect(() => {
    let cancelled = false;

    if (enabled) {
      const fetchRecent = async () => {
        setState({ status: "loading" });
        try {
          const url = new URL(`${getApiBase()}/recent.json`);
          url.searchParams.set("limit", String(limit));
          url.searchParams.set("user", "me");
          url.searchParams.set("order", "desc");

          const res = await fetch(url.toString(), {
            credentials: "include",
          });

          if (!res.ok) {
            if (!cancelled) {
              setState({ status: "error", error: `HTTP ${res.status}` });
            }
            return;
          }

          const data = await res.json().catch(() => null);
          if (cancelled) return;

          const items: RecentJob[] = Array.isArray(data)
            ? data
            : isRecord(data) && Array.isArray(data.items)
              ? data.items
              : [];

          setState({ status: "loaded", items });
        } catch {
          if (!cancelled) {
            setState({ status: "error", error: "recent.json isteği başarısız." });
          }
        }
      };

      fetchRecent();
    }

    return () => {
      cancelled = true;
    };
  }, [limit, enabled]);

  if (!enabled) {
    return { status: "idle" };
  }

  return state;
}
