import { NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.BOTEXCEL_API_BASE ??
  process.env.NEXT_PUBLIC_BACKEND ??
  ""
).replace(/\/$/, "");

const makeErrorResponse = (message: string) =>
  NextResponse.json({ message }, { status: 400 });

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return makeErrorResponse("E-posta ve şifre zorunludur.");
  }

  if (BACKEND_BASE) {
    try {
      const response = await fetch(`${BACKEND_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json(data || { message: "Giriş yapılamadı." }, {
          status: response.status,
        });
      }
      return NextResponse.json(data || { message: "Giriş başarılı.", access_token: "" });
    } catch (error) {
      console.error("Login proxy error:", error);
      return NextResponse.json(
        { message: "Sunucuya bağlanılamadı." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    message: "Demo giriş başarılı.",
    access_token: `demo-token-${Date.now()}`,
  });
}
