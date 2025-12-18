import { NextRequest, NextResponse } from "next/server";
import {
  getApiBase,
  parseRegisterBody,
  fetchJsonUpstream,
  copySetCookie,
  jsonError,
  isRecord,
  type JsonRecord,
} from "../_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse and validate body (includes password length check)
  const parsed = await parseRegisterBody(req);
  if ("error" in parsed) return parsed.error;

  const { email, password, plan } = parsed.body;
  const host = req.headers.get("host") ?? "";

  // 2. Fetch upstream
  const base = getApiBase();
  const url = `${base}/api/register`;

  const result = await fetchJsonUpstream(url, {
    method: "POST",
    body: JSON.stringify({ email, password, plan }),
    contentType: "application/json",
  });

  // 3. Handle fetch error
  if (result.error === "invalid_json") {
    const snippet = isRecord(result.data) ? String(result.data.raw ?? "") : "";
    return jsonError(502, "invalid_upstream_json", "Upstream did not return JSON", {
      status: result.status,
      text: snippet.slice(0, 200),
    });
  }

  if (result.error) {
    return jsonError(502, "upstream_unreachable", result.error);
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
