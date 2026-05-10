"use client";

import { NavBar } from "@/components/nav/NavBar";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience as ExperienceSection } from "@/components/sections/Experience";
import { Homelab } from "@/components/sections/Homelab";
import { Contact } from "@/components/sections/Contact";

export function Experience() {
  return (
    <>
      <NavBar />
      <Hero />
      <Story />
      <Skills />
      <Projects />
      <ExperienceSection />
      <Homelab />
      <Contact />
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">
            © {new Date().getFullYear()} BLUE LAYER SYSTEMS // MIHAI GABRIEL FERENCZ
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">
            BLS v2.0 // NEBULA BUILD
          </p>
        </div>
      </footer>
    </>
  );
}
