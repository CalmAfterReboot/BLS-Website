// ─────────────────────────────────────────────────────────────────────────────
// Re-exports from bls.config.ts in the shape previously used by components.
// Edit bls.config.ts — not this file.
// ─────────────────────────────────────────────────────────────────────────────

import { identity, availability, hero, certifications } from "@/config/bls.config";

export const personalDetails = {
  name:        `${identity.full_name} Ferencz`,
  email:       identity.email,
  phone:       identity.phone,
  location:    identity.location,
  available:   availability.open_to_work,
  workMode:    availability.work_type,
  rightToWork: availability.right_to_work,
};

export const jobTitles = hero.cycling_roles;

export const heroTagline = hero.tagline;

export const links = {
  github:         identity.github,
  githubHandle:   identity.github_handle,
  linkedin:       identity.linkedin,
  linkedinHandle: identity.linkedin_handle,
  cvPath:         identity.cv_path,
};

export const seo = {
  title:       `${identity.full_name} Ferencz — ${identity.role_title}`,
  description: identity.meta_description,
  siteUrl:     identity.portfolio,
  ogImage:     "/og-image.png",
};

export const eraFoundation = {
  label:   "ERA 01 // FOUNDATION",
  heading: "BUILT IN PRODUCTION",
  body:    "Five years of production infrastructure operations — M365, Azure, AVD, FSLogix, Hyper-V, Intune, and PowerShell daily. Terraform, GitHub Actions, and AKS through live portfolio projects. Operational depth built in production, not in a lab.",
  stats:   hero.stats.map((s) => ({ to: s.value, suffix: s.suffix, label: s.label })),
};

export const eraElevation = {
  label:   "ERA 02 // ELEVATION",
  heading: "FROM OPERATIONS TO ENGINEERING",
  body:    "50+ tenants. Full-stack infrastructure ownership across cloud, identity, networking, and virtualisation. The BLS portfolio is where that experience meets modern platform engineering.",
  certBadges: certifications.map((c) => ({
    label:   c.name,
    status:  c.status === "passed" ? "complete" : c.status === "in-progress" ? "active" : "planned",
    visible: true,
  })) as { label: string; status: "complete" | "active" | "planned"; visible: boolean }[],
};

export const eraMission = {
  label:   "ERA 03 // MISSION",
  heading: "BUILDING BLUE LAYER SYSTEMS",
  body:    "Three production-grade portfolio projects. Terraform. AKS. LiteLLM. Deployed, security-scanned, cost-governed — built to the same standard as enterprise infrastructure.",
  architectureFlow: [
    { label: "Proxmox Lab",        color: "#FF6B9D" },
    { label: "GitHub Actions",     color: "#7B4FFF" },
    { label: "Azure Landing Zone", color: "#00D4FF" },
    { label: "AKS",                color: "#00D4FF" },
    { label: "AI Gateway",         color: "#FFB347" },
  ],
};
