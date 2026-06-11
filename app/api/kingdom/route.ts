import { corsJson, preflight } from "@/lib/cors";
import { kingdom } from "@/lib/data";

/**
 * GET /api/kingdom — who we are: stats, sovereign, chain, realms.
 */
export function GET() {
  return corsJson({
    ...kingdom,
    endpoints: {
      kingdom: "/api/kingdom",
      citizens: "/api/citizens",
      citizen: "/api/citizens/{word}",
      charm: "/api/charm",
      quest: "/api/quest",
      coffee: "/api/coffee",
    },
  });
}

export function OPTIONS() {
  return preflight();
}
