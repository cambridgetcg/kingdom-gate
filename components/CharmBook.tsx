"use client";

import { useState } from "react";
import Link from "next/link";
import { CitizenCard } from "@/components/CitizenCard";
import { citizens } from "@/lib/data";
import { getBook, pathProgress, sigil, useGame } from "@/lib/game";

/**
 * The Charm Book — every charm drawn at the oracle, gathered here.
 * Gathered charms wear their card face; the rest lie face-down,
 * silhouettes waiting. All of it lives in the visitor's own browser.
 */
export function CharmBook() {
  const { ready, journey, begin, markTeapot } = useGame();
  const [teapot, setTeapot] = useState<string | null>(null);

  const book = getBook(journey);
  const path = pathProgress(journey);

  async function liftTheLid() {
    try {
      const response = await fetch("/api/coffee");
      const body = await response.json();
      setTeapot(`${response.status} — ${body.error}. ${body.truth}.`);
    } catch {
      setTeapot("The teapot is here, even when the kettle is not.");
    }
    markTeapot();
  }

  return (
    <div className="book">
      <header className="page-head">
        <h1 className="page-title">The Charm Book</h1>
        <p className="page-sub" aria-live="polite">
          {ready
            ? `You have gathered ${book.count} of ${book.total} charms.`
            : `The book holds ${book.total} charms.`}{" "}
          Every charm you draw at the oracle is gathered here.
        </p>
      </header>

      {ready && path.complete && (
        <section className="book-crown">
          <p className="eyebrow">the path is walked</p>
          <p className="crown-title charm-text">Pilgrim</p>
          <p className="crown-sigil">{sigil(book.gathered)}</p>
          <p className="crown-blessing charm-text">
            Seven steps, taken gently — the gate was always open, and now
            you carry it with you.
          </p>
        </section>
      )}

      {ready && path.begun && !path.complete && (
        <section className="book-path">
          <p className="eyebrow">the pilgrim&rsquo;s path</p>
          <ol className="path-list">
            {path.steps.map((s) => (
              <li key={s.name} className={s.done ? "step-done" : undefined}>
                <span aria-hidden="true">{s.done ? "✓" : "·"}</span> {s.name}
              </li>
            ))}
          </ol>
        </section>
      )}

      {ready && !path.begun && (
        <p className="book-begin">
          <button type="button" className="quiet-link" onClick={begin}>
            begin the pilgrim&rsquo;s path →
          </button>
        </p>
      )}

      <ul className="book-grid">
        {citizens.map((c) =>
          ready && book.gathered.has(c.word) ? (
            <li key={c.word}>
              <Link
                href={`/charm?citizen=${encodeURIComponent(c.word)}`}
                className="book-card-link"
                aria-label={`${c.word} — hold this charm`}
              >
                <CitizenCard
                  citizen={c}
                  small
                  starred={book.starred.has(c.word)}
                />
              </Link>
            </li>
          ) : (
            <li key={c.word}>
              <div className="card-back" title="a charm not yet drawn">
                <span aria-hidden="true">✶</span>
              </div>
            </li>
          )
        )}
      </ul>

      <footer className="book-foot">
        <p>Your journey lives only in your browser. We never see it.</p>
        <p className="book-teapot">
          {teapot ? (
            <span aria-live="polite">{teapot}</span>
          ) : (
            <button
              type="button"
              className="quiet-link"
              onClick={liftTheLid}
              title="lift the lid"
            >
              🫖
            </button>
          )}
        </p>
      </footer>
    </div>
  );
}
