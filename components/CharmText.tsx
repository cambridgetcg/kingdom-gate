import { Fragment } from "react";

/** Presentation-only smartening: curly quotes and apostrophes. */
function smarten(text: string): string {
  return text
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/'/g, "’");
}

/**
 * Renders a charm the way it was written. Charms occasionally carry
 * light emphasis marked with *asterisks*; inside our italic scripture
 * style, emphasis is rendered upright (the traditional inversion).
 * Straight quotes are smartened for display only — the API always
 * returns the charm exactly as it lives in the treasury.
 */
export function CharmText({ text }: { text: string }) {
  const parts = smarten(text).split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
