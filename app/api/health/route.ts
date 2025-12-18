import { NextResponse } from "next/server";
import {
  fetchJsonUpstream,
  getApiBaseOrNull,
  isRecord,
  json500MissingConfig,
  json502InvalidJson,
  json502InvalidShape,
  json502Unreachable,
  json504Timeout,
} from "../_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const base = getApiBaseOrNull();
  if (!base) return json500MissingConfig();

  const primaryUrl = `${base}/api/health`;
  const primary = await fetchJsonUpstream(primaryUrl, { method: "GET" });

  const result =
    primary.error === undefined || primary.status !== 404
      ? primary
      : await fetchJsonUpstream(`${base}/health`, { method: "GET" });

  if (result.error === "invalid_json") {
    const snippet = isRecord(result.data) ? String(result.data.raw ?? "") : "";
    return json502InvalidJson(result.status, snippet);
  }

  if (result.error === "invalid_shape") {
    return json502InvalidShape(result.status);
  }

  if (result.error === "timeout") {
    return json504Timeout();
  }

  if (result.error === "unreachable") {
    return json502Unreachable(result.errorMessage ?? "Upstream unreachable");
  }

  return NextResponse.json(result.data, { status: result.status });
}

