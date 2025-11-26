import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://api.botexcel.pro";

export async function POST(req: NextRequest) {
  const url = `${API_BASE.replace(/\/$/, "")}/api/convert`;
  try {
    const headers = new Headers();
    const cookie = req.headers.get("cookie");
    if (cookie) headers.set("Cookie", cookie);
    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    const upstream = await fetch(url, {
      method: "POST",
      body: req.body,
      headers,
      redirect: "manual",
    });

    const contentTypeResp = upstream.headers.get("content-type") || "";
    if (!contentTypeResp.includes("application/json")) {
      // Fallback for non-JSON errors
      const text = await upstream.text();
      return NextResponse.json(
        {
          ok: false,
          code: "server_error",
          message: text || "Beklenmeyen yanıt alındı.",
          details: {},
        },
        { status: upstream.status }
      );
    }

    const payload = await upstream.json().catch(() => ({}));
    const ok = payload?.ok === true;
    const normalized = ok
      ? { ok: true, data: payload.data ?? payload }
      : {
          ok: false,
          code: payload?.code || "server_error",
          message: payload?.message || payload?.error || "Dönüşüm sırasında hata oluştu.",
          details: payload?.details || {},
        };

    const res = NextResponse.json(normalized, { status: upstream.status });
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) res.headers.set("set-cookie", setCookie);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, code: "server_error", message: `Upstream error: ${message}`, details: {} },
      { status: 502 }
    );
  }
}
