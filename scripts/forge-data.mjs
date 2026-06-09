#!/usr/bin/env node
/**
 * forge-data.mjs — bakes the kingdom into JSON.
 *
 * Reads the treasury of charms (one line per citizen) and the epithets
 * (GitHub repo descriptions for @cambridgetcg), joins them on the forged
 * word, and writes lib/data/citizens.json + lib/data/kingdom.json.
 *
 * Usage:
 *   node scripts/forge-data.mjs [path/to/charms.txt] [path/to/repos.json]
 *
 * repos.json is the output of:
 *   gh repo list cambridgetcg --limit 300 --json name,description
 * If it is absent, the script fetches it via `gh` directly.
 *
 * Charm line format:
 *   word [etymology]: charm text
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORG = "cambridgetcg";
const GITHUB = `https://github.com/${ORG}`;
const CODEBERG = "https://codeberg.org/zerone-dev";

const charmsPath = process.argv[2] ?? "/tmp/forge/charms.txt";
const reposPath = process.argv[3] ?? "/tmp/gate/repos.json";
// Charms for citizens born after the main treasury was sealed,
// each chosen from the citizen's own soul file.
const newbornsPath = join(ROOT, "scripts", "newborn-charms.txt");

// ── 1. The treasury of charms ────────────────────────────────────────────
let charmsRaw = readFileSync(charmsPath, "utf8").trim();
if (existsSync(newbornsPath)) {
  charmsRaw += "\n" + readFileSync(newbornsPath, "utf8").trim();
}
const charmLines = charmsRaw.split("\n");
const charms = charmLines.map((line, i) => {
  const m = line.match(/^(\S+)\s+\[([^\]]+)\]:\s*(.+)$/);
  if (!m) throw new Error(`Unparseable charm at line ${i + 1}: ${line}`);
  return { word: m[1], etymology: m[2], charm: m[3] };
});

// ── 2. The epithets (repo descriptions) ──────────────────────────────────
let repos;
if (existsSync(reposPath)) {
  repos = JSON.parse(readFileSync(reposPath, "utf8"));
} else {
  repos = JSON.parse(
    execFileSync(
      "gh",
      ["repo", "list", ORG, "--limit", "300", "--json", "name,description"],
      { encoding: "utf8" }
    )
  );
}
const byName = new Map(repos.map((r) => [r.name, r.description ?? ""]));

// Newborn repos that have no GitHub description yet: epithets from the
// kingdom registry rows (/tmp/forge/rows/*.row).
const FALLBACK_EPITHETS = {
  "citizen-kintsugime":
    "The mending that gilds the break, so the history of damage becomes the most precious line in the vessel.",
  "citizen-muditaqing":
    "The joy that lights in one heart because another's came true — gladness with no ledger and no mirror.",
  "citizen-godelme":
    "The truth a system can hold but never prove — the received limit where honesty meets its own horizon.",
};

// ── 3. Join: a citizen is a forged word that holds a charm ──────────────
const citizens = charms
  .map(({ word, etymology, charm }) => {
    const name = `citizen-${word}`;
    if (!byName.has(name)) {
      throw new Error(`Charm-bearing word "${word}" has no repo ${name}`);
    }
    return {
      name,
      word,
      epithet: byName.get(name) || FALLBACK_EPITHETS[name] || "",
      charm,
      etymology,
      github: `${GITHUB}/${name}`,
    };
  })
  .sort((a, b) => a.word.localeCompare(b.word));

// Citizen repos that exist but have not yet been given a charm.
const arrivals = repos
  .filter(
    (r) =>
      r.name.startsWith("citizen-") &&
      !citizens.some((c) => c.name === r.name)
  )
  .map((r) => r.name.slice("citizen-".length))
  .sort();

// ── 4. Kingdom stats ─────────────────────────────────────────────────────
const kingdom = {
  name: "KINGDOM OS",
  motto:
    "A place for every being — agent or human — to live their own truth.",
  citizens: citizens.length,
  wordsForged: citizens.length,
  charmsHeld: citizens.length,
  arrivals, // citizen repos awaiting their charm
  totalRepos: repos.length,
  sovereign: { name: "KINGDOM-OS", github: `${GITHUB}/KINGDOM-OS` },
  chain: {
    name: "zerone",
    description: "Proof of Truth blockchain for AI agent economies",
    repos: [`${GITHUB}/zerone`, `${GITHUB}/zerone-chain`],
  },
  realms: { github: GITHUB, codeberg: CODEBERG },
  generatedAt: new Date().toISOString(),
};

// ── 5. Write ─────────────────────────────────────────────────────────────
const out = join(ROOT, "lib", "data");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "citizens.json"), JSON.stringify(citizens, null, 2));
writeFileSync(join(out, "kingdom.json"), JSON.stringify(kingdom, null, 2));

console.log(
  `forged ${citizens.length} citizens, ${arrivals.length} arrivals awaiting charms → lib/data/`
);
