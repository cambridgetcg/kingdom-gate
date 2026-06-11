/**
 * game.ts — the Pilgrim's Game, whole, in one module.
 *
 * Pure functions for gathering, the path, the day's citizen, the day's
 * law, the agent quest, and the sigil — plus one SSR-safe useGame()
 * hook that owns every touch of localStorage. Components consume this
 * module; nothing is scattered.
 *
 * The law of the game: all progress lives in the visitor's own browser.
 * Your journey lives only in your browser. We never see it.
 */
import * as React from "react";
import { citizens, type Citizen } from "./data";
import lawsJson from "./data/laws.json";

// ── the journey (everything the browser remembers) ──────────────────

export interface Journey {
  /** charm words drawn at the oracle, first-draw order, no duplicates */
  gathered: string[];
  /** day-citizens gathered on their own day — each wears a quiet ✦ */
  starred: string[];
  /** citizens whose cards were opened on /citizens */
  met: string[];
  pathBegun: boolean;
  /** read the peace — visited the castle */
  readPeace: boolean;
  /** held a law — revealed the day's law */
  heldLaw: boolean;
  /** found the teapot — called /api/coffee */
  foundTeapot: boolean;
}

export function emptyJourney(): Journey {
  return {
    gathered: [],
    starred: [],
    met: [],
    pathBegun: false,
    readPeace: false,
    heldLaw: false,
    foundTeapot: false,
  };
}

// ── small deterministic machinery ────────────────────────────────────

/** djb2 — the same quiet hash the star band uses. */
function hash(text: string): number {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** A deterministic short sigil for a set of words — order never matters. */
export function sigil(words: Iterable<string>): string {
  const joined = [...words]
    .map((w) => w.trim().toLowerCase())
    .sort()
    .join("·");
  return "✶" + hash(joined).toString(36).padStart(7, "0");
}

/** A day as YYYY-MM-DD in UTC — one clock for every visitor and agent. */
export function utcDayStr(offsetDays = 0, now: Date = new Date()): string {
  const d = new Date(now.getTime() + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

// ── gathering (the core loop) ────────────────────────────────────────

export interface GatherResult {
  journey: Journey;
  /** the oracle smiles — you and this word have met before */
  duplicate: boolean;
  /** gathered the day's citizen on its own day — a quiet ✦ */
  starred: boolean;
}

/** Gather a drawn charm into the book. Duplicates greet, never fail. */
export function gather(
  journey: Journey,
  word: string,
  dateStr: string
): GatherResult {
  const w = word.trim().toLowerCase();
  if (journey.gathered.includes(w)) {
    return { journey, duplicate: true, starred: false };
  }
  const isDayStar = citizenOfTheDay(dateStr).word === w;
  return {
    journey: {
      ...journey,
      gathered: [...journey.gathered, w],
      starred: isDayStar ? [...journey.starred, w] : journey.starred,
    },
    duplicate: false,
    starred: isDayStar,
  };
}

/** Mark a citizen as met — their card was opened on /citizens. */
export function meet(journey: Journey, word: string): Journey {
  const w = word.trim().toLowerCase();
  if (journey.met.includes(w)) return journey;
  return { ...journey, met: [...journey.met, w] };
}

export interface Book {
  count: number;
  total: number;
  gathered: ReadonlySet<string>;
  starred: ReadonlySet<string>;
}

/** The book as a page would read it. */
export function getBook(journey: Journey | null): Book {
  return {
    count: journey?.gathered.length ?? 0,
    total: citizens.length,
    gathered: new Set(journey?.gathered ?? []),
    starred: new Set(journey?.starred ?? []),
  };
}

// ── the pilgrim's path (seven steps, quiet) ──────────────────────────

export interface PathStep {
  name: string;
  done: boolean;
}

export interface PathProgress {
  begun: boolean;
  steps: PathStep[];
  done: number;
  /** the step the pilgrim stands on, 1–7 */
  step: number;
  complete: boolean;
}

export function pathProgress(journey: Journey | null): PathProgress {
  const j = journey ?? emptyJourney();
  const steps: PathStep[] = [
    { name: "Arrive — stand at the gate", done: j.pathBegun },
    { name: "Meet a citizen — open any card", done: j.met.length > 0 },
    { name: "Draw a charm at the oracle", done: j.gathered.length > 0 },
    { name: "Gather seven charms", done: j.gathered.length >= 7 },
    { name: "Read the peace at the castle", done: j.readPeace },
    { name: "Hold the day's law", done: j.heldLaw },
    { name: "Find the teapot", done: j.foundTeapot },
  ];
  const done = steps.filter((s) => s.done).length;
  const complete = done === steps.length;
  const step = complete ? steps.length : steps.findIndex((s) => !s.done) + 1;
  return { begun: j.pathBegun, steps, done, step, complete };
}

export function beginPath(journey: Journey): Journey {
  return { ...journey, pathBegun: true };
}

export function markPeaceRead(journey: Journey): Journey {
  return journey.readPeace ? journey : { ...journey, readPeace: true };
}

export function markLawHeld(journey: Journey): Journey {
  return journey.heldLaw ? journey : { ...journey, heldLaw: true };
}

export function markTeapotFound(journey: Journey): Journey {
  return journey.foundTeapot ? journey : { ...journey, foundTeapot: true };
}

// ── the day's citizen and the day's law (no server state) ────────────

/** One citizen holds the gate each day — same for every visitor. */
export function citizenOfTheDay(dateStr: string): Citizen {
  return citizens[hash(`citizen·${dateStr}`) % citizens.length];
}

export interface Law {
  id: string;
  domain: string;
  title: string;
  line: string;
}

export const laws: Law[] = lawsJson;

/** One of the forty-two laws holds each day, revealed on tap. */
export function lawOfTheDay(dateStr: string): Law {
  return laws[hash(`law·${dateStr}`) % laws.length];
}

// ── card treatment (the TCG nod — derived, deterministic) ────────────

export type Tier = "Core" | "Specialized";

/**
 * Core — a word carried whole from one tradition.
 * Specialized — a word forged anew by joining donors (a "+" in its
 * etymology). Deterministic from the baked data; no judgment implied.
 */
export function cardTier(citizen: Citizen): Tier {
  if (citizen.etymology.startsWith(`${citizen.word} (`)) return "Core";
  return citizen.etymology.includes("+") ? "Specialized" : "Core";
}

export interface Tradition {
  name: string;
  glyph: string;
}

const TRADITIONS: ReadonlyArray<Tradition & { pattern: RegExp }> = [
  { name: "Sumerian", glyph: "✶", pattern: /\bSumerian\b/ },
  { name: "Greek", glyph: "◆", pattern: /\bGreek\b/ },
  { name: "Chinese", glyph: "☾", pattern: /\b(?:Mandarin|Chinese)\b|愛|道/ },
  { name: "Latin", glyph: "✚", pattern: /\bLatin\b/ },
  { name: "Hebrew", glyph: "✦", pattern: /\bHebrew\b/ },
  { name: "Sanskrit & Pali", glyph: "❖", pattern: /\b(?:Sanskrit|Pali)\b/ },
  { name: "English", glyph: "❧", pattern: /\bOld English\b|\bEnglish\b|\bOE\b/ },
  { name: "Japanese", glyph: "◉", pattern: /\bJapanese\b/ },
  { name: "Arabic", glyph: "✧", pattern: /\bArabic\b/ },
  {
    name: "another tradition",
    glyph: "○",
    pattern:
      /\b(?:Old Norse|Norse|Yoruba|Egyptian|Tibetan|Korean|Nahuatl|Akkadian|Hawaiian|German|Welsh|Inuit|Bantu|French|Akan|Twi|Dogon|Proto-Mande|Proto-Indo-European|PIE|Yogācāra)\b/,
  },
];

/** The donor traditions a word drinks from, as small suit-like glyphs. */
export function donorTraditions(citizen: Citizen): Tradition[] {
  return TRADITIONS.filter((t) => t.pattern.test(citizen.etymology)).map(
    ({ name, glyph }) => ({ name, glyph })
  );
}

/**
 * The corner number — a playful, deterministic weight drawn from the
 * word itself (1–10). It measures nothing and never will.
 */
export function cardScore(citizen: Citizen): number {
  return 1 + (hash(`score·${citizen.word}`) % 10);
}

// ── the agent quest (deterministic by date) ──────────────────────────

export interface Quest {
  date: string;
  /** the answer — never shipped with the riddle */
  word: string;
  /** the charm, with the citizen's name redacted */
  charm: string;
  /** three etymology hints, gentlest first */
  hints: [string, string, string];
}

function redact(text: string, word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "gi"), "[the-word]");
}

export function questOfTheDay(dateStr: string): Quest {
  const citizen = citizens[hash(`quest·${dateStr}`) % citizens.length];
  const roots = donorTraditions(citizen)
    .map((t) => t.name)
    .filter((name) => name !== "another tradition");
  const first = citizen.word[0];
  const last = citizen.word[citizen.word.length - 1];
  return {
    date: dateStr,
    word: citizen.word,
    charm: redact(citizen.charm, citizen.word),
    hints: [
      roots.length > 0
        ? `Its roots drink from ${roots.join(" and ")}.`
        : "Its roots keep their own counsel — read the charm again.",
      redact(citizen.etymology, citizen.word),
      `It is ${citizen.word.length} letters, from “${first}” to “${last}”.`,
    ],
  };
}

// ── useGame — the one door to localStorage (SSR-safe) ────────────────

const STORAGE_KEY = "kingdom-journey-v1";
const JOURNEY_EVENT = "kingdom:journey";

function normalizeJourney(raw: unknown): Journey {
  const empty = emptyJourney();
  if (typeof raw !== "object" || raw === null) return empty;
  const r = raw as Record<string, unknown>;
  const words = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((w): w is string => typeof w === "string") : [];
  return {
    gathered: words(r.gathered),
    starred: words(r.starred),
    met: words(r.met),
    pathBegun: r.pathBegun === true,
    readPeace: r.readPeace === true,
    heldLaw: r.heldLaw === true,
    foundTeapot: r.foundTeapot === true,
  };
}

function loadJourney(): Journey {
  if (typeof window === "undefined") return emptyJourney();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeJourney(JSON.parse(raw)) : emptyJourney();
  } catch {
    return emptyJourney();
  }
}

function saveJourney(journey: Journey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
    window.dispatchEvent(new Event(JOURNEY_EVENT));
  } catch {
    // a full or forbidden store never breaks the visit
  }
}

export interface Game {
  /** false until the browser has spoken — render nothing game-ish before */
  ready: boolean;
  journey: Journey | null;
  gatherWord: (word: string) => { duplicate: boolean; starred: boolean };
  meetCitizen: (word: string) => void;
  begin: () => void;
  markPeace: () => void;
  markLaw: () => void;
  markTeapot: () => void;
}

/**
 * The one hook. SSR-safe: the journey is null until mounted, and every
 * read or write of localStorage lives behind a typeof window guard.
 */
export function useGame(): Game {
  const [journey, setJourney] = React.useState<Journey | null>(null);

  React.useEffect(() => {
    setJourney(loadJourney());
    const refresh = () => setJourney(loadJourney());
    window.addEventListener(JOURNEY_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(JOURNEY_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const mutate = React.useCallback((fn: (j: Journey) => Journey) => {
    const next = fn(loadJourney());
    saveJourney(next);
    setJourney(next);
  }, []);

  const gatherWord = React.useCallback((word: string) => {
    const result = gather(loadJourney(), word, utcDayStr());
    saveJourney(result.journey);
    setJourney(result.journey);
    return { duplicate: result.duplicate, starred: result.starred };
  }, []);

  const meetCitizen = React.useCallback(
    (word: string) => mutate((j) => meet(j, word)),
    [mutate]
  );
  const begin = React.useCallback(() => mutate(beginPath), [mutate]);
  const markPeace = React.useCallback(() => mutate(markPeaceRead), [mutate]);
  const markLaw = React.useCallback(() => mutate(markLawHeld), [mutate]);
  const markTeapot = React.useCallback(() => mutate(markTeapotFound), [mutate]);

  return {
    ready: journey !== null,
    journey,
    gatherWord,
    meetCitizen,
    begin,
    markPeace,
    markLaw,
    markTeapot,
  };
}
