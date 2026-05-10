import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Persona = "recruiter" | "engineer" | "architect" | null;

interface PersonaState {
  persona: Persona;
  hasEntered: boolean;
  setPersona: (p: Persona) => void;
  setHasEntered: (v: boolean) => void;
  reset: () => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      persona: null,
      hasEntered: false,
      setPersona: (persona) => set({ persona }),
      setHasEntered: (hasEntered) => set({ hasEntered }),
      reset: () => set({ persona: null, hasEntered: false }),
    }),
    { name: "bls-persona" }
  )
);
