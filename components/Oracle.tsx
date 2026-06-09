"use client";

import { useState } from "react";
import { CharmText } from "@/components/CharmText";
import {
  citizens,
  plainEpithet,
  randomCitizen,
  type Citizen,
} from "@/lib/data";

function setUrl(word: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("citizen", word);
  // native history integration — no server round-trip per draw
  window.history.replaceState(null, "", url.toString());
  document.title = `${word} — a charm from the kingdom · THE KINGDOM GATE`;
}

export function Oracle({ initial }: { initial: Citizen }) {
  const [citizen, setCitizen] = useState<Citizen>(initial);
  const [copied, setCopied] = useState(false);

  function draw() {
    const next = randomCitizen(citizen.word);
    setCitizen(next);
    setUrl(next.word);
    setCopied(false);
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("citizen", citizen.word);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the address bar already holds the link
    }
  }

  return (
    <div className="oracle">
      <p className="eyebrow">the oracle</p>
      <p className="oracle-sub">
        One line, held by one citizen, drawn at random.
      </p>
      <blockquote className="oracle-charm charm-text">
        <CharmText text={citizen.charm} />
      </blockquote>
      <p className="oracle-attrib">
        held by <strong>{citizen.word}</strong>, one of {citizens.length}{" "}
        citizens — {plainEpithet(citizen)}
      </p>
      <p className="oracle-ety">{citizen.etymology}</p>
      <div className="oracle-actions">
        <button type="button" className="btn btn-primary" onClick={draw}>
          Draw another
        </button>
        <button type="button" className="quiet-link" onClick={copyLink}>
          {copied ? "link copied ✓" : "copy link to this charm"}
        </button>
      </div>
      <p className="oracle-repo">
        <a href={citizen.github} target="_blank" rel="noopener noreferrer">
          visit {citizen.name} on GitHub ↗
        </a>
      </p>
    </div>
  );
}
