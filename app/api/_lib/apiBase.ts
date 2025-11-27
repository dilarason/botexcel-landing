const fallbackBase = "https://api.botexcel.pro";

export function getApiBase(): string {
  const raw =
    process.env.BOTEXCEL_API_BASE ||
    process.env.NEXT_PUBLIC_BACKEND ||
    fallbackBase;

  return raw.replace(/\/+$/, "") || fallbackBase;
}
