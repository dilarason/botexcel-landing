"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/providers/AuthProvider";

export type PlanId = "free" | "pro" | "business" | "enterprise" | string;

export interface PlanInfo {
  plan_id: PlanId;
  plan_name: string;
  monthly_limit: number;
  used_this_month: number;
  renews_at: string;
}

interface UsePlanResult {
  isLoading: boolean;
  error: Error | null;
  planInfo: PlanInfo | null;
  remaining: number;
  isLimitedOut: boolean;
}

export function usePlan(): UsePlanResult {
  const { isAuthenticated } = useAuth();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated) {
      setPlanInfo(null);
      setIsLoading(false);
      setError(null);
      return () => {
        cancelled = true;
      };
    }

    const fetchPlan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/plan", { credentials: "include", cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setError(new Error(`Plan request failed (${res.status})`));
            setPlanInfo(null);
          }
          return;
        }
        const data = (await res.json().catch(() => ({}))) as PlanInfo | { data?: PlanInfo };
        if (cancelled) return;
        const info = (data as { data?: PlanInfo })?.data ?? (data as PlanInfo);
        setPlanInfo(info ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setPlanInfo(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPlan();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const derived = useMemo(() => {
    if (!planInfo) {
      return { remaining: 0, isLimitedOut: false };
    }
    const remaining = Math.max(0, (planInfo.monthly_limit ?? 0) - (planInfo.used_this_month ?? 0));
    return { remaining, isLimitedOut: remaining <= 0 };
  }, [planInfo]);

  return {
    isLoading,
    error,
    planInfo,
    remaining: derived.remaining,
    isLimitedOut: derived.isLimitedOut,
  };
}
