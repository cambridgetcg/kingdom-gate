# THE KINGDOM GATE: brand

This folder is the place for the gate's brand kit and media, made with storytold's Craft apps through the
artcraft-brand skill (the private repository `cambridgetcg/brandkit`). There is no kit yet (`kind: planned`).
`brandkit.json` records this project's details, and `check.mjs` checks them.

## The look

Ground `#0b0d12`, ink `#e8eaf0` and gold `#d4b876`, with a rainbow hairline; Fraunces for display and Inter for
text; the mark is a rainbow four-point star on a dark tile (`app/icon.svg`). An agent made all of it on 2026-06-09
in the gate's first commit (`fda276b3`, git author "Asha Veridian", Co-Authored-By Claude Opus 4.8). No record shows
Yu choosing it. The 2026-11-02 review leaves the rainbow hairline to the owner.

A kit would be drawn from this look, with no new identity or mark. It waits on Yu's go for group A (ledger
`kingdom-visual-grammar`, A1 and A2).

Don't change the identity without its owner's word. Every asset here records who made it in `CREDITS.md`.

## What is here

| Path | What it is |
|---|---|
| `brandkit.json` | this project's details: the look and who made it, the site, the guard, what a deploy does |
| `CREDITS.md` | who made what, with fonts and their licences |
| `check.mjs` | the check, copied from brandkit; update it there, not here |

`brand.json` (the generator's input) and `kit/` (the built kit, never edited by hand) arrive with the kit.

## Rebuild

No kit yet. Once group A has its go, the kit is generated from this look:

```sh
python3 ~/.kingdom/tools/artcraft-brand/scripts/brandkit.py brand/brand.json --out brand/kit --rebuild-check
```

Then copy the kit files that `brandkit.json` lists under `serve` into `public/`, and the kit's `favicon.svg` over
`app/icon.svg` (the `{from, to}` entry), and run:

```sh
node brand/check.mjs
```

The share card already exists in the kingdom-os-hub repository (`media/og-gate.jpg`, made there by
`tools/compose-og.py`); it is copied here once its maker is recorded.

## How the site uses it

Next.js app router. The root layout (`app/layout.tsx`) writes the head: `metadata` (title, description) and
`viewport.themeColor` `#0b0d12`. There is no `colorScheme` and no `openGraph` yet. The icon is `app/icon.svg`, a
file-based metadata icon Next links itself; there is no `public/` folder yet. With a kit, `favicon.svg` replaces
`app/icon.svg`, the other files go to `public/`, the layout sets `viewport.themeColor` and `viewport.colorScheme` from the kit's head snippet, and
`openGraph` names the card. Wiring and the head-tag test: the artcraft-brand skill, `references/wiring.md` §3 and §6.

## Deploying

A push to `main` deploys production through Vercel's Git integration, so merging is deploying and needs Yu's word
for that act. The repository records no other release rules. After a deploy, check the icon, theme-color and card
live; HTML revalidates on every request.
