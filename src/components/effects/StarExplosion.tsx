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
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef      = useRef<number>(0);
  const lastMoveRef = useRef({ x: -999, y: -999, t: 0 });
  const themeRef    = useRef(useThemeStore.getState().theme);

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
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRing = (
      cx: number,
      cy: number,
      count: number,
      minDist: number,
      maxDist: number,
      speed: number,
      lifetime: number,
    ) => {
      const colors = THEME_COLORS[themeRef.current] ?? THEME_COLORS.nebula;

      for (let i = 0; i < count; i++) {
        const angle    = Math.random() * Math.PI * 2;
        const dist     = minDist + Math.random() * (maxDist - minDist);
        const x        = cx + Math.cos(angle) * dist;
        const y        = cy + Math.sin(angle) * dist;

        const driftAngle = angle + (Math.random() - 0.5) * 1.4;
        const spd        = speed * (0.4 + Math.random() * 0.6);

        particlesRef.current.push({
          x,
          y,
          vx:    Math.cos(driftAngle) * spd,
          vy:    Math.sin(driftAngle) * spd,
          size:  1.5 + Math.random() * 3.5,
          color: pick(colors),
          life:  1,
          decay: 1 / (lifetime * 60),
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx  = e.clientX - lastMoveRef.current.x;
      const dy  = e.clientY - lastMoveRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 18 && now - lastMoveRef.current.t > 150) {
        spawnRing(e.clientX, e.clientY, 6, 80, 200, 22, 1.6);
        spawnRing(e.clientX, e.clientY, 4, 200, 400, 10, 2.4);
        lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnRing(e.clientX, e.clientY, 14, 100, 280, 45, 1.2);
      spawnRing(e.clientX, e.clientY, 8,  280, 500, 14, 2.8);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click",     onClick);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        const alpha       = Math.pow(p.life, 1.8) * 0.8;
        const currentSize = p.size * Math.pow(p.life, 0.35);

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, currentSize), 0, Math.PI * 2);
        ctx.fillStyle =
          p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");

        ctx.shadowBlur  = currentSize * 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x  += p.vx / 60;
        p.y  += p.vy / 60;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life -= p.decay;
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click",     onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        45,
        mixBlendMode:  "screen",
      }}
    />
  );
}
