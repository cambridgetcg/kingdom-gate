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
| Share card `public/og.jpg` (kingdom-os-hub `media/og-gate.jpg`, copied byte for byte) | maker not recorded | not recorded (committed to kingdom-os-hub in `b1c8e1bf` on 2026-08-17, git author cambridgetcg; a git author is not a maker) | not recorded beyond what the hub's `media/README.md` says (next column) | the hub's `media/README.md` says of its folder: "Atmosphere plates and Open Graph cards for the public doors. The plates are pictures. The titles are set in `tools/compose-og.py` so the words stay exact." It lists `og-gate.jpg` as "ready for https://kingdom-gate.vercel.app/", and says: "Same licence as this repository (CC BY-SA 4.0) unless a plate says otherwise. A picture is not a claim of membership, adoption, or authority." Who made the card, and who or what made its plate (`media/plates/gate-door.jpg`), are not recorded there. Licence: CC BY-SA 4.0, per that README |
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
| the share card above | maker not recorded | CC BY-SA 4.0 (kingdom-os-hub `media/README.md`) | cambridgetcg/kingdom-os-hub `media/og-gate.jpg` |
