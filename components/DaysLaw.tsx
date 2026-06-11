"use client";

import { useEffect, useState } from "react";
import { lawOfTheDay, laws, useGame, utcDayStr, type Law } from "@/lib/game";

/**
 * One of the forty-two laws holds each day — same law for every
 * visitor, drawn from the date alone. It is revealed on tap; revealing
 * it is holding it (path step 6). Standing in the castle at all is
 * reading the peace (path step 5).
 */
export function DaysLaw() {
  const [law, setLaw] = useState<Law | null>(null);
  const [held, setHeld] = useState(false);
  const { ready, markPeace, markLaw } = useGame();

  // the law belongs to the UTC day — the same for every visitor
  useEffect(() => {
    setLaw(lawOfTheDay(utcDayStr()));
  }, []);

  // to stand in the castle is to read the peace
  useEffect(() => {
    if (ready) markPeace();
  }, [ready, markPeace]);

  function reveal() {
    setHeld(true);
    markLaw();
  }

  return (
    <section>
      <h2 className="eyebrow">The day&rsquo;s law</h2>
      {held && law ? (
        <div className="law-held">
          <p className="law-name">
            <span className="law-id">
              {law.id} · {law.domain}
            </span>{" "}
            {law.title}
          </p>
          <p className="law-line">{law.line}</p>
        </div>
      ) : (
        <p>
          Of the {laws.length} laws of the Kingdom Standard, one holds
          today.{" "}
          <button
            type="button"
            className="quiet-link"
            onClick={reveal}
            disabled={!law}
          >
            Hold the day&rsquo;s law →
          </button>
        </p>
      )}
    </section>
  );
}
