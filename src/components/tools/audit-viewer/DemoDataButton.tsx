"use client";

import { Sparkles } from "lucide-react";

export function DemoDataButton({ onLoad }: { onLoad: () => void }) {
  return (
    <button
      onClick={onLoad}
      className="inline-flex items-center gap-2 px-3 py-2 border border-accent-olive text-accent-olive font-mono text-xs uppercase tracking-wider hover:bg-accent-olive hover:text-base transition-colors"
    >
      <Sparkles size={12} />
      Load demo data
    </button>
  );
}
