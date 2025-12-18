import { NextResponse } from "next/server";

const API_BASE = process.env.BOTEXCEL_API_BASE || "http://127.0.0.1:8000";

function jsonOk(data: any) {
  return NextResponse.json({ ok: true, data });
}

function jsonErr(status: number, code: string, message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, code, message, details: details ?? {} }, { status });
}

async function fetchWhoami(authHeader?: string) {
  const candidates = [`${API_BASE}/api/whoami`, `${API_BASE}/whoami`];

  let last: any = null;
  for (const url of candidates) {
    try {
      const r = await fetch(url, {
        method: "GET",
        headers: authHeader ? { Authorization: authHeader } : undefined,
      });
      const text = await r.text().catch(() => "");
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }
      if (!r.ok) {
        last = { url, status: r.status, data };
        continue;
      }
      return { ok: true as const, url, data };
    } catch (e) {
      last = { url, error: String((e as any)?.message ?? e) };
    }
  }
  return { ok: false as const, last };
}

export async function GET(req: Request) {
  // 1) Öncelik: client Authorization gönderirse onu kullan
  const incomingAuth = req.headers.get("authorization");

  // 2) Yoksa: login’in yazdığı HttpOnly cookie’den token al
  const cookieHeader = req.headers.get("cookie") || "";
  const m = cookieHeader.match(/(?:^|;\s*)botexcel_access_token=([^;]+)/);
  const token = !incomingAuth && m ? decodeURIComponent(m[1]) : null;

  const auth = incomingAuth || (token ? `Bearer ${token}` : undefined);

  const res = await fetchWhoami(auth);

  if (!res.ok) {
    // token yoksa guest dönmek mantıklı (502 yerine)
    if (!auth) return jsonOk({ authenticated: false });

    return jsonErr(502, "upstream_unreachable", "Whoami upstream hatası.", {
      api_base: API_BASE,
      last: res.last,
    });
  }

  // Backend farklı şekillerde dönebilir; normalize et
  const d = res.data;
  const authenticated = Boolean(
    d?.authenticated ??
      d?.data?.authenticated ??
      (d?.ok === true && d?.authenticated === true) ??
      false
  );

  // authenticated true ise backend’in payload’ını da koru
  if (authenticated) return jsonOk({ authenticated: true, upstream: d });

  return jsonOk({ authenticated: false });
}
