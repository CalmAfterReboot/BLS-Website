import { NavBar } from "@/components/nav/NavBar";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Tools } from "@/components/sections/Tools";
import { Contact } from "@/components/sections/Contact";

// TODO(step-7): import CaseStudies section once built

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Hero />
      <Projects />
      <Tools />
      {/* TODO(step-7): <CaseStudies /> */}
      <Contact />
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">
            © {new Date().getFullYear()} BLUE LAYER SYSTEMS // MIHAI GABRIEL FERENCZ
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest">
            BLS v2.0
          </p>
        </div>
      </footer>
    </>
  );
}
