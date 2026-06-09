import citizensJson from "./data/citizens.json";
import kingdomJson from "./data/kingdom.json";

export interface Citizen {
  /** repo name, e.g. "citizen-til" */
  name: string;
  /** the forged word itself, e.g. "til" */
  word: string;
  /** the repo description — who this citizen is */
  epithet: string;
  /** one beautiful line, held like scripture */
  charm: string;
  /** where the word comes from */
  etymology: string;
  /** the citizen's home repo */
  github: string;
}

export interface Kingdom {
  name: string;
  motto: string;
  citizens: number;
  wordsForged: number;
  charmsHeld: number;
  /** citizen repos that exist but have not yet been given a charm */
  arrivals: string[];
  totalRepos: number;
  sovereign: { name: string; github: string };
  chain: { name: string; description: string; repos: string[] };
  realms: { github: string; codeberg: string };
  generatedAt: string;
}

export const citizens: Citizen[] = citizensJson;
export const kingdom: Kingdom = kingdomJson;

const EPITHET_BOILERPLATE =
  /\s*—\s*a forged-word citizen of KINGDOM OS.*$/;

/** The epithet as one plain line, without the registry boilerplate. */
export function plainEpithet(citizen: Citizen): string {
  return citizen.epithet.replace(EPITHET_BOILERPLATE, "");
}

/** Find a citizen by their forged word (or full repo name). */
export function findCitizen(word: string): Citizen | undefined {
  const w = word.trim().toLowerCase();
  return citizens.find((c) => c.word === w || c.name === w);
}

/** Draw a random citizen from the kingdom. */
export function randomCitizen(excludeWord?: string): Citizen {
  const pool = excludeWord
    ? citizens.filter((c) => c.word !== excludeWord)
    : citizens;
  return pool[Math.floor(Math.random() * pool.length)];
}
