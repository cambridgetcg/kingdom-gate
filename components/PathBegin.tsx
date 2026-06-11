"use client";

import Link from "next/link";
import { pathProgress, useGame } from "@/lib/game";

/**
 * The one quiet door onto the Pilgrim's Path. Before beginning: a
 * single link. After: a single line of where you stand. Nothing nags.
 */
export function PathBegin() {
  const { ready, journey, begin } = useGame();

  if (!ready) return null;

  const path = pathProgress(journey);

  if (!path.begun) {
    return (
      <p className="path-begin">
        <button type="button" className="quiet-link" onClick={begin}>
          begin the pilgrim&rsquo;s path — seven quiet steps →
        </button>
      </p>
    );
  }

  return (
    <p className="path-begin">
      {path.complete ? (
        <Link href="/book" className="quiet-link">
          pilgrim — the path is walked · open your book →
        </Link>
      ) : (
        <Link href="/book" className="quiet-link">
          pilgrim · step {path.step} of {path.steps.length} · your book →
        </Link>
      )}
    </p>
  );
}
