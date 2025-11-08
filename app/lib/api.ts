export function getApiBase(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_API_BASE || "").trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    return "https://api.botexcel.pro";
  }
  return "http://127.0.0.1:5000";
}
