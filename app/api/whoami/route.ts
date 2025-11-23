import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.BOTEXCEL_API_BASE || "").trim() || "https://api.botexcel.pro";

export async function GET(req: NextRequest) {
  const url = `${API_BASE.replace(/\/$/, "")}/whoami`;

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

    const payload = await upstream.json().catch(() => ({
      ok: false,
      authenticated: false,
    }));

    const res = NextResponse.json(payload, { status: upstream.status });

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, authenticated: false, error: `Upstream error: ${message}` },
      { status: 502 }
    );
  }
}
