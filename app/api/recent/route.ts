import { NextRequest, NextResponse } from "next/server";
import {
  getApiBaseOrNull,
  fetchJsonUpstream,
  copyEtag,
  json500MissingConfig,
  json502Unreachable,
  json502InvalidJson,
  json502InvalidShape,
  isRecord,
} from "../_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // 1. Check env
  const base = getApiBaseOrNull();
  if (!base) return json500MissingConfig();

  // 2. Build request with query params
  const search = req.nextUrl.search; // includes leading '?'
  const url = `${base}/recent.json${search}`;
  const cookie = req.headers.get("cookie") ?? "";

  // 3. Fetch upstream
  const result = await fetchJsonUpstream(url, {
    method: "GET",
    cookie: cookie || undefined,
  });

  // 4. Handle errors
  if (result.error === "invalid_json") {
    const snippet = isRecord(result.data) ? String(result.data.raw ?? "") : "";
    return json502InvalidJson(result.status, snippet);
  }

  if (result.error === "invalid_shape") {
    return json502InvalidShape(result.status);
  }

  if (result.error) {
    return json502Unreachable(result.error);
  }

  // 5. Build response with ETag passthrough
  const res = NextResponse.json(result.data, { status: result.status });
  copyEtag(result.headers, res);

  return res;
}
