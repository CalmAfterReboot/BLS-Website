import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <footer className="border-t border-[var(--border-hi)] bg-[var(--bg-panel)] px-[clamp(1rem,5vw,3rem)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
            © {new Date().getFullYear()} BLUE LAYER SYSTEMS // MIHAI
          </p>
          <p className="font-mono text-[0.65rem] text-dim">BLS v0.1.0 // OPS PANEL</p>
        </div>
      </footer>
    </main>
  );
}
