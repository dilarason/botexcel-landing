import { NextResponse } from "next/server";

const API_BASE = process.env.BOTEXCEL_API_BASE || "http://127.0.0.1:8000";
const IS_PROD = process.env.NODE_ENV === "production";

// Tokenı tek yerden yakala (hybrid response’lara tolerans)
function pickAccessToken(data: any): string | null {
  if (!data) return null;
  return (
    data.access_token ??
    data?.data?.access_token ??
    data?.data?.data?.access_token ??
    null
  );
}

function jsonError(status: number, code: string, message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, code, message, details: details ?? {} }, { status });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "bad_request", "Geçersiz JSON body.");
  }

  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "").trim();
  if (!email || !password) {
    return jsonError(400, "bad_request", "email ve password zorunlu.");
  }

  const payload = JSON.stringify({ email, password });

  // backend farklı path’lerde olabilir: sırayla dene
  const candidates: Array<{ url: string; method: "POST" | "GET"; body?: string }> = [
    { url: `${API_BASE}/api/login`, method: "POST", body: payload },
    { url: `${API_BASE}/login`, method: "POST", body: payload },
    { url: `${API_BASE}/dev/autologin`, method: "GET" },
  ];

  let lastErr: unknown = null;

  for (const c of candidates) {
    try {
      const r = await fetch(c.url, {
        method: c.method,
        headers: c.method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body: c.method === "POST" ? c.body : undefined,
      });

      const text = await r.text().catch(() => "");
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      if (r.status === 401 || r.status === 403) {
        return jsonError(401, "invalid_credentials", "Giriş başarısız.", {
          upstream: c.url,
          upstream_status: r.status,
          upstream_body: text.slice(0, 300),
        });
      }

      if (!r.ok) {
        lastErr = new Error(`Upstream ${c.url} -> ${r.status}`);
        continue;
      }

      const token = pickAccessToken(data);
      if (!token) {
        // login 200 ama token yoksa: backend kontratı farklıdır
        return jsonError(502, "bad_upstream_response", "Login başarılı görünüyor ama access_token bulunamadı.", {
          upstream: c.url,
          upstream_body: data,
        });
      }

      // ✅ Kritik fix: token’ı HttpOnly cookie olarak set et
      const resp = NextResponse.json({ ok: true, access_token: token, data });

      resp.cookies.set({
        name: "botexcel_access_token",
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: IS_PROD,
        path: "/",
        // dev’de de çalışsın diye kısa ama kalıcı bir süre veriyoruz
        maxAge: 60 * 60 * 24 * 7, // 7 gün
      });

      return resp;
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  console.error("[api/login] All upstream candidates failed:", lastErr);
  return jsonError(502, "upstream_unreachable", "Backend login endpoint'ine ulaşılamadı.", {
    api_base: API_BASE,
    last_error: String((lastErr as any)?.message ?? lastErr ?? ""),
  });
}
