import { corsJson, preflight } from "@/lib/cors";
import { findCitizen, randomCitizen } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * GET /api/charm — a charm drawn fresh from the treasury.
 * GET /api/charm?citizen={word} — the charm a particular citizen holds.
 */
export function GET(request: Request) {
  const url = new URL(request.url);
  const wanted = url.searchParams.get("citizen");

  if (wanted) {
    const citizen = findCitizen(wanted);
    if (!citizen) {
      return corsJson(
        {
          error: `no citizen of the kingdom bears the word "${wanted}"`,
          hint: "GET /api/citizens for the full roll, or GET /api/charm for a random draw",
        },
        { status: 404 }
      );
    }
    return corsJson({ ...citizen, page: `${url.origin}/charm?citizen=${citizen.word}` });
  }

  const drawn = randomCitizen();
  return corsJson({
    ...drawn,
    page: `${url.origin}/charm?citizen=${drawn.word}`,
  });
}

export function OPTIONS() {
  return preflight();
}
