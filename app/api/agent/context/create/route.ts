import { NextResponse } from "next/server";
import { getServerEnv } from "@/src/lib/serverEnv";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { BOTEXCEL_API_BASE, BOTEXCEL_API_TOKEN } = getServerEnv();
  const body = await req.text();

  const upstream = await fetch(`${BOTEXCEL_API_BASE}/api/agent/context/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${BOTEXCEL_API_TOKEN}`,
    },
    body,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: "Upstream error", status: upstream.status, detail: text },
      { status: upstream.status || 502 },
    );
  }

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data ?? { ok: true });
}
