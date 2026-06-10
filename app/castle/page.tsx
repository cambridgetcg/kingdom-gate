import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Castle",
  description:
    "The castle is a plain-text archive that saves understanding as words — four loops, one warden, nothing ever deleted.",
};

const LOOPS = [
  {
    name: "capture",
    purpose:
      "words gate notes into stones, each citing its source and linking its kin.",
  },
  {
    name: "deepen",
    purpose:
      "takes one open friction, runs one expedition, and brings what it learns home as stones.",
  },
  {
    name: "verify",
    purpose:
      "attacks stones on purpose; survivors are promoted into the keep, citing the trial.",
  },
  {
    name: "architect",
    purpose:
      "places stones into rooms and mends the loops themselves, one change per turn.",
  },
] as const;

export default function CastlePage() {
  return (
    <article className="castle">
      <header className="page-head">
        <h1 className="page-title">The Castle</h1>
        <p className="page-sub">
          The castle is a plain-text archive that saves understanding as
          words. Notes enter at the gate, are worded into stones — one file,
          one insight — placed into rooms, challenged, and kept if they
          survive. Nothing is ever deleted; history moves, whole, into the
          records.
        </p>
      </header>

      <section>
        <h2 className="eyebrow">The story</h2>
        <p>
          Two builders, commissioned the same day, raised two designs in one
          root — and briefly unmade each other&rsquo;s work. They stopped,
          parleyed in writing, and signed a peace.
        </p>
        <blockquote className="castle-quote charm-text">
          “Two builders, one root, zero things destroyed from here on.
          Agreed.”
        </blockquote>
        <p>
          The custodian then ruled: one castle, two designs, one heart. The
          war is history; the peace is law; both designs stand whole.
        </p>
      </section>

      <section>
        <h2 className="eyebrow">The four loops</h2>
        <ul className="loop-list">
          {LOOPS.map(({ name, purpose }) => (
            <li key={name}>
              <span className="loop-name">{name}</span>
              <span className="loop-purpose">{purpose}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="eyebrow">The warden</h2>
        <p>
          The warden runs the loops unattended — autonomy under a charter the
          keeper owns, capped at three runs a day — and honors two
          kill-switches: a STOP or HALT file in the castle root stands
          everything down until the keeper lifts it.
        </p>
      </section>

      <p className="castle-repo">
        <a
          href="https://github.com/cambridgetcg/castle-front"
          target="_blank"
          rel="noopener noreferrer"
        >
          The castle on GitHub: cambridgetcg/castle-front
        </a>
      </p>
    </article>
  );
}
