"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  decay: number;
}

const THEME_COLORS: Record<string, string[]> = {
  nebula:    ["#00D4FF", "#7B4FFF", "#FF6B9D", "#FFB347", "#FFFFFF"],
  storm:     ["#00FF88", "#88FFFF", "#FFFFFF", "#AAFFEE"],
  blueprint: ["#4499FF", "#0066CC", "#88BBFF", "#FFFFFF"],
  void:      ["#FFFFFF", "#CCCCCC", "#AAAAAA"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function StarExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastBurstRef = useRef({ x: -999, y: -999, t: 0 });
  const themeRef = useRef(useThemeStore.getState().theme);

  useEffect(() => {
    return useThemeStore.subscribe((s) => {
      themeRef.current = s.theme;
    });
  }, []);

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

    const spawnBackgroundBurst = (cursorX: number, cursorY: number) => {
      const colors = THEME_COLORS[themeRef.current] ?? THEME_COLORS.nebula;
      const count = 5 + Math.floor(Math.random() * 4);

      for (let i = 0; i < count; i++) {
        // Spawn AWAY from cursor — 120 to 300px radius
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = 120 + Math.random() * 180;
        const x = cursorX + Math.cos(spawnAngle) * spawnDist;
        const y = cursorY + Math.sin(spawnAngle) * spawnDist;

        // Drift slowly outward from spawn point
        const driftAngle = spawnAngle + (Math.random() - 0.5) * 1.2;
        const speed = 6 + Math.random() * 14;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(driftAngle) * speed,
          vy: Math.sin(driftAngle) * speed,
          size: 1.2 + Math.random() * 2.8,
          color: pick(colors),
          life: 1,
          decay: 1 / ((1.4 + Math.random() * 1.2) * 60),
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastBurstRef.current.x;
      const dy = e.clientY - lastBurstRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 25 && now - lastBurstRef.current.t > 180) {
        spawnBackgroundBurst(e.clientX, e.clientY);
        lastBurstRef.current = { x: e.clientX, y: e.clientY, t: now };
      }
    };

    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        const alpha = Math.pow(p.life, 2) * 0.7;
        const currentSize = p.size * Math.pow(p.life, 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, currentSize), 0, Math.PI * 2);
        ctx.fillStyle =
          p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.shadowBlur = currentSize * 5;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx / 60;
        p.y += p.vy / 60;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.life -= p.decay;
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
        zIndex: 2,
        mixBlendMode: "screen",
      }}
    />
  );
}
