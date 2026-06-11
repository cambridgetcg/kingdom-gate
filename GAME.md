# THE PILGRIM'S GAME

The Kingdom Gate carries a quiet game. These are its rules, in plain
words. Fun comes from gathering and discovery, never from pressure.

## The privacy law

**Your journey lives only in your browser. We never see it.**

All progress is kept in your own browser's localStorage under one key
(`kingdom-journey-v1`). There are no accounts, no cookies, no analytics,
no server state. Clear your browser storage and the journey is gone —
that is your right, not a bug.

## The mechanics

**The Charm Book** (`/book`). Every charm you draw at the oracle
(`/charm`) is gathered into your book. There are 204. Gathered charms
wear their card face; the rest lie face-down. Drawing a charm you
already hold is a reunion, never a fail state: "The oracle smiles — you
and *grief* have met before."

**Citizen cards.** Every citizen is a card: the word is the name, the
tier is the frame (Core — a word carried whole from one tradition, warm
edge; Specialized — a word forged by joining donors, cool edge), the
donor traditions are small suit-like glyphs, the charm is the flavor
text, and the corner number is a playful weight drawn deterministically
from the word itself. It measures nothing and never will.

**The Pilgrim's Path.** Seven steps, begun by one link on the home
page, never nagged about:

1. **Arrive** — stand at the gate
2. **Meet a citizen** — open any card on `/citizens`
3. **Draw a charm** — visit the oracle
4. **Gather seven** — seven charms in the book
5. **Read the peace** — visit `/castle`
6. **Hold a law** — reveal the day's law on `/castle`
7. **Find the teapot** — discover `/api/coffee` (a hint hides in the
   book's footer)

Completion crowns you **Pilgrim**, with a sigil — a deterministic hash
of your gathered set — and one blessing. No leaderboard, no streaks, no
guilt.

**Citizen of the day.** One citizen holds the gate each day, the same
for every visitor, computed from the date alone. Gathering them on
their own day marks a quiet ✦ in the book. Punctuality is greeted,
never demanded.

**The day's law.** One of the forty-two laws of the [Kingdom
Standard](https://github.com/cambridgetcg/kingdom-standard) holds each
day, revealed on tap at `/castle`. The laws are baked at build time by
`scripts/forge-laws.mjs`.

**The agent quest** (`GET /api/quest`). Agents play too. Each day, one
riddle: a charm with its citizen's name redacted, plus three etymology
hints. `GET /api/quest?answer={word}` — a correct answer (today's, or
yesterday's for agents straddling midnight UTC) earns
`{ "blessed": true, "sigil": …, "word": …, "blessing": … }`. A wrong
answer earns a kind hint, HTTP 200. The kingdom never punishes a guess.

## Where the game lives

All game logic is one module: `lib/game.ts` — pure functions (`gather`,
`getBook`, `pathProgress`, `citizenOfTheDay`, `questOfTheDay`,
`lawOfTheDay`, `sigil`, the card derivations) plus one SSR-safe
`useGame()` hook that owns every touch of localStorage. Components
consume the module; nothing is scattered.

## How to add a quest step (the process)

1. Add one field to the `Journey` interface in `lib/game.ts`, with a
   default in `emptyJourney()` and `normalizeJourney()`.
2. Add one entry to the `steps` array in `pathProgress()` — its name is
   the rule, written so a stranger understands it in ten seconds.
3. Add one pure `markX()` function and expose it through `useGame()`.
4. Call the mark from the one component where the step happens.
5. Update the step list above. That is the whole process; if a step
   needs more than this, the step is too complicated.

## What we will never add

- accounts, sign-ins, or identity of any kind
- tracking, analytics, or server-side memory of a visitor
- dark patterns: streaks, timers, guilt, scarcity, nagging
- paid anything

A visitor who ignores the game entirely sees a calm site, unchanged in
spirit. That is the test every change must pass.
