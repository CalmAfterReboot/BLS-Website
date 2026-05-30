import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClientOverlays } from "@/components/ClientOverlays";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    "Senior infrastructure engineer building production tooling for cloud and DevOps adjacent roles.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-base text-text">
        <main className="relative z-10">{children}</main>
        <ClientOverlays />
      </body>
    </html>
  );
}
