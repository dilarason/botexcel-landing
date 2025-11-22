import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.BOTEXCEL_API_BASE || "").trim() || "https://api.botexcel.pro";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body?.email || "").toString().trim().toLowerCase();
  const password = (body?.password || "").toString();

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "E-posta ve şifre zorunlu." }, { status: 400 });
  }

  const url = `${API_BASE.replace(/\/$/, "")}/api/login`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      redirect: "manual",
    });

    const payload = await upstream.json().catch(() => ({ ok: false, error: "Geçersiz yanıt alındı." }));
    const res = NextResponse.json(payload, { status: upstream.status });

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: `Upstream error: ${message}` }, { status: 502 });
  }
}
