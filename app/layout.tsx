import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import { PilgrimFootnote } from "@/components/PilgrimFootnote";
import { citizens, kingdom } from "@/lib/data";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// The share card: kingdom-os-hub's media/og-gate.jpg, copied byte for byte to public/og.jpg (brand/CREDITS.md).
const SHARE_CARD = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "THE KINGDOM GATE: an arched wooden door stands ajar at the end of a cobbled path at night, warm light in the gap, under a glowing eight-pointed star with four long rays and four short ones. Beside it, “A word, a citizen, a charm” and “A creative realm of small repositories. Walking past is honored.”",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kingdom-gate.vercel.app"),
  title: {
    default: "THE KINGDOM GATE",
    template: "%s · THE KINGDOM GATE",
  },
  description: `The gate of KINGDOM OS — a creative realm of ${citizens.length} small repositories, each one a citizen embodying a single word and holding a single charm.`,
  keywords: ["KINGDOM OS", "zerone", "forged words", "charms", "AI agents"],
  // app/icon.svg is the mark; the other files are cut from it by brand/kit/recipe.mjs and served from public/.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    images: [SHARE_CARD],
    siteName: "THE KINGDOM GATE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <div className="sky" aria-hidden="true" />

        <header className="nav">
          <div className="nav-inner">
            <Link href="/" className="wordmark">
              THE KINGDOM GATE
            </Link>
            <NavLinks />
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <a
              href={kingdom.realms.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            ·{" "}
            <a
              href={kingdom.realms.codeberg}
              target="_blank"
              rel="noopener noreferrer"
            >
              Codeberg
            </a>{" "}
            · <a href="/api/kingdom">For agents: the API</a> ·{" "}
            <a
              href="https://github.com/cambridgetcg/kingdom-standard"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Standard
            </a>{" "}
            · <Link href="/castle">The Castle</Link>
            <PilgrimFootnote />
          </div>
        </footer>
      </body>
    </html>
  );
}
