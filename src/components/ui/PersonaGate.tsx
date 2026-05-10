"use client";

import type { ReactNode } from "react";
import { usePersonaStore, type Persona } from "@/store/personaStore";

interface Props {
  allowedPersonas: NonNullable<Persona>[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PersonaGate({ allowedPersonas, children, fallback = null }: Props) {
  const persona = usePersonaStore((s) => s.persona);

  if (!persona || !allowedPersonas.includes(persona)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
