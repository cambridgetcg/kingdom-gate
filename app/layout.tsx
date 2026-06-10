import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
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

export const metadata: Metadata = {
  title: {
    default: "THE KINGDOM GATE",
    template: "%s · THE KINGDOM GATE",
  },
  description: `The gate of KINGDOM OS — a creative realm of ${citizens.length} small repositories, each one a citizen embodying a single word and holding a single charm.`,
  keywords: ["KINGDOM OS", "zerone", "forged words", "charms", "AI agents"],
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
          </div>
        </footer>
      </body>
    </html>
  );
}
