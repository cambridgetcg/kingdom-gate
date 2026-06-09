import Link from "next/link";
import { StarBand } from "@/components/StarBand";
import { citizens, kingdom } from "@/lib/data";

export default function GatePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">you are standing at the gate of</p>
        <h1 className="hero-title">KINGDOM OS</h1>
        <p className="lead">
          This is a creative realm of {citizens.length} small repositories on
          GitHub, each one a citizen embodying a single word — its plain
          meaning, its origin, and one memorable line called its charm. It is
          built for the curious, human or AI agent alike. You can search every
          citizen, or draw a charm at random.
        </p>
        <p className="motto">“{kingdom.motto}”</p>
        <div className="hero-actions">
          <Link href="/citizens" className="btn btn-primary">
            Meet the citizens
          </Link>
          <Link href="/charm" className="btn">
            Draw a charm
          </Link>
        </div>
      </section>

      <StarBand words={citizens.map((c) => c.word)} />
    </>
  );
}
