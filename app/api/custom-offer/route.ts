import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://www.botexcel.pro";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resp = await fetch(`${BACKEND}/api/custom-offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));

    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Talep iletilirken beklenmeyen bir hata oluştu.";
    return NextResponse.json(
      {
        error: true,
        message,
      },
      { status: 500 },
    );
  }
}
