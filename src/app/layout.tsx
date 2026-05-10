import type { Metadata, Viewport } from "next";
import { Rajdhani, JetBrains_Mono, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Dynamic imports keep tsParticles and canvas cursor OUT of the initial bundle.
// They load after hydration — no impact on LCP or FID.
const NebulaBackground = dynamic(
  () => import("@/components/effects/NebulaBackground").then((m) => ({ default: m.NebulaBackground })),
  { ssr: false }
);
const GalaxyCursor = dynamic(
  () => import("@/components/effects/GalaxyCursor").then((m) => ({ default: m.GalaxyCursor })),
  { ssr: false }
);
const ChatWidget = dynamic(
  () => import("@/components/ui/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

const display = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bluelayersystems.com"
  ),
  title: {
    default: "Mihai Gabriel Ferencz · Blue Layer Systems",
    template: "%s · Blue Layer Systems",
  },
  description:
    "Cloud, Platform, and DevOps Engineering. Building observable, auditable infrastructure at scale.",
  openGraph: {
    title: "Mihai Gabriel Ferencz · Blue Layer Systems",
    description: "Cloud · Platform · DevOps Engineering",
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#02040A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body className="font-body bg-cosmos-void text-[var(--text-primary)]">
        <NebulaBackground />
        <GalaxyCursor />
        <main className="relative z-10">{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
