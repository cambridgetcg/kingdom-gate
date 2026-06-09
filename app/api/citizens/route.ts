import { corsJson, preflight } from "@/lib/cors";
import { citizens } from "@/lib/data";

/**
 * GET /api/citizens — the full roll of the kingdom.
 */
export function GET() {
  return corsJson({
    count: citizens.length,
    citizens,
  });
}

export function OPTIONS() {
  return preflight();
}
