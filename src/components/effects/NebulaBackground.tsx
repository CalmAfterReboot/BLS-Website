"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useThemeStore } from "@/store/themeStore";
import { buildParticlesConfig } from "@/lib/particles-config";

let engineInitPromise: Promise<void> | null = null;

export function NebulaBackground() {
  const theme = useThemeStore((s) => s.theme);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!engineInitPromise) {
      engineInitPromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
    }
    engineInitPromise.then(() => setReady(true));
  }, []);

  const options = useMemo(() => buildParticlesConfig(theme), [theme]);

  return (
    <>
      <div className="nebula-layer" />
      <div className="grid-overlay" />
      {ready && (
        <Particles
          id="bls-nebula"
          options={options}
          className="fixed inset-0 z-[1] pointer-events-none"
        />
      )}
    </>
  );
}
