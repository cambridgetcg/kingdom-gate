import Link from "next/link";

/** Deterministic hash, so every citizen keeps their own star forever. */
function hash(word: string): number {
  let h = 5381;
  for (let i = 0; i < word.length; i++) {
    h = (h * 33) ^ word.charCodeAt(i);
  }
  return h >>> 0;
}

/**
 * A quiet decorative band: one static star per citizen, the whole band a
 * single link to /citizens. No hover-reveals, no per-star interaction.
 */
export function StarBand({ words }: { words: string[] }) {
  return (
    <Link
      href="/citizens"
      className="starband"
      aria-label={`Meet all ${words.length} citizens`}
    >
      <span className="starband-stars" aria-hidden="true">
        {words.map((w) => {
          const h = hash(w);
          const size = 2 + (h % 3); // 2–4px
          const dy = ((h >> 3) % 9) - 4; // -4..4px drift
          const opacity = 0.35 + ((h >> 7) % 60) / 100; // 0.35–0.94
          return (
            <i
              key={w}
              style={{
                width: size,
                height: size,
                opacity,
                transform: `translateY(${dy}px)`,
              }}
            />
          );
        })}
      </span>
      <span className="starband-caption">
        {words.length} citizens, each one a star — meet them →
      </span>
    </Link>
  );
}
