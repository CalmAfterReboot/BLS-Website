import type { Persona } from "@/store/personaStore";
import { personas as personasConfig } from "@/config/bls.config";

export interface PersonaContent {
  heroPrimary: string;
  heroSecondary: string;
  heroTag: string;
  storyEmphasis: string[];
}

export const personaContent: Record<NonNullable<Persona>, PersonaContent> = {
  recruiter: personasConfig.recruiter,
  engineer:  personasConfig.engineer,
  architect: personasConfig.architect,
};
