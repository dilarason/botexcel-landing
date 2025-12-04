"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  email: string;
  plan?: string;
};

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchWhoAmI = async () => {
      try {
        const res = await fetch("/api/whoami", { credentials: "include", cache: "no-store" });

        if (!res.ok) {
          if (!cancelled) {
            setState({ isLoading: false, isAuthenticated: false, user: null });
          }
          return;
        }

        const payload = await res.json().catch(() => ({}));
        const user = payload?.data?.user ?? payload?.data;
        if (cancelled) return;

        if (payload?.ok && (payload?.data?.authenticated || user?.email)) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            user: { email: user.email, plan: user.plan },
          });
        } else {
          setState({ isLoading: false, isAuthenticated: false, user: null });
        }
      } catch (error) {
        if (!cancelled) {
          // network/5xx is treated as guest; avoid noisy logs beyond a single debug message
          console.debug("whoami failed, treating as guest");
          setState({ isLoading: false, isAuthenticated: false, user: null });
        }
      }
    };

    fetchWhoAmI();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
