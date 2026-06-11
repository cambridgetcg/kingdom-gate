"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { plainEpithet, type Citizen } from "@/lib/data";
import { CitizenCard } from "@/components/CitizenCard";
import { useGame } from "@/lib/game";

export function CitizenIndex({ citizens }: { citizens: Citizen[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { meetCitizen } = useGame();

  // Autofocus only where a keyboard is the natural instrument (desktop).
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return citizens;
    return citizens.filter(
      (c) =>
        c.word.toLowerCase().includes(q) ||
        c.epithet.toLowerCase().includes(q) ||
        c.etymology.toLowerCase().includes(q) ||
        c.charm.toLowerCase().includes(q)
    );
  }, [citizens, query]);

  return (
    <div>
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        placeholder="Search a word, a meaning, a line of a charm…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search citizens"
      />

      <p className="result-count" aria-live="polite">
        {shown.length === citizens.length
          ? `${citizens.length} citizens`
          : `${shown.length} of ${citizens.length} citizens`}
      </p>

      {shown.length === 0 ? (
        <p className="no-results">
          No citizen answers to that yet. Perhaps the word is still waiting to
          be forged.
        </p>
      ) : (
        <ul className="citizen-list">
          {shown.map((c) => (
            <li key={c.word}>
              <details
                className="citizen-entry"
                id={c.word}
                onToggle={(e) => {
                  // opening a card is meeting the citizen — path step 2
                  if (e.currentTarget.open) meetCitizen(c.word);
                }}
              >
                <summary>
                  <span className="citizen-word">{c.word}</span>
                  <span className="citizen-meaning">{plainEpithet(c)}</span>
                </summary>
                <div className="citizen-body">
                  <CitizenCard citizen={c} />
                  <p className="citizen-ety">{c.etymology}</p>
                  <div className="citizen-links">
                    <Link href={`/charm?citizen=${encodeURIComponent(c.word)}`}>
                      hold this charm →
                    </Link>
                    <a href={c.github} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
