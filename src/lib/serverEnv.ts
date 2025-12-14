const rawBase = (process.env.BOTEXCEL_API_BASE || "").trim();
const normalizedBase = rawBase.replace(/\/+$/, "");

export function getApiBase() {
  if (!normalizedBase) {
    throw new Error("BOTEXCEL_API_BASE missing");
  }
  return normalizedBase;
}

export function getApiToken() {
  return process.env.BOTEXCEL_API_TOKEN || "";
}

export function getServerEnv() {
  const BOTEXCEL_API_BASE = getApiBase();
  const BOTEXCEL_API_TOKEN = getApiToken();
  return { BOTEXCEL_API_BASE, BOTEXCEL_API_TOKEN };
}
