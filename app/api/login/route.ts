import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getEnv() {
  const BOTEXCEL_API_BASE = process.env.BOTEXCEL_API_BASE || "http://127.0.0.1:5000";
  const BOTEXCEL_API_TOKEN = process.env.BOTEXCEL_API_TOKEN || "";
  return { BOTEXCEL_API_BASE, BOTEXCEL_API_TOKEN };
}

function copySetCookie(upstream: Response, headers: Headers) {
  // Next/Undici ortamına göre set-cookie birden fazla olabilir.
  const anyHeaders = upstream.headers as any;

  const multi: string[] | undefined =
    typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : undefined;

  if (multi && multi.length) {
    for (const sc of multi) headers.append("set-cookie", sc);
    return;
  }

  const single = upstream.headers.get("set-cookie");
  if (single) headers.set("set-cookie", single);
}

async function tryFetch(
  url: string,
  init: RequestInit,
): Promise<{ res: Response; url: string } | null> {
  try {
    const res = await fetch(url, init);
    return { res, url };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { BOTEXCEL_API_BASE, BOTEXCEL_API_TOKEN } = getEnv();

  const bodyText = await req.text();

  const candidates: Array<{
    url: string;
    method: "POST" | "GET";
    body?: string;
  }> = [
    { url: `${BOTEXCEL_API_BASE}/api/login`, method: "POST", body: bodyText },
    { url: `${BOTEXCEL_API_BASE}/login`, method: "POST", body: bodyText },
    // dev shortcut (varsa): cookie set eden endpoint
    { url: `${BOTEXCEL_API_BASE}/dev/autologin`, method: "GET" },
  ];

  const attempts: Array<{ url: string; ok: boolean; status?: number }> = [];

  for (const c of candidates) {
    const attempt = await tryFetch(c.url, {
      method: c.method,
      headers: {
        "content-type": "application/json",
        ...(BOTEXCEL_API_TOKEN ? { authorization: `Bearer ${BOTEXCEL_API_TOKEN}` } : {}),
      },
      body: c.method === "POST" ? c.body : undefined,
      redirect: "manual",
    });

    if (!attempt) {
      attempts.push({ url: c.url, ok: false });
      continue;
    }

    const { res, url } = attempt;
    attempts.push({ url, ok: res.ok, status: res.status });

    // 404/405 ise sıradakini dene; 5xx ise de sıradakini dene (ama sonunda raporla)
    if (res.status === 404 || res.status === 405 || res.status >= 500) {
      continue;
    }

    // başarılı veya 401/403 gibi "backend cevap veriyor" durumlarında cevabı geri taşı
    const outHeaders = new Headers();
    const ct = res.headers.get("content-type") || "application/json; charset=utf-8";
    outHeaders.set("content-type", ct);
    copySetCookie(res, outHeaders);

    return new Response(res.body, { status: res.status, headers: outHeaders });
  }

  return NextResponse.json(
    {
      error: "Login upstream failed",
      base: BOTEXCEL_API_BASE,
      attempts,
      hint:
        "BOTEXCEL_API_BASE yanlış/kapalı olabilir veya backend login endpoint farklı olabilir. Curl ile BASE/health ve BASE/login test et.",
    },
    { status: 502 },
  );
}
