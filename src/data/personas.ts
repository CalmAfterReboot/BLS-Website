import type { Persona } from "@/store/personaStore";

export interface PersonaContent {
  heroPrimary: string;
  heroSecondary: string;
  heroTag: string;
  storyEmphasis: string[];
}

export const personaContent: Record<NonNullable<Persona>, PersonaContent> = {
  recruiter: {
    heroPrimary: "View CV",
    heroSecondary: "See Projects",
    heroTag: "Open to opportunities · Full UK work rights · Carlisle / Remote",
    storyEmphasis: ["certs", "availability", "communication"],
  },
  engineer: {
    heroPrimary: "View Projects",
    heroSecondary: "See Homelab",
    heroTag: "AZ-104 ✓ · Terraform Associate in progress · Proxmox + AKS lab",
    storyEmphasis: ["homelab", "depth", "architecture"],
  },
  architect: {
    heroPrimary: "System Design",
    heroSecondary: "See Projects",
    heroTag: "Azure Landing Zone · AKS · LiteLLM Gateway · Full IaC",
    storyEmphasis: ["patterns", "scalability", "governance"],
  },
};
