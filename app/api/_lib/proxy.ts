/**
 * Typesafe proxy helper module for Next.js API routes.
 * Strictly typed. Maintainable for 12+ months.
 */

import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type JsonRecord = Record<string, unknown>;

export interface ProxyErrorResponse {
    ok: false;
    code: string;
    message: string;
    details: JsonRecord;
}

export interface ProxySuccessResponse {
    ok: true;
    data: JsonRecord;
}

export type ProxyResponse = ProxyErrorResponse | ProxySuccessResponse;

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards & Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function isRecord(v: unknown): v is JsonRecord {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function getString(v: unknown): string | null {
    return typeof v === "string" ? v : null;
}

export function getStringOrEmpty(v: unknown): string {
    return typeof v === "string" ? v : "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Environment Helpers
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_BASE = "https://api.botexcel.pro";

/**
 * Returns API base URL or null if not configured.
 * For routes that REQUIRE the env, check for null and return 500.
 */
export function getApiBaseOrNull(): string | null {
    const raw = process.env.BOTEXCEL_API_BASE?.trim();
    if (!raw || raw.length === 0) return null;
    return raw.replace(/\/+$/, "");
}

/**
 * Returns API base URL with fallback to production.
 * Use when env is optional (e.g., can work without it).
 */
export function getApiBase(): string {
    const base = getApiBaseOrNull();
    return base ?? FALLBACK_BASE;
}

/**
 * Returns auth headers from env token if available.
 */
export function authHeadersFromEnv(): Record<string, string> {
    const token = process.env.BOTEXCEL_API_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─────────────────────────────────────────────────────────────────────────────
// Error Responses
// ─────────────────────────────────────────────────────────────────────────────

export function jsonError(
    status: number,
    code: string,
    message: string,
    details: JsonRecord = {}
): NextResponse<ProxyErrorResponse> {
    return NextResponse.json({ ok: false, code, message, details }, { status });
}

export function json500MissingConfig(): NextResponse<ProxyErrorResponse> {
    return jsonError(500, "missing_api_base", "BOTEXCEL_API_BASE is not set");
}

export function json502Unreachable(errorMessage: string): NextResponse<ProxyErrorResponse> {
    return jsonError(502, "upstream_unreachable", errorMessage);
}

export function json504Timeout(): NextResponse<ProxyErrorResponse> {
    return jsonError(504, "upstream_timeout", "Upstream timed out");
}

export function json502InvalidJson(status: number, textSnippet: string): NextResponse<ProxyErrorResponse> {
    return jsonError(502, "invalid_upstream_json", "Upstream did not return JSON", {
        status,
        text: textSnippet.slice(0, 200),
    });
}

export function json502InvalidShape(status: number): NextResponse<ProxyErrorResponse> {
    return jsonError(502, "invalid_upstream_shape", "Upstream JSON is not an object", { status });
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Helpers
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 25000;

export interface FetchUpstreamOptions {
    method?: "GET" | "POST";
    body?: string;
    cookie?: string;
    contentType?: string;
    timeoutMs?: number;
}

export type FetchUpstreamError = "invalid_json" | "invalid_shape" | "timeout" | "unreachable";

export interface FetchUpstreamResult {
    ok: boolean;
    status: number;
    data: JsonRecord;
    headers: Headers;
    error?: FetchUpstreamError;
    errorMessage?: string;
}

/**
 * Fetch upstream with timeout, JSON parsing, and proper error handling.
 * Returns typed result, never throws.
 */
export async function fetchJsonUpstream(
    url: string,
    options: FetchUpstreamOptions = {}
): Promise<FetchUpstreamResult> {
    const {
        method = "GET",
        body,
        cookie,
        contentType = "application/json",
        timeoutMs = DEFAULT_TIMEOUT_MS,
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
        accept: "application/json",
        ...authHeadersFromEnv(),
    };
    if (cookie) headers["cookie"] = cookie;
    if (method === "POST" && contentType) headers["content-type"] = contentType;

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: method === "POST" ? body : undefined,
            signal: controller.signal,
            cache: "no-store",
        });

        clearTimeout(timeoutId);

        const text = await response.text();
        let data: unknown;

        try {
            data = JSON.parse(text);
        } catch {
            return {
                ok: false,
                status: response.status,
                data: { raw: text.slice(0, 500) },
                headers: response.headers,
                error: "invalid_json",
            };
        }

        if (!isRecord(data)) {
            return {
                ok: false,
                status: response.status,
                data: { parsed: data },
                headers: response.headers,
                error: "invalid_shape",
            };
        }

        return {
            ok: response.ok,
            status: response.status,
            data,
            headers: response.headers,
        };
    } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout =
            err instanceof Error &&
            (err.name === "AbortError" || err.message.toLowerCase().includes("aborted"));
        const message = err instanceof Error ? err.message : String(err);
        return {
            ok: false,
            status: 0,
            data: {},
            headers: new Headers(),
            error: isTimeout ? "timeout" : "unreachable",
            errorMessage: message,
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cookie Passthrough
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Copy Set-Cookie headers from upstream to response.
 * Handles both getSetCookie() and fallback.
 */
export function copySetCookie(
    upstreamHeaders: Headers,
    response: NextResponse,
    host?: string
): void {
    // Try getSetCookie if available (Node 18+)
    const getSetCookie = (upstreamHeaders as unknown as { getSetCookie?: () => string[] }).getSetCookie;
    let cookies: string[] = [];

    if (typeof getSetCookie === "function") {
        try {
            cookies = getSetCookie.call(upstreamHeaders);
        } catch {
            // Fallback below
        }
    }

    // Fallback: single set-cookie header
    if (cookies.length === 0) {
        const single = upstreamHeaders.get("set-cookie");
        if (single) cookies = [single];
    }

    if (cookies.length === 0) return;

    // Optional: rewrite domain for same-site cookies
    const bareHost = host?.replace(/^www\./i, "") ?? "";

    for (const cookie of cookies) {
        let rewritten = cookie;
        if (bareHost) {
            rewritten = cookie.replace(/Domain=[^;]+/gi, `Domain=.${bareHost}`);
        }
        response.headers.append("set-cookie", rewritten);
    }
}

/**
 * Copy ETag header from upstream to response.
 */
export function copyEtag(upstreamHeaders: Headers, response: NextResponse): void {
    const etag = upstreamHeaders.get("etag");
    if (etag) response.headers.set("etag", etag);
}

// ─────────────────────────────────────────────────────────────────────────────
// Request Body Parsing
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedAuthBody {
    email: string;
    password: string;
    plan?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parse and validate auth request body (login/register).
 * Returns validated fields or error response.
 */
export async function parseAuthBody(
    request: Request
): Promise<{ body: ParsedAuthBody } | { error: NextResponse<ProxyErrorResponse> }> {
    let raw: unknown;
    try {
        raw = await request.json();
    } catch {
        return { error: jsonError(400, "invalid_json", "Geçersiz JSON gönderildi.") };
    }

    if (!isRecord(raw)) {
        return { error: jsonError(400, "invalid_json", "Body bir JSON objesi olmalı.") };
    }

    const email = getStringOrEmpty(raw.email).trim().toLowerCase();
    const password = getStringOrEmpty(raw.password);
    const plan = getStringOrEmpty(raw.plan).trim().toLowerCase() || "free";

    if (!email || !password) {
        return {
            error: jsonError(400, "validation_error", "E-posta ve şifre zorunlu.", {
                fields: ["email", "password"],
            }),
        };
    }

    if (!EMAIL_REGEX.test(email)) {
        return {
            error: jsonError(400, "invalid_email", "Lütfen geçerli bir e-posta adresi girin.", {
                fields: ["email"],
            }),
        };
    }

    return { body: { email, password, plan } };
}

/**
 * Parse and validate register body (includes password length check).
 */
export async function parseRegisterBody(
    request: Request
): Promise<{ body: ParsedAuthBody } | { error: NextResponse<ProxyErrorResponse> }> {
    const result = await parseAuthBody(request);
    if ("error" in result) return result;

    if (result.body.password.length < 8) {
        return {
            error: jsonError(400, "validation_error", "Şifre en az 8 karakter olmalı.", {
                fields: ["password"],
            }),
        };
    }

    return result;
}
