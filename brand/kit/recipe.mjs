#!/usr/bin/env node
// The gate's icon files, cut from the mark as it is: app/icon.svg, read only, never changed.
//
//   PLAYWRIGHT=<path to playwright's index.mjs> CHROME=<path to a Chrome binary> node brand/kit/recipe.mjs [OUT]
//
// The mark draws its star with a linear gradient. The artcraft-brand generator refuses gradients in a mark
// (VectorCraft paints them black), so this hand-made recipe draws the SVG with Chrome instead: the same engine
// that draws it in a browser tab. Each size is drawn onto a canvas at that size, read back as pixels, and written
// as PNG by this script (zlib from Node, no other dependency). Same Chrome, same bytes.
//
// It writes into OUT (default brand/kit/out/, which git ignores), never anywhere else:
//   favicon.ico            16, 32 and 48 px frames (PNG inside), for /favicon.ico
//   apple-touch-icon.png   180 px, opaque RGB: the tile colour fills the corners the mark leaves transparent
//   icon-192.png, icon-512.png   the mark as drawn, transparent corners kept
//   site.webmanifest       names the two icons; colours are the page's ground (app/globals.css --bg)
// Copy them to public/ (brand/README.md, "Rebuild"); `node brand/check.mjs` then compares them byte for byte.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = resolve(process.argv[2] ?? join(ROOT, "brand/kit/out"));
const MARK = join(ROOT, "app/icon.svg");
const GROUND = "#0b0d12"; // app/globals.css --bg, and viewport.themeColor in app/layout.tsx

const svg = readFileSync(MARK, "utf8");
// The tile the mark sits on; the apple-touch icon fills its transparent corners with it.
const tile = /<rect width="64" height="64" rx="14" fill="(#[0-9a-f]{6})"\/>/i.exec(svg)?.[1];
if (!tile) throw new Error("app/icon.svg no longer has the 64 px tile this recipe expects: read it before cutting icons");

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage();
const draw = async (size, fill) => Buffer.from(await page.evaluate(async ({ text, size, fill }) => {
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${btoa(text)}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(0, 0, size, size); }
  ctx.drawImage(img, 0, 0, size, size);
  return Array.from(ctx.getImageData(0, 0, size, size).data);
}, { text: svg, size, fill }));
const version = browser.version();

// PNG: 8-bit RGBA (colour type 6) or RGB (2), one unfiltered scanline per row.
function png(rgba, size, alpha) {
  const channels = alpha ? 4 : 3;
  const raw = Buffer.alloc((size * channels + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = y * (size * channels + 1);
    for (let x = 0; x < size; x++) {
      const from = (y * size + x) * 4;
      if (!alpha && rgba[from + 3] !== 255) throw new Error(`pixel ${x},${y} is not opaque`);
      rgba.copy(raw, row + 1 + x * channels, from, from + channels);
    }
  }
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length);
    head.write(type, 4, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])));
    return Buffer.concat([head, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, alpha ? 6 : 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ICO holding PNG frames (Windows Vista and later, every current browser).
function ico(frames) {
  const dir = Buffer.alloc(6 + 16 * frames.length);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(frames.length, 4);
  let offset = dir.length;
  frames.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i;
    dir.writeUInt8(size, at);
    dir.writeUInt8(size, at + 1);
    dir.writeUInt16LE(1, at + 4);
    dir.writeUInt16LE(32, at + 6);
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([dir, ...frames.map((f) => f.data)]);
}

const files = new Map();
files.set("favicon.ico", ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: png(await draw(size), size, true) })))));
files.set("apple-touch-icon.png", png(await draw(180, tile), 180, false));
files.set("icon-192.png", png(await draw(192), 192, true));
files.set("icon-512.png", png(await draw(512), 512, true));
await browser.close();
files.set("site.webmanifest", `${JSON.stringify({
  id: "/",
  name: "THE KINGDOM GATE",
  start_url: "/",
  scope: "/",
  display: "browser",
  background_color: GROUND,
  theme_color: GROUND,
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
}, null, 2)}\n`);

mkdirSync(OUT, { recursive: true });
console.log(`kingdom-gate icons from app/icon.svg (sha256 ${createHash("sha256").update(svg).digest("hex")})`);
console.log(`drawn by Chrome ${version}; tile ${tile}; ground ${GROUND}; into ${OUT}`);
for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data);
  console.log(`  ${name.padEnd(22)} ${String(data.length).padStart(7)} bytes  sha256 ${createHash("sha256").update(data).digest("hex")}`);
}
