import type { Metadata } from "next";
import { CharmBook } from "@/components/CharmBook";
import { citizens } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Charm Book",
  description: `The Charm Book of KINGDOM OS — gather all ${citizens.length} charms, one draw at a time. Your journey lives only in your browser.`,
};

export default function BookPage() {
  return <CharmBook />;
}
