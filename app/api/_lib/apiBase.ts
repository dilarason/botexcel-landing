// Local dev default: proxy on 8000. Production should always set BOTEXCEL_API_BASE explicitly.
const fallbackBase = "http://127.0.0.1:8000";

export function getApiBase(): string {
  const raw =
    process.env.BOTEXCEL_API_BASE ||
    process.env.NEXT_PUBLIC_BACKEND ||
    fallbackBase;

  return raw.replace(/\/+$/, "") || fallbackBase;
}
