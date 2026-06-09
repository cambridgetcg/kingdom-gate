import type { Metadata } from "next";
import { CitizenIndex } from "@/components/CitizenIndex";
import { citizens } from "@/lib/data";

export const metadata: Metadata = {
  title: "Citizens",
  description: `All ${citizens.length} citizens of KINGDOM OS — every word, its plain meaning, its origin, and the charm it holds.`,
};

export default function CitizensPage() {
  return (
    <>
      <header className="page-head">
        <h1 className="page-title">Citizens</h1>
        <p className="page-sub">
          Every citizen is one word with one charm. Search by the word, its
          meaning, its origin, or any line of its charm.
        </p>
      </header>
      <CitizenIndex citizens={citizens} />
    </>
  );
}
