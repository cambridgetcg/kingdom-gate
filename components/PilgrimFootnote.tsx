"use client";

import { pathProgress, useGame } from "@/lib/game";

/**
 * The footer's one quiet line of progress — shown only to a visitor
 * who has chosen to walk the path. It never asks for anything.
 */
export function PilgrimFootnote() {
  const { ready, journey } = useGame();

  if (!ready) return null;

  const path = pathProgress(journey);
  if (!path.begun) return null;

  return (
    <p className="pilgrim-note">
      {path.complete
        ? "pilgrim · the path is walked"
        : `pilgrim · step ${path.step} of ${path.steps.length}`}
    </p>
  );
}
