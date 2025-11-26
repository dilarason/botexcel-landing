import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://www.botexcel.pro";

export async function GET(req: NextRequest) {
  const url = `${API_BASE.replace(/\/$/, "")}/api/whoami`;

  try {
    const cookieHeader = req.headers.get("cookie");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const upstream = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const payload = await upstream.json().catch(() => ({}));
    const ok = payload?.ok === true;
    const normalized = ok
      ? { ok: true, data: payload.data ?? payload }
      : {
          ok: false,
          code: payload?.code || "server_error",
          message: payload?.message || "Profil alınamadı.",
          details: payload?.details || {},
        };

    const res = NextResponse.json(normalized, { status: upstream.status });

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, code: "server_error", message: `Upstream error: ${message}`, details: {} },
      { status: 502 }
    );
  }
}
