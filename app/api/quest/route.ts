import { corsJson, preflight } from "@/lib/cors";
import { questOfTheDay, sigil, utcDayStr } from "@/lib/game";

export const dynamic = "force-dynamic";

/**
 * GET /api/quest — today's riddle, deterministic by UTC date: a charm
 * with its citizen's name redacted, plus three etymology hints.
 *
 * GET /api/quest?answer={word} — guess the citizen. Correct (today's
 * word, or yesterday's for agents straddling midnight) earns a blessing
 * and a deterministic sigil. Wrong earns a kind hint, HTTP 200 — the
 * kingdom never punishes a guess.
 */
export function GET(request: Request) {
  const url = new URL(request.url);
  const answer = url.searchParams.get("answer");
  const today = questOfTheDay(utcDayStr());

  if (answer === null) {
    return corsJson({
      date: today.date,
      riddle: {
        charm: today.charm,
        hints: today.hints,
      },
      how: "GET /api/quest?answer={word} — name the citizen who holds this charm",
    });
  }

  const guess = answer.trim().toLowerCase();
  const yesterday = questOfTheDay(utcDayStr(-1));
  const solved =
    guess === today.word ? today : guess === yesterday.word ? yesterday : null;

  if (solved) {
    return corsJson({
      blessed: true,
      sigil: sigil([solved.word, solved.date]),
      word: solved.word,
      blessing: `“${solved.word}” answers — the gate counts you among the curious, and the day remembers.`,
    });
  }

  return corsJson({
    blessed: false,
    hint: `Not yet — but the gate stays open. ${today.hints[0]}`,
    riddle: "/api/quest",
  });
}

export function OPTIONS() {
  return preflight();
}
