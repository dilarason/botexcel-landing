import { NextRequest } from "next/server";

const API_BASE =
  (process.env.BOTEXCEL_API_BASE || process.env.NEXT_PUBLIC_BACKEND || "").trim() ||
  "https://www.botexcel.pro";

export async function GET(
  request: NextRequest,
  { params }: { params?: Promise<Record<string, string | string[] | undefined>> }
) {
  const resolvedParams = (await params) || {};
  const filename = resolvedParams.filename;
  const normalizedFilename = Array.isArray(filename) ? filename[0] : filename;
  if (!normalizedFilename) {
    return new Response(
      JSON.stringify({
        ok: false,
        code: "validation_error",
        message: "Dosya adı eksik.",
        details: {},
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  const url = `${API_BASE.replace(/\/$/, "")}/api/download/${encodeURIComponent(normalizedFilename)}`;
  try {
    const cookie = request.headers.get("cookie");
    const headers: HeadersInit = {};
    if (cookie) headers["Cookie"] = cookie;

    const upstream = await fetch(url, {
      method: "GET",
      headers,
      redirect: "manual",
    });

    const contentType = upstream.headers.get("content-type") || "";
    // If JSON error, normalize
    if (contentType.includes("application/json")) {
      const payload = await upstream.json().catch(() => ({}));
      const ok = payload?.ok === true;
      const normalized = ok
        ? { ok: true, data: payload.data ?? payload }
        : {
            ok: false,
            code: payload?.code || "server_error",
            message: payload?.message || payload?.error || "İndirme sırasında hata oluştu.",
            details: payload?.details || {},
          };
      return new Response(JSON.stringify(normalized), {
        status: upstream.status,
        headers: { "content-type": "application/json" },
      });
    }

    // Stream file as-is
    const headersObj = new Headers(upstream.headers);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: headersObj,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        ok: false,
        code: "server_error",
        message: `Upstream error: ${message}`,
        details: {},
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}
