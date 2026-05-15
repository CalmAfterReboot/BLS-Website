"use client";

import { Eye, EyeOff } from "lucide-react";

interface Props {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export function AnonymiseToggle({ enabled, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`inline-flex items-center gap-2 px-3 py-2 border font-mono text-xs uppercase tracking-wider transition-colors ${
        enabled
          ? "border-accent-olive text-accent-olive bg-surface"
          : "border-border text-text-dim hover:border-accent-olive hover:text-accent-olive"
      }`}
    >
      {enabled ? <EyeOff size={12} /> : <Eye size={12} />}
      {enabled ? "Anonymise ON" : "Anonymise OFF"}
    </button>
  );
}
