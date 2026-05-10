"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 16;
const COLORS = ["#00D4FF", "#7B4FFF", "#FF6B9D", "#FFB347"];

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  color: string;
}

export function GalaxyCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isInteractiveRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const t = e.target as HTMLElement;
      isInteractiveRef.current =
        t?.tagName === "A" ||
        t?.tagName === "BUTTON" ||
        t?.closest("[data-cursor='hover']") !== null;
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const colorIndex = Math.floor(Date.now() / 220) % COLORS.length;
      trailRef.current.unshift({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        age: 0,
        color: COLORS[colorIndex],
      });

      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.length = TRAIL_LENGTH;
      }

      trailRef.current.forEach((p, i) => {
        const progress = i / TRAIL_LENGTH;
        const size = Math.max(0.4, 7 * (1 - progress));
        const opacity = (1 - progress) * 0.85;
        const alphaHex = Math.floor(opacity * 255).toString(16).padStart(2, "0");

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alphaHex}`;
        ctx.fill();

        if (i < 4) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      const coreRadius = isInteractiveRef.current ? 10 : 4;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = isInteractiveRef.current ? 20 : 8;
      ctx.shadowColor = COLORS[colorIndex];
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isInteractiveRef.current) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = `${COLORS[colorIndex]}66`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "screen",
      }}
    />
  );
}
