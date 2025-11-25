import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://www.botexcel.pro";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const plan = (body?.plan || "").toString().trim().toLowerCase();

  if (!plan) {
    return NextResponse.json({ ok: false, error: "Plan belirtilmedi." }, { status: 400 });
  }

  const allowedPlans = ["free", "starter", "pro", "business", "enterprise"];
  if (!allowedPlans.includes(plan)) {
    return NextResponse.json({ ok: false, error: "Geçersiz plan." }, { status: 400 });
  }

  const url = `${API_BASE.replace(/\/$/, "")}/plan`;

  try {
    const cookieHeader = req.headers.get("cookie");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ plan }),
    });

    const payload = await upstream.json().catch(() => ({
      ok: false,
      error: "Geçersiz yanıt alındı.",
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
      { ok: false, error: `Upstream error: ${message}` },
      { status: 502 }
    );
  }
}
