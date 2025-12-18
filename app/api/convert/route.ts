import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.BOTEXCEL_API_BASE || "http://127.0.0.1:8000";
const IS_PROD = process.env.NODE_ENV === "production";

export async function POST(req: NextRequest) {
  // Auth: önce client Authorization, sonra HttpOnly cookie
  const incomingAuth = req.headers.get("authorization");
  const cookieHeader = req.headers.get("cookie") || "";
  const m = cookieHeader.match(/(?:^|;\s*)botexcel_access_token=([^;]+)/);
  const tokenFromCookie = !incomingAuth && m ? decodeURIComponent(m[1]) : null;
  const authHeader = incomingAuth || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : undefined);

  // Upstream candidates
  const candidates = [
    `${API_BASE}/api/convert`,
    `${API_BASE}/convert`,
  ];

  let lastErr: any = null;

  for (const url of candidates) {
    try {
      const headers = new Headers();
      if (authHeader) headers.set("Authorization", authHeader);
      if (cookieHeader) headers.set("Cookie", cookieHeader);

      // Content-Type'ı aynen forward et (multipart/form-data boundary dahil)
      const contentType = req.headers.get("content-type");
      if (contentType) headers.set("Content-Type", contentType);

      // Request body'yi stream olarak forward et
      // @ts-expect-error: duplex is required for streaming request body
      const upstream = await fetch(url, {
        method: "POST",
        body: req.body,
        headers,
        redirect: "manual",
        duplex: "half",
      });

      // 404 ise sonraki candidate'ı dene
      if (upstream.status === 404) {
        lastErr = { url, status: 404 };
        continue;
      }

      const contentTypeResp = upstream.headers.get("content-type") || "";

      // Non-JSON response
      if (!contentTypeResp.includes("application/json")) {
        const text = await upstream.text();
        return NextResponse.json(
          {
            ok: false,
            code: "bad_upstream_response",
            message: text || "Beklenmeyen yanıt alındı.",
            details: { upstream: url },
          },
          { status: upstream.status >= 400 ? upstream.status : 502 }
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

      // Set-Cookie forward
      const setCookie = upstream.headers.get("set-cookie");
      if (setCookie) res.headers.set("set-cookie", setCookie);

      return res;
    } catch (err) {
      lastErr = { url, error: err instanceof Error ? err.message : String(err) };
      continue;
    }
  }

  // Tüm candidate'lar başarısız
  return NextResponse.json(
    {
      ok: false,
      code: "upstream_unreachable",
      message: "Convert endpoint'ine ulaşılamadı.",
      details: { api_base: API_BASE, last: lastErr },
    },
    { status: 502 }
  );
}
