"use client";

import dynamic from "next/dynamic";

// These are browser-only overlays (canvas cursor + chat widget). Next 15 forbids
// `ssr: false` dynamic imports in Server Components, so they live behind this
// Client Component boundary. Both are position:fixed with explicit z-index, so
// their stacking does not depend on render order.
const GalaxyCursor = dynamic(
  () => import("@/components/effects/GalaxyCursor").then((m) => ({ default: m.GalaxyCursor })),
  { ssr: false }
);
const ChatWidget = dynamic(
  () => import("@/components/ui/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <GalaxyCursor />
      <ChatWidget />
    </>
  );
}
