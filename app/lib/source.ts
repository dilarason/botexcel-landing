"use client";

const SOURCE_KEY = "botexcel_source";

export type TrafficSource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ref?: string;
};

export function readSourceFromUrl(): TrafficSource | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const result: TrafficSource = {};

  const setIf = (key: keyof TrafficSource, param: string) => {
    const value = url.searchParams.get(param);
    if (value) {
      result[key] = value;
    }
  };

  setIf("utm_source", "utm_source");
  setIf("utm_medium", "utm_medium");
  setIf("utm_campaign", "utm_campaign");
  setIf("ref", "ref");

  return Object.keys(result).length > 0 ? result : null;
}

export function persistSource(source: TrafficSource) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SOURCE_KEY, JSON.stringify(source));
  } catch {
    // storage erişilemezse sessiz kal
  }
}

export function getPersistedSource(): TrafficSource | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SOURCE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrafficSource;
  } catch {
    return null;
  }
}
