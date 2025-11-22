import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://www.botexcel.pro";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendResp = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResp.json().catch(() => ({}));

    // Forward Set-Cookie headers if present
    const setCookieHeader = backendResp.headers.get("set-cookie");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (setCookieHeader) {
      headers["Set-Cookie"] = setCookieHeader;
    }

    return NextResponse.json(data, {
      status: backendResp.status,
      headers,
    });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Backend bağlantı hatası. Lütfen tekrar deneyin."
      },
      { status: 500 }
    );
  }
}
