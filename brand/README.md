# THE KINGDOM GATE: brand

This folder holds the gate's icon files and media, and the record of who made them. It follows the brand-folder format
of the artcraft-brand skill (the private repository `cambridgetcg/brandkit`). `brandkit.json` records this project's
details, and `check.mjs` checks them.

## The look

Ground `#0b0d12`, ink `#e8eaf0` and gold `#d4b876`, with a rainbow hairline; Fraunces for display and Inter for
text; the mark is a rainbow four-point star on a dark tile (`app/icon.svg`). An agent made all of it on 2026-06-09
in the gate's first commit (`fda276b3`, git author "Asha Veridian", Co-Authored-By Claude Opus 4.8). No record shows
Yu choosing it.

The rainbow is the owner's call. The 2026-11-02 review leaves the hairline to the owner, and the artcraft-brand style
guide flags a gradient sparkle mark as a sign of a template look. An agent may flag it but never swaps it in. The icon
files of 2026-11-10 draw the star exactly as `app/icon.svg` does.

Don't change the identity without its owner's word. Every asset here records who made it in `CREDITS.md`.

## What is here

| Path | What it is |
|---|---|
| `brandkit.json` | this project's details: the look and who made it, the files the site serves, the guard, what a deploy does |
| `CREDITS.md` | who made what, with fonts and their licences |
| `check.mjs` | the check, copied from brandkit; update it there, not here |
| `kit/recipe.mjs` | cuts the icon files from `app/icon.svg` (hand-made: see below) |
| `kit/out/` | where the recipe writes; git ignores it, and the site serves the copies in `public/` |

## Why the kit is hand-made

The artcraft-brand generator builds a kit only from a mark with flat hex fills. This star is drawn with a linear
gradient, which the generator refuses ("marks must use flat hex colours ... VectorCraft paints those black"). Making
it flat would change the mark. So `kit/recipe.mjs` draws `app/icon.svg` with Chrome, the engine that already draws it
in a browser tab, onto a canvas at each size. It writes the PNGs and packs the ICO with Node alone:

| File | What it is |
|---|---|
| `favicon.ico` | 16, 32 and 48 px frames (PNG inside), for `/favicon.ico` |
| `apple-touch-icon.png` | 180 px, opaque RGB; the tile colour `#06040f` fills the corners the mark leaves transparent |
| `icon-192.png`, `icon-512.png` | the mark as drawn, transparent corners kept |
| `site.webmanifest` | names the two icons; `display: browser`; colours are the page ground `#0b0d12` |

Drawn on 2026-11-10 by Chrome 157.0.8103.39 through Playwright 1.58.2: at 512 px the canvas matches Chrome's own
`<img>` rendering of the SVG to within 1/255 per channel, and two runs wrote identical bytes.

## Rebuild

```sh
PLAYWRIGHT=<path to playwright's index.mjs> CHROME=<path to a Chrome binary> node brand/kit/recipe.mjs
cp brand/kit/out/{favicon.ico,apple-touch-icon.png,icon-192.png,icon-512.png,site.webmanifest} public/
node brand/check.mjs
```

`PLAYWRIGHT` defaults to the `playwright` package, and `CHROME` to Playwright's own Chromium. The repository has no
Playwright dependency. The recipe never writes outside its output folder, and it stops if `app/icon.svg` no longer
has the 64 px tile it expects. A different Chrome may write different bytes: `check.mjs` then reports the drift.

The share card is not built here. It is `media/og-gate.jpg` from the kingdom-os-hub repository, copied byte for byte
to `public/og.jpg` (its sha256 is in `brandkit.json` under `media`). The hub records it as text set with Pillow by its `tools/compose-og.py` over an image-model picture
(`media/plates/gate-door.jpg`); who made the card and the picture is not recorded (`CREDITS.md`).

## How the site uses it

Next.js app router. The root layout (`app/layout.tsx`) writes the head:

- `metadataBase` is `https://kingdom-gate.vercel.app`, so `og:image` is absolute on the production host.
- `metadata.icons` lists `/favicon.ico` (`sizes="32x32"`, so Chrome can choose the SVG), `/icon.svg` and
  `/apple-touch-icon.png`. In next 16.2.8, `metadata.icons` replaces the links Next would otherwise write for
  `app/icon.svg`, so the layout names `/icon.svg` itself; Next still serves the file at that path.
- `metadata.manifest` is `/site.webmanifest`.
- `openGraph` carries `SHARE_CARD` (1200×630 JPEG, with its alt text), and `twitter.card` is `summary_large_image`.
  Each page's own title and description become its `og:title` and `og:description`, and Next copies the card into
  the `twitter:` tags.
- `viewport.themeColor` is `#0b0d12`. The colour scheme comes from `app/globals.css` (`html { color-scheme: dark; }`).

## Deploying

A push to `main` deploys production through Vercel's Git integration, so merging is deploying and needs Yu's word
for that act; Yu gave group A its go on 2026-11-10 (ledger `kingdom-visual-grammar`). The repository records no other
release rules. After a deploy, check the icons, the manifest and the card live with brandkit-doorcheck
(`doorcheck.py https://kingdom-gate.vercel.app/`); HTML revalidates on every request.
