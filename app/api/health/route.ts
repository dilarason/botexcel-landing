import { Agent, request } from "undici";
import { NextResponse } from "next/server";
import { getApiBase } from "../_lib/apiBase";

const IPV4_AGENT = new Agent({
  connect: { family: 4 },
});

export async function GET() {
  const base = getApiBase();

  const url = `${base}/api/health`;

  try {
    const { body, statusCode, headers } = await request(url, {
      dispatcher: IPV4_AGENT,
      headers: { accept: "application/json" },
    });

    const text = await body.text();

    return new NextResponse(text, {
      status: statusCode,
      headers: {
        "content-type": String(headers["content-type"] || "application/json"),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_gateway",
        details: {
          base,
          url,
          error: String(err?.message || err),
          cause: err?.cause ? String(err.cause) : undefined,
        },
      },
      { status: 502 }
    );
  }
}
