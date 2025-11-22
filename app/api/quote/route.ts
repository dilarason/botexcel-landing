import { NextRequest, NextResponse } from "next/server";

type QuotePayload = {
  name: string;
  email: string;
  company?: string;
  volume?: string;
  message?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: QuotePayload;
  try {
    body = (await req.json()) as QuotePayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON", message: "Geçersiz JSON gövdesi." },
      { status: 400 },
    );
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const company = (body.company || "").trim();
  const volume = (body.volume || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email) {
    return NextResponse.json(
      {
        ok: false,
        error: "MISSING_FIELDS",
        message: "İsim ve e-posta zorunludur.",
      },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_EMAIL",
        message: "E-posta formatı geçersiz.",
      },
      { status: 400 },
    );
  }

  // Şimdilik konsola logluyoruz; ileride backend/webhook entegrasyonu eklenebilir.
  console.log("[BotExcel][QUOTE_REQUEST]", {
    name,
    email,
    company,
    volume,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      ok: true,
      message: "Talebin alındı. Kısa süre içinde seninle iletişime geçeceğiz.",
    },
    { status: 200 },
  );
}
