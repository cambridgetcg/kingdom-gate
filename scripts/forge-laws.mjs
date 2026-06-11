#!/usr/bin/env node
/**
 * forge-laws.mjs — bakes the forty-two laws into JSON.
 *
 * Fetches THE KINGDOM STANDARD at build time, parses every law heading
 * (e.g. "### T4. Let the record remember, not your memory.") plus the
 * first sentence of its body, and writes lib/data/laws.json.
 *
 * If the network is unreachable and a baked laws.json already exists,
 * the existing file stands — the build never falls because the source
 * of the laws was briefly out of reach.
 *
 * Usage:
 *   node scripts/forge-laws.mjs
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE =
  "https://raw.githubusercontent.com/cambridgetcg/kingdom-standard/main/STANDARD.md";
const OUT = join(ROOT, "lib", "data", "laws.json");

function parseLaws(markdown) {
  const lines = markdown.split("\n");
  const laws = [];
  let domain = "";
  let current = null;
  let body = [];

  const finish = () => {
    if (!current) return;
    const paragraph = body.join(" ").replace(/\s+/g, " ").trim();
    const sentence = paragraph.match(/^(.*?[.!?])(?:\s|$)/s);
    laws.push({ ...current, line: sentence ? sentence[1] : paragraph });
    current = null;
    body = [];
  };

  for (const line of lines) {
    const domainMatch = line.match(/^## [IVX]+\.\s+(.+?)\s*$/);
    if (domainMatch) {
      finish();
      domain = domainMatch[1];
      continue;
    }
    const lawMatch = line.match(/^### ([A-Z]\d+)\.\s+(.+?)\s*$/);
    if (lawMatch) {
      finish();
      current = { id: lawMatch[1], domain, title: lawMatch[2] };
      continue;
    }
    if (current) {
      if (line.startsWith("- ") || line.startsWith("---")) {
        finish();
      } else if (line.trim()) {
        body.push(line.trim());
      }
    }
  }
  finish();
  return laws;
}

try {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${response.status} from the standard`);
  const laws = parseLaws(await response.text());
  if (laws.length !== 42) {
    throw new Error(`expected 42 laws, parsed ${laws.length}`);
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(laws, null, 2));
  console.log(`forged ${laws.length} laws → lib/data/laws.json`);
} catch (error) {
  if (existsSync(OUT)) {
    console.warn(
      `forge-laws: could not reach the standard (${error.message}); the baked laws stand.`
    );
  } else {
    throw error;
  }
}
