import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.BOTEXCEL_API_BASE || "";
  const base = raw.replace(/\/+$/, "");
  const token = process.env.BOTEXCEL_API_TOKEN || "";

  return NextResponse.json({
    ok: true,
    BOTEXCEL_API_BASE_raw: raw,
    BOTEXCEL_API_BASE_normalized: base,
    node_env: process.env.NODE_ENV,
    has_token: Boolean(token),
  });
}
