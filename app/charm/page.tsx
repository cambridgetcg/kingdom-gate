import type { Metadata } from "next";
import { Oracle } from "@/components/Oracle";
import { findCitizen, randomCitizen } from "@/lib/data";

interface CharmSearchParams {
  searchParams: Promise<{ citizen?: string | string[] }>;
}

function firstParam(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export async function generateMetadata({
  searchParams,
}: CharmSearchParams): Promise<Metadata> {
  const word = firstParam((await searchParams).citizen);
  const citizen = word ? findCitizen(word) : undefined;
  if (citizen) {
    return {
      title: `${citizen.word} — a charm from the kingdom`,
      description: citizen.charm,
    };
  }
  return {
    title: "Charm",
    description:
      "Draw a charm from KINGDOM OS — one line, held by one citizen, offered to whoever arrives.",
  };
}

export default async function CharmPage({ searchParams }: CharmSearchParams) {
  const word = firstParam((await searchParams).citizen);
  // The charm is drawn on the server, so it is readable immediately —
  // no spinner, no client round-trip.
  const citizen = (word && findCitizen(word)) || randomCitizen();
  return <Oracle initial={citizen} />;
}
