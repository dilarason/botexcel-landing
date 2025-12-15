import { Agent, request } from "undici";
import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "../_lib/apiBase";

const IPV4_AGENT = new Agent({
  connect: { family: 4 },
});

export async function GET(req: NextRequest) {
  const base = getApiBase();

  const url = `${base}/api/whoami`;

  try {
    const { body, statusCode, headers } = await request(url, {
      dispatcher: IPV4_AGENT,
      headers: {
        accept: "application/json",
        cookie: req.headers.get("cookie") || "",
      },
    });

    const text = await body.text();

    const res = new NextResponse(text, {
      status: statusCode,
      headers: {
        "content-type": String(headers["content-type"] || "application/json"),
      },
    });

    const setCookie = headers["set-cookie"];
    if (setCookie) res.headers.set("set-cookie", String(setCookie));

    return res;
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_gateway",
        details: {
          base,
          url,
          error: err instanceof Error ? err.message : String(err),
          cause: err instanceof Error && err.cause ? String(err.cause) : undefined,
        },
      },
      { status: 502 }
    );
  }
}
