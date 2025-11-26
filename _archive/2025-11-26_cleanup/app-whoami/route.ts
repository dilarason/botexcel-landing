import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.BOTEXCEL_API_BASE || "https://api.botexcel.pro";

/**
 * GET /whoami
 * Tarayıcıdan direkt istek alır, backend'deki /whoami'ye proxy eder.
 * Cookie'yi olduğu gibi forward eder, gelen Set-Cookie'yi geri yazar.
 */
export async function GET(req: NextRequest) {
  try {
    const backendUrl = `${API_BASE.replace(/\/+$/, "")}/whoami`;

    const res = await fetch(backendUrl, {
      method: "GET",
      // Kullanıcının session cookie'lerini backend'e taşı
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      // Render tarafında cookie forward için
      credentials: "include",
    });

    // Backend'in body’sini text olarak al (JSON da olabilir)
    const bodyText = await res.text();

    const nextRes = new NextResponse(bodyText, {
      status: res.status,
      headers: {
        "content-type":
          res.headers.get("content-type") || "application/json",
      },
    });

    // Backend'ten gelen Set-Cookie varsa aynen geç
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("set-cookie", setCookie);
    }

    return nextRes;
  } catch (err) {
    console.error("WHOAMI_PROXY_ERROR", err);
    return NextResponse.json(
      { error: "WHOAMI_PROXY_ERROR" },
      { status: 502 }
    );
  }
}
