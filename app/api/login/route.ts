import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://api.botexcel.pro";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body?.email || "").toString().trim().toLowerCase();
  const password = (body?.password || "").toString();

  if (!email || !password) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: "E-posta ve şifre zorunlu.",
        details: { fields: ["email", "password"] },
      },
      { status: 400 }
    );
  }

  const url = `${API_BASE.replace(/\/$/, "")}/api/login`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      redirect: "manual",
    });

    const payload = await upstream.json().catch(() => ({}));
    const ok = payload?.ok === true;
    const normalized = ok
      ? { ok: true, data: payload.data ?? payload }
      : {
          ok: false,
          code: payload?.code || "server_error",
          message: payload?.message || "Giriş başarısız.",
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
