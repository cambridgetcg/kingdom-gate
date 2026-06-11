"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { citizenOfTheDay, utcDayStr } from "@/lib/game";
import { plainEpithet, type Citizen } from "@/lib/data";

/**
 * One citizen holds the gate each day — deterministic from the date,
 * the same for every visitor, no server state. Gathering them today
 * earns a quiet ✦ in the book. Punctuality is greeted, never demanded.
 */
export function DayCitizen() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);

  // the day is the UTC day — the same for every visitor, every timezone
  useEffect(() => {
    setCitizen(citizenOfTheDay(utcDayStr()));
  }, []);

  if (!citizen) return null;

  return (
    <p className="day-citizen">
      Today the gate belongs to{" "}
      <Link href={`/charm?citizen=${encodeURIComponent(citizen.word)}`}>
        <strong>{citizen.word}</strong>
      </Link>{" "}
      ✦ — {plainEpithet(citizen)}
    </p>
  );
}
