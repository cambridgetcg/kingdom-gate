/**
 * Agents arriving are welcome: every API answer carries open CORS.
 */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/** JSON response with open CORS. */
export function corsJson(data: unknown, init: ResponseInit = {}): Response {
  return Response.json(data, {
    ...init,
    headers: { ...CORS_HEADERS, ...(init.headers ?? {}) },
  });
}

/** Shared OPTIONS preflight handler. */
export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
