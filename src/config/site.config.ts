// ============================================================
// SITE CONFIG — Single source of truth for all editable content
// Edit values here. Changes reflect across the entire site.
// Do NOT edit the linked component files directly.
// ============================================================

// ------------------------------------------------------------
// PERSONAL DETAILS
// Links to: src/components/sections/Hero.tsx
//           src/components/sections/Contact.tsx
//           src/app/cv/page.tsx
// ------------------------------------------------------------
export const personalDetails = {

  // Full name — displayed as the large heading in the Hero section
  // Links to: src/components/sections/Hero.tsx (NAME constant)
  // Note: rendered uppercase in the component
  name: "Mihai Ferencz",

  // Contact email — displayed in Contact section social links,
  // Contact quick-info panel, CV page header, and used as the
  // delivery address in the contact form API route
  // Links to: src/components/sections/Contact.tsx
  //           src/app/cv/page.tsx
  //           src/app/api/contact/route.ts
  email: "mihai.ferencz@bluelayersystems.com",

  // Phone number — displayed in Hero status bar and Contact quick-info panel
  // Links to: src/components/sections/Hero.tsx
  //           src/components/sections/Contact.tsx
  phone: "07436 784212",

  // Current location — displayed in Hero status bar and Contact quick-info panel
  // Links to: src/components/sections/Hero.tsx
  //           src/components/sections/Contact.tsx
  location: "Carlisle, UK",

  // Availability status — controls green pulsing dot and AVAILABLE label in Hero
  // Links to: src/components/sections/Hero.tsx
  available: true,

  // Work mode — displayed in Hero status bar and Contact quick-info panel
  // Links to: src/components/sections/Hero.tsx
  //           src/components/sections/Contact.tsx
  workMode: "Remote / Hybrid",

  // Right to work statement — displayed in Hero status bar and Contact quick-info panel
  // Links to: src/components/sections/Hero.tsx
  //           src/components/sections/Contact.tsx
  rightToWork: "Full UK Right to Work",
};

// ------------------------------------------------------------
// TYPEWRITER ROTATION — Job titles cycling in Hero
// Links to: src/components/sections/Hero.tsx (ROLES constant)
// Add, remove, or reorder titles here.
// Each title is displayed in sequence with a typing animation.
// ------------------------------------------------------------
export const jobTitles = [
  "Platform Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Site Reliability Engineer",
];

// ------------------------------------------------------------
// HERO TAGLINE
// Links to: src/components/sections/Hero.tsx
// Single line displayed below the typewriter, above the status bar
// ------------------------------------------------------------
export const heroTagline =
  "Building observable, auditable infrastructure.";

// ------------------------------------------------------------
// LINKS & SOCIAL
// Links to: src/components/sections/Contact.tsx
//           src/components/nav/NavBar.tsx
//           src/app/cv/page.tsx
// ------------------------------------------------------------
export const links = {

  // GitHub profile URL — used as href in Contact section social links
  // Links to: src/components/sections/Contact.tsx
  github: "https://github.com/CalmAfterReboot",

  // GitHub handle — displayed as the readable label under the GitHub icon
  // Links to: src/components/sections/Contact.tsx
  githubHandle: "github.com/CalmAfterReboot",

  // LinkedIn profile URL — used as href in Contact section social links
  // Links to: src/components/sections/Contact.tsx
  linkedin: "https://linkedin.com/in/mihaiferencz",

  // LinkedIn handle — displayed as the readable label under the LinkedIn icon
  // Links to: src/components/sections/Contact.tsx
  linkedinHandle: "linkedin.com/in/mihaiferencz",

  // CV route — used by the Download CV button in NavBar and Hero CTAs
  // Links to: src/components/nav/NavBar.tsx
  //           src/components/sections/Hero.tsx
  // Currently points to the Next.js CV page route at /cv
  // To switch to a PDF: place file in public/ and update to e.g. "/cv-mihai-ferencz.pdf"
  cvPath: "/cv",
};

// ------------------------------------------------------------
// SEO & METADATA
// Links to: src/app/layout.tsx (metadata export)
// Controls browser tab title, meta description, and OG social preview
// ------------------------------------------------------------
export const seo = {

  // Browser tab title and Open Graph title for social sharing previews
  // Links to: src/app/layout.tsx
  title: "Mihai Ferencz — Cloud & DevOps Engineer",

  // Meta description — used by search engines and social sharing previews
  // Links to: src/app/layout.tsx
  description:
    "Cloud and DevOps Engineer based in Carlisle, UK. " +
    "Building observable, auditable infrastructure.",

  // Canonical site URL — used as metadataBase for resolving relative OG URLs
  // Links to: src/app/layout.tsx
  siteUrl: "https://bluelayersystems.com",

  // OG image path — used for social sharing card previews
  // Links to: src/app/layout.tsx
  // Place image in: public/
  ogImage: "/og-image.png",
};

// ------------------------------------------------------------
// STORY SECTION — Era 01: Foundation
// Links to: src/components/sections/Story.tsx
// Controls the first story panel (ERA 01 // FOUNDATION)
// ------------------------------------------------------------
export const eraFoundation = {

  // Era label — small monospace text displayed above the heading
  label: "ERA 01 // FOUNDATION",

  // Era heading — large display text
  heading: "STARTED IN THE TRENCHES",

  // Body paragraph — main descriptive text below the stats
  body:
    "Five years of production infrastructure operations — M365, " +
    "Azure, AVD, FSLogix, Hyper-V, Intune, and PowerShell daily. " +
    "Terraform, GitHub Actions, and AKS through live portfolio " +
    "projects. Operational depth built in production, not in a lab.",

  // Stats — four animated metric cards displayed above the body paragraph
  // `to` is the number the counter animates up to
  // `suffix` is appended after the number (e.g. "+", "%")
  // `label` is the small uppercase caption below the number
  stats: [
    { to: 50,   suffix: "+", label: "Client Tenants" },
    { to: 500,  suffix: "+", label: "Endpoints Managed" },
    { to: 2000, suffix: "+", label: "NHS Endpoints Deployed" },
    { to: 99,   suffix: "%", label: "Deployment Success" },
  ],
};

// ------------------------------------------------------------
// STORY SECTION — Era 02: Elevation
// Links to: src/components/sections/Story.tsx
// Controls the second story panel (ERA 02 // ELEVATION)
// ------------------------------------------------------------
export const eraElevation = {

  // Era label — small monospace text displayed above the heading
  label: "ERA 02 // ELEVATION",

  // Era heading — large display text
  heading: "FROM OPERATIONS TO ENGINEERING",

  // Body paragraph — main descriptive text above the cert badges
  body:
    "50+ tenants. Full-stack infrastructure ownership across cloud, " +
    "identity, networking, and virtualisation. The BLS portfolio is " +
    "where that experience meets modern platform engineering.",

  // Cert badges — displayed as pill tags below the body paragraph
  // status options:
  //   "complete" — green filled dot + tick symbol (✓)
  //   "active"   — amber filled dot + arrow symbol (→)  currently studying
  //   "planned"  — purple filled dot + circle symbol (◦)  next in queue
  // Set visible: false to hide a badge without deleting the entry
  certBadges: [
    { label: "AZ-900",           status: "complete", visible: true },
    { label: "Terraform Assoc.", status: "active",   visible: true },
    { label: "AZ-400",           status: "planned",  visible: true },
  ],
};

// ------------------------------------------------------------
// STORY SECTION — Era 03: Mission
// Links to: src/components/sections/Story.tsx
// Controls the third story panel (ERA 03 // MISSION)
// ------------------------------------------------------------
export const eraMission = {

  // Era label — small monospace text displayed above the heading
  label: "ERA 03 // MISSION",

  // Era heading — large display text
  heading: "BUILDING BLUE LAYER SYSTEMS",

  // Body paragraph — main descriptive text above the architecture flow
  body:
    "Three production-grade portfolio projects. Terraform. AKS. LiteLLM. " +
    "Deployed, security-scanned, cost-governed — built to the same " +
    "standard as enterprise infrastructure.",

  // Architecture flow — horizontal pill chain displayed below the body
  // Each item is a labelled badge. Arrows ("→") are inserted automatically between items.
  // `color` must be a hex value matching the nebula palette in globals.css
  architectureFlow: [
    { label: "Proxmox Lab",        color: "#FF6B9D" },
    { label: "GitHub Actions",     color: "#7B4FFF" },
    { label: "Azure Landing Zone", color: "#00D4FF" },
    { label: "AKS",                color: "#00D4FF" },
    { label: "AI Gateway",         color: "#FFB347" },
  ],
};
