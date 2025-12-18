import { NextRequest, NextResponse } from "next/server";
import {
  getApiBaseOrNull,
  parseRegisterBody,
  fetchJsonUpstream,
  copySetCookie,
  json500MissingConfig,
  json502InvalidJson,
  json502InvalidShape,
  json502Unreachable,
  json504Timeout,
  isRecord,
  type JsonRecord,
} from "../_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const base = getApiBaseOrNull();
  if (!base) return json500MissingConfig();

  // 1. Parse and validate body (includes password length check)
  const parsed = await parseRegisterBody(req);
  if ("error" in parsed) return parsed.error;

  const { email, password, plan } = parsed.body;
  const host = req.headers.get("host") ?? "";
  const cookie = req.headers.get("cookie") ?? "";

  // 2. Fetch upstream
  const url = `${base}/api/register`;

  const result = await fetchJsonUpstream(url, {
    method: "POST",
    body: JSON.stringify({ email, password, plan }),
    contentType: "application/json",
    cookie: cookie || undefined,
  });

  // 3. Handle fetch error
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

  // 4. Normalize response
  const data = result.data;
  const success = data.ok === true || result.ok;

  let normalized: JsonRecord;
  if (success) {
    const innerData = isRecord(data.data) ? data.data : data;
    normalized = { ok: true, data: innerData };
  } else {
    const code =
      typeof data.code === "string"
        ? data.code
        : result.status === 409
          ? "email_exists"
          : result.status === 400
            ? "validation_error"
            : "register_failed";
    const message =
      typeof data.message === "string"
        ? data.message
        : typeof data.error === "string"
          ? data.error
          : result.status === 409
            ? "Bu e-posta zaten kayıtlı."
            : "Kayıt sırasında hata oluştu.";
    const details = isRecord(data.details) ? data.details : {};
    normalized = { ok: false, code, message, details };
  }

  // 5. Build response with cookie passthrough
  const res = NextResponse.json(normalized, { status: result.status });
  copySetCookie(result.headers, res, host);

  return res;
}
