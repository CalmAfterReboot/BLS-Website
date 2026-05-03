"use client";

import { useEffect, useRef, useState } from "react";

const LERP = 0.12;

export function CustomCursor() {
  const [on, setOn] = useState(false);
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [, bump] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      dot.current.x = e.clientX;
      dot.current.y = e.clientY;
    };

    const loop = () => {
      ring.current.x += (dot.current.x - ring.current.x) * LERP;
      ring.current.y += (dot.current.y - ring.current.y) * LERP;
      bump((n) => (n + 1) % 10_000);
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!on) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 8,
          height: 8,
          left: dot.current.x,
          top: dot.current.y,
          transform: "translate(-50%, -50%)",
          background: "var(--accent)",
        }}
      />
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 32,
          height: 32,
          left: ring.current.x,
          top: ring.current.y,
          transform: "translate(-50%, -50%)",
          border: "1px solid var(--accent)",
          opacity: 0.55,
        }}
      />
    </div>
  );
}
