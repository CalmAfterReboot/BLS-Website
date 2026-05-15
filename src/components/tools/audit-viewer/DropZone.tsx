"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
}

export function DropZone({ onFiles }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handleFiles = (filelist: FileList | null) => {
    if (!filelist) return;
    const files = Array.from(filelist).filter((f) => f.name.toLowerCase().endsWith(".json"));
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 cursor-pointer transition-colors ${
        over ? "border-accent-olive bg-surface" : "border-border bg-surface/40 hover:border-accent-olive"
      }`}
    >
      <Upload size={20} className="text-text-dim" />
      <p className="font-mono text-sm text-text uppercase tracking-wider">
        {"// DROP JSON FILES HERE"}
      </p>
      <p className="font-mono text-xs text-text-mute">
        or click to browse · multi-file supported · runs entirely in-browser
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}
