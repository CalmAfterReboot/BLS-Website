import type { Metadata } from "next";
import { Rajdhani, Share_Tech_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";
import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScanOverlay } from "@/components/ui/ScanOverlay";
import { TechMarquee } from "@/components/ui/TechMarquee";

import "@/styles/globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://bluelayersystems.com";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Blue Layer Systems — Platform & Cloud Engineering",
  description:
    "Mihai — Platform Engineer, Cloud Engineer & DevOps. Azure, Kubernetes, Terraform, CI/CD.",
  keywords: [
    "Platform Engineer",
    "Cloud Engineer",
    "DevOps",
    "Azure",
    "Kubernetes",
    "Terraform",
    "BLS",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Blue Layer Systems — Platform & Cloud Engineering",
    description:
      "Mihai — Platform Engineer, Cloud Engineer & DevOps. Azure, Kubernetes, Terraform, CI/CD.",
  },
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('bls-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${rajdhani.variable} ${shareTechMono.variable} min-h-screen font-display antialiased`}
      >
        <AppProviders>
          <ScanOverlay />
          <CustomCursor />
          <Navbar />
          <TechMarquee />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
