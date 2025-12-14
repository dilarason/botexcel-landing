import { NextResponse } from "next/server";
import { getServerEnv } from "@/src/lib/serverEnv";

export const runtime = "nodejs"; // edge değil; stream + local network için daha stabil

export async function POST(req: Request) {
  const { BOTEXCEL_API_BASE, BOTEXCEL_API_TOKEN } = getServerEnv();

  const body = await req.text();

  const upstream = await fetch(`${BOTEXCEL_API_BASE}/api/chat/stream`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${BOTEXCEL_API_TOKEN}`,
    },
    body,
  });

  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `Upstream error ${upstream.status}`, detail: t },
      { status: 502 },
    );
  }

  // SSE + stream
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive",
    },
  });
}
