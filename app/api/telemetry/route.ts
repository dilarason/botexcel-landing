import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";

export const runtime = "nodejs";

type ABVariant = "A" | "B";

type TelemetryPayload = {
  event: string;
  variant: ABVariant;
  path: string;
  ref: string;
  ts: string;
  anon_id: string;
  session_id: string;
  meta: Record<string, unknown>;
};

const ALLOW_EVENTS = new Set([
  "output_quality_download_sample",
  "output_quality_try_own_doc",
  "clarity_cta_try_own_doc",
  "view_output_quality",
  "visit_upload",
]);

function telemetryLogEnabled(): boolean {
  return String(process.env.TELEMETRY_LOG || "") === "1";
}

type Bucket = { windowStart: number; count: number };
const g = globalThis as unknown as { __telemetryBuckets?: Map<string, Bucket> };
if (!g.__telemetryBuckets) g.__telemetryBuckets = new Map();
const buckets = g.__telemetryBuckets;

function getIP(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimitOK(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const limit = 100;

  const b = buckets.get(ip);
  if (!b || now - b.windowStart > windowMs) {
    buckets.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  buckets.set(ip, b);
  return true;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isVariant(v: unknown): v is ABVariant {
  return v === "A" || v === "B";
}

function validateBody(
  x: unknown
): { ok: true; data: TelemetryPayload } | { ok: false; error: string } {
  if (!x || typeof x !== "object") return { ok: false, error: "Invalid JSON body" };

  const body = x as Record<string, unknown>;
  const event = body.event;
  const variant = body.variant;
  const path = body.path;
  const ref = body.ref;
  const ts = body.ts;
  const anon_id = body.anon_id;
  const session_id = body.session_id;
  const meta = body.meta;

  if (!isNonEmptyString(event) || !ALLOW_EVENTS.has(event)) return { ok: false, error: "Invalid event name" };
  if (!isVariant(variant)) return { ok: false, error: "Invalid variant" };
  if (!isNonEmptyString(path)) return { ok: false, error: "Invalid path" };
  if (typeof ref !== "string") return { ok: false, error: "Invalid ref" };
  if (!isNonEmptyString(ts)) return { ok: false, error: "Invalid ts" };
  if (!isNonEmptyString(anon_id)) return { ok: false, error: "Invalid anon_id" };
  if (!isNonEmptyString(session_id)) return { ok: false, error: "Invalid session_id" };
  if (!meta || typeof meta !== "object") return { ok: false, error: "Invalid meta" };

  return {
    ok: true,
    data: {
      event,
      variant,
      path,
      ref: typeof ref === "string" ? ref : "",
      ts,
      anon_id,
      session_id,
      meta: meta as Record<string, unknown>,
    },
  };
}

export async function POST(req: Request) {
  const ip = getIP(req);
  if (!rateLimitOK(ip)) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const v = validateBody(json);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  if (telemetryLogEnabled()) {
    const line = JSON.stringify({ ...v.data, ip }) + "\n";
    process.stdout.write(line);

    const file = process.env.TELEMETRY_FILE;
    if (file) {
      try {
        await appendFile(file, line, { encoding: "utf-8" });
      } catch {
        // logging failure must not break endpoint
      }
    }
  }

  return NextResponse.json({ ok: true });
}
