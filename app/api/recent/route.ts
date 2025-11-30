import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "../_lib/apiBase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const API_BASE = getApiBase();
  if (!API_BASE) {
    return NextResponse.json(
      {
        ok: false,
        code: "server_error",
        message: "Sunucu yapılandırması eksik (BOTEXCEL_API_BASE).",
        details: {},
      },
      { status: 500 },
    );
  }

  const url = new URL(`${API_BASE}/recent.json`);

  // İstemciden gelen query parametrelerini upstream'e aktar
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const upstream = await fetch(url.toString(), {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      redirect: "manual",
    });

    const text = await upstream.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { raw: text };
    }

    if (typeof parsed === "string") {
      return new NextResponse(parsed, {
        status: upstream.status,
        headers: {
          "content-type":
            upstream.headers.get("content-type") ||
            "application/json; charset=utf-8",
        },
      });
    }

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        code: "server_error",
        message: "recent.json okunamadı.",
        details: { error: message },
      },
      { status: 502 },
    );
  }
}

