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
      { status: 500 }
    );
  }

  // Backend currently exposes /whoami (no /api prefix) on api.botexcel.pro
  const url = `${API_BASE}/whoami`;
  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      redirect: "manual",
    });

    const text = await upstream.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    const contentType =
      upstream.headers.get("content-type") ||
      (typeof parsed === "string"
        ? "text/plain; charset=utf-8"
        : "application/json; charset=utf-8");

    const res =
      typeof parsed === "string"
        ? new NextResponse(parsed, {
            status: upstream.status,
            headers: { "content-type": contentType },
          })
        : NextResponse.json(parsed ?? {}, { status: upstream.status });

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        code: "server_error",
        message: "Profil alınamadı.",
        details: { error: message },
      },
      { status: 502 }
    );
  }
}
