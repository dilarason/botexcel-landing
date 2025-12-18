import { NextResponse } from "next/server";

const API_BASE = process.env.BOTEXCEL_API_BASE || "http://127.0.0.1:8000";

// Local dev’de proxy (8000) recent’ı expose etmiyorsa 5000’e düş (prod’u etkilemez)
function devFallbackBases(primary: string): string[] {
  const bases = [primary];
  const isLocalProxy =
    primary.includes("127.0.0.1:8000") || primary.includes("localhost:8000");
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd && isLocalProxy) bases.push("http://127.0.0.1:5000");
  return bases;
}

function pickAuthHeader(req: Request): string | undefined {
  const incoming = req.headers.get("authorization");
  if (incoming) return incoming;

  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)botexcel_access_token=([^;]+)/);
  if (!m) return undefined;

  // Cookie değeri genelde JWT; decodeURIComponent güvenli
  const token = decodeURIComponent(m[1]);
  return token ? `Bearer ${token}` : undefined;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.search; // ?limit=...&user=me gibi aynen geçecek
  const ifNoneMatch = req.headers.get("if-none-match") || undefined;
  const auth = pickAuthHeader(req);

  const bases = devFallbackBases(API_BASE);

  const paths = [
    "/recent.json",     // Flask canonical
    "/api/recent",      // alternatif
    "/api/recent.json", // alternatif
  ];

  const tried: string[] = [];
  let last: { status?: number; body?: string } = {};

  for (const base of bases) {
    for (const p of paths) {
      const target = `${base}${p}${qs}`;
      tried.push(target);

      try {
        const upstream = await fetch(target, {
          method: "GET",
          headers: {
            ...(auth ? { Authorization: auth } : {}),
            ...(ifNoneMatch ? { "If-None-Match": ifNoneMatch } : {}),
            Accept: "application/json",
          },
        });

        // 304 passthrough
        if (upstream.status === 304) {
          const h = new Headers();
          const etag = upstream.headers.get("etag");
          if (etag) h.set("ETag", etag);
          const cc = upstream.headers.get("cache-control");
          if (cc) h.set("Cache-Control", cc);
          return new Response(null, { status: 304, headers: h });
        }

        const text = await upstream.text().catch(() => "");
        last = { status: upstream.status, body: text.slice(0, 600) };

        if (!upstream.ok) {
          // 404 ise diğer adaylara bak
          continue;
        }

        const h = new Headers();
        const ct = upstream.headers.get("content-type");
        if (ct) h.set("Content-Type", ct);
        const etag = upstream.headers.get("etag");
        if (etag) h.set("ETag", etag);

        return new Response(text, { status: 200, headers: h });
      } catch (e: any) {
        last = { body: String(e?.message ?? e) };
        continue;
      }
    }
  }

  // Artık Next tarafında "route yok" değil, upstream’e ulaşamadık / bulamadık demek
  return NextResponse.json(
    {
      ok: false,
      code: "upstream_unreachable",
      message: "recent kaynağına ulaşılamadı (upstream endpoint bulunamadı veya erişilemedi).",
      details: { api_base: API_BASE, tried, last },
    },
    { status: 502 }
  );
}
