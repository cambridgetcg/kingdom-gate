# Credits

Who made each asset, with what, and under which licence. Where an agent made something, the line says so, and
anything published under Yu's accounts carries that through. If an asset's maker isn't known, write "not recorded"
rather than guessing.

The repository is under the Apache License 2.0 (`LICENSE`).

## Assets

| Asset | Made by | Date | Tools | Notes |
|---|---|---|---|---|
| `app/icon.svg` (rainbow four-point star on `#06040f`) | an agent: commit `fda276b3` (git author "Asha Veridian", Co-Authored-By Claude Opus 4.8) | 2026-06-09 | hand-written SVG | the mark; the icon files below are cut from it, unchanged |
| Palette and rainbow hairline (`app/globals.css`) | an agent: the same commit (the one before it, `52978da2`, is the Create Next App template); later changes in `ec4ce4e8` and `21d8c769` (same author) and `dc560f7c` (git author "YOU") | 2026-06-09 | CSS by hand | |
| `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png` | an agent: Claude Code (Opus 5.5), device studio, child of session 5c4df033, by `kit/recipe.mjs` | 2026-11-10 | Chrome 157.0.8103.39 through Playwright 1.58.2 draws `app/icon.svg`; Node 22.23.1 writes the PNGs and the ICO | drawn from the mark as it is; the apple-touch icon fills the tile's transparent corners with the tile colour `#06040f` |
| `public/site.webmanifest` | the same agent, written by `kit/recipe.mjs` | 2026-11-10 | Node | name from the site's title; colours from `app/globals.css` `--bg` |
| Share card `public/og.jpg` (kingdom-os-hub `media/og-gate.jpg`, copied byte for byte) | maker not recorded | 2026-08-17 (committed to kingdom-os-hub in `b1c8e1bf`, git author cambridgetcg; a git author is not a maker) | text set with Pillow by the hub's `tools/compose-og.py` over an image-model picture, the plate `media/plates/gate-door.jpg`; which model, and who prompted it, are not recorded | Sources, read at kingdom-os-hub `98c2c0f`: (1) its `brand/CREDITS.md` (from `f8d8f2a`), line 15: the og cards are "not recorded: committed in `b1c8e1bf` (git author cambridgetcg)", made with "`tools/compose-og.py` (Pillow) sets the titles over the plates"; line 32: the plates are "not recorded: an image model, per `tools/compose-og.py` ("Type is set here, never in the image model"); which model and who prompted it are not recorded". (2) the header of `tools/compose-og.py` (from `b1c8e1b`): "Compose 1200x630 Open Graph cards. Type is set here, never in the image model."; it imports PIL and pairs `plates/gate-door.jpg` with `og-gate.jpg`. (3) its `media/README.md`: "The plates are pictures. The titles are set in `tools/compose-og.py` so the words stay exact."; `og-gate.jpg` is "ready for https://kingdom-gate.vercel.app/"; "Same licence as this repository (CC BY-SA 4.0) unless a plate says otherwise. A picture is not a claim of membership, adoption, or authority." Licence: CC BY-SA 4.0, per that README |
| Card wiring (`SHARE_CARD` in `app/layout.tsx`, its `og:image:alt` text) | an agent: Claude Code (Opus 5.5), device studio, child of session 5c4df033 | 2026-11-10 | by hand | the alt text describes the card and quotes its words |

## Fonts

| Family | File | Licence | Source | SHA-256 |
|---|---|---|---|---|
| Fraunces (opsz axis, roman and italic) | none in the repository: `next/font/google` fetches it at build time and the site serves it | SIL OFL 1.1 (upstream; not recorded in the repository) | Google Fonts | not recorded |
| Inter | as above | SIL OFL 1.1 (upstream; not recorded in the repository) | Google Fonts | not recorded |

The icon files set no type, and the share card's type was set in kingdom-os-hub, not here.

## Images and other material

| Item | Maker | Licence | Source |
|---|---|---|---|
| the share card above: Pillow text over an image-model plate (`media/plates/gate-door.jpg`) | maker not recorded, for the card and for the picture | CC BY-SA 4.0 (kingdom-os-hub `media/README.md`) | cambridgetcg/kingdom-os-hub `media/og-gate.jpg` |
