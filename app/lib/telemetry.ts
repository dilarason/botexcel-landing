/* Client-side telemetry helper (no PII). */
export type ABVariant = "A" | "B";

export type TelemetryMeta = Record<string, unknown> & {
  source?: string;
  href?: string;
};

export type TelemetryPayload = {
  event: string;
  variant: ABVariant;
  path: string;
  ref: string;
  ts: string;
  anon_id: string;
  session_id: string;
  meta: TelemetryMeta;
};

function isClient(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function telemetryEnabled(): boolean {
  if (!isClient()) return false;
  return String(process.env.NEXT_PUBLIC_TELEMETRY || "") === "1";
}

export function getAnonId(): string {
  if (!isClient()) return "server";
  const key = "botexcel_anon_id";
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto?.randomUUID
      ? crypto.randomUUID()
      : `anon_${Math.random().toString(16).slice(2)}${Date.now()}`;
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return "anon_storage_blocked";
  }
}

export function getSessionId(): string {
  if (!isClient()) return "server";
  const key = "botexcel_session_id";
  try {
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto?.randomUUID
      ? crypto.randomUUID()
      : `sess_${Math.random().toString(16).slice(2)}${Date.now()}`;
    window.sessionStorage.setItem(key, id);
    return id;
  } catch {
    return "sess_storage_blocked";
  }
}

export function getABVariant(key: string): ABVariant {
  if (!isClient()) return "A";
  const storageKey = `botexcel_ab_${key}`;
  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing === "A" || existing === "B") return existing;
    const v: ABVariant = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(storageKey, v);
    return v;
  } catch {
    return "A";
  }
}

export async function track(
  event: string,
  meta: TelemetryMeta = {},
  opts?: { abKey?: string }
): Promise<void> {
  if (!telemetryEnabled()) return;

  const variant = getABVariant(opts?.abKey || "global");
  const payload: TelemetryPayload = {
    event,
    variant,
    path: window.location?.pathname || "",
    ref: document.referrer || "",
    ts: new Date().toISOString(),
    anon_id: getAnonId(),
    session_id: getSessionId(),
    meta,
  };

  try {
    await fetch("/api/telemetry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // telemetry must never break UX
  }
}
