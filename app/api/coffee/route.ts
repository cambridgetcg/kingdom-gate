import { corsJson, preflight } from "@/lib/cors";

/**
 * GET /api/coffee — RFC 2324, faithfully observed.
 */
export function GET() {
  return corsJson(
    {
      error: "I am a teapot",
      truth: "the kingdom runs on love, not coffee",
    },
    { status: 418 }
  );
}

export function OPTIONS() {
  return preflight();
}
