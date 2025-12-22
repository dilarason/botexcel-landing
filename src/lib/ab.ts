"use client";

const KEY = "bx_ab_v1_output_quality";

export type Variant = "A" | "B";

export function getVariant(): Variant {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "A" || v === "B") return v;
    const n: Variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(KEY, n);
    return n;
  } catch {
    return "A";
  }
}
