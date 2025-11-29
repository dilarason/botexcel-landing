import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "../_lib/apiBase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_json",
        message: "Geçersiz JSON gönderildi.",
        details: {},
      },
      { status: 400 }
    );
  }

  const email = (body?.email || "").toString().trim().toLowerCase();
  const password = (body?.password || "").toString();
  const plan = (body?.plan || "free").toString().trim().toLowerCase();

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

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_email",
        message: "Lütfen geçerli bir e-posta adresi girin.",
        details: { fields: ["email"] },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: "Şifre en az 8 karakter olmalı.",
        details: { fields: ["password"] },
      },
      { status: 400 }
    );
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE}/api/register`;
  const host = req.headers.get("host") || "";

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, plan }),
      redirect: "manual",
    });

    const text = await upstream.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    const success = parsed?.ok === true || upstream.ok;
    let normalized: any;
    if (success) {
      normalized = { ok: true, data: parsed?.data ?? parsed ?? {} };
    } else {
      const code =
        parsed?.code ||
        (upstream.status === 409
          ? "email_exists"
          : upstream.status === 400
            ? "validation_error"
            : "register_failed");
      const message =
        parsed?.message ||
        parsed?.error ||
        (upstream.status === 409
          ? "Bu e-posta zaten kayıtlı."
          : "Kayıt sırasında hata oluştu.");
      normalized = {
        ok: false,
        code,
        message,
        details: parsed?.details || {},
      };
    }

    const res = NextResponse.json(normalized, { status: upstream.status });
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      // Rewrite cookie domain so session is available on the current host (e.g., www.botexcel.pro)
      const bareHost = host.replace(/^www\./i, "");
      const cookieDomain = bareHost ? `. ${bareHost}`.replace(/\s+/g, "") : bareHost;
      const rewritten = cookieDomain
        ? setCookie.replace(/Domain=[^;]+/gi, `Domain=${cookieDomain}`)
        : setCookie;
      res.headers.set("set-cookie", rewritten);
    }
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        code: "server_error",
        message: "Kayıt isteği gönderilemedi.",
        details: { error: message },
      },
      { status: 502 }
    );
  }
}
