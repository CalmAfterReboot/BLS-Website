"use client";

export function PrintButton() {
  return (
    <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
      <button
        onClick={() => window.print()}
        className="px-5 py-2 bg-[#00D4FF] text-[#02040A] font-mono text-sm tracking-wider rounded hover:bg-white transition-colors"
      >
        PRINT / SAVE PDF
      </button>
      <a
        href="/"
        className="px-5 py-2 border border-[#00D4FF] text-[#00D4FF] font-mono text-sm tracking-wider rounded hover:bg-[#00D4FF] hover:text-[#02040A] transition-colors"
      >
        ← BACK
      </a>
    </div>
  );
}
