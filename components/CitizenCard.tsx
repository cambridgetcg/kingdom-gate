import { CharmText } from "@/components/CharmText";
import { cardScore, cardTier, donorTraditions } from "@/lib/game";
import type { Citizen } from "@/lib/data";

/**
 * The card treatment — the TCG nod, tasteful. The word is the card
 * name, the tier is the frame (Core warm, Specialized cool), the donor
 * traditions are small suit-like glyphs, the charm is the flavor text,
 * and the score sits in the corner. Pure CSS; a gentle hover lift only,
 * and none at all under reduced motion.
 */
export function CitizenCard({
  citizen,
  small = false,
  starred = false,
}: {
  citizen: Citizen;
  /** the book's grid wears the small face */
  small?: boolean;
  /** gathered on its own day — a quiet ✦ */
  starred?: boolean;
}) {
  const tier = cardTier(citizen);
  const glyphs = donorTraditions(citizen);
  return (
    <div
      className={`citizen-card tier-${tier.toLowerCase()}${
        small ? " card-small" : ""
      }`}
    >
      <div className="card-head">
        <span className="card-name">
          {citizen.word}
          {starred && (
            <span className="card-star" title="gathered on its own day">
              {" "}
              ✦
            </span>
          )}
        </span>
        <span
          className="card-score"
          title="a playful weight drawn from the word — it measures nothing"
        >
          {cardScore(citizen)}
        </span>
      </div>
      <p className="card-glyphs">
        {glyphs.map((g) => (
          <span key={g.name} title={g.name}>
            {g.glyph}
          </span>
        ))}
      </p>
      <blockquote className="card-flavor charm-text">
        <CharmText text={citizen.charm} />
      </blockquote>
      <p className="card-tier">{tier}</p>
    </div>
  );
}
