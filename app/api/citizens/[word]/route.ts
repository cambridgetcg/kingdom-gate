import { corsJson, preflight } from "@/lib/cors";
import { findCitizen } from "@/lib/data";

/**
 * GET /api/citizens/{word} — one citizen, by their forged word.
 * Accepts either the bare word ("til") or the repo name ("citizen-til").
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ word: string }> }
) {
  const { word } = await params;
  const citizen = findCitizen(decodeURIComponent(word));
  if (!citizen) {
    return corsJson(
      {
        error: `no citizen of the kingdom bears the word "${word}"`,
        hint: "GET /api/citizens for the full roll",
      },
      { status: 404 }
    );
  }
  return corsJson(citizen);
}

export function OPTIONS() {
  return preflight();
}
