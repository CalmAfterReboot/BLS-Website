"use client";

import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePageTransition } from "@/hooks/usePageTransition";
import styles from "@/styles/hud.module.css";

const LINKS = [
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" },
] as const;

/** Must match `hud.module.css`: desktop nav at min-width 769px */
const MOBILE_NAV_MQ = "(max-width: 768px)";

const NAVBAR_HEIGHT = 60;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: "instant" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function Navbar() {
  const { runTransition } = usePageTransition();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const applyTop = () => {
      document.documentElement.style.setProperty(
        "--nav-drawer-top",
        `${el.getBoundingClientRect().height}px`
      );
    };
    applyTop();
    const ro = new ResizeObserver(applyTop);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--nav-drawer-top");
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);

    const syncMenuToViewport = () => {
      if (!mq.matches) setOpen(false);
    };

    syncMenuToViewport();
    mq.addEventListener("change", syncMenuToViewport);
    return () => mq.removeEventListener("change", syncMenuToViewport);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia(MOBILE_NAV_MQ).matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const navigateHome = () => {
    void runTransition(() => {
      scrollToTop();
      setOpen(false);
    });
  };

  const navigate = (id: string) => {
    void runTransition(() => {
      scrollToSection(id);
      setOpen(false);
    });
  };

  return (
    <>
      <header ref={headerRef} className={styles.navShell}>
        <div className={styles.navInner}>
          <button
            type="button"
            className={[styles.brand, "text-left"].join(" ")}
            onClick={navigateHome}
            aria-label="Go to top"
          >
            <span className={styles.brandAccent}>BLS</span>
            <span className="text-text">
              {" // "}BLUE LAYER SYSTEMS
            </span>
          </button>

          <nav className={styles.navLinks} aria-label="Primary">
            <button
              type="button"
              className={styles.navLink}
              onClick={navigateHome}
            >
              HOME
            </button>
            {LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={styles.navLink}
                onClick={() => navigate(l.id)}
              >
                {l.label}
              </button>
            ))}
            <ThemeToggle />
          </nav>

          <button
            type="button"
            className={[styles.hamburger, open ? styles.hamburgerOpen : ""]
              .filter(Boolean)
              .join(" ")}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.hamBar} />
            <span className={styles.hamBar} />
            <span className={styles.hamBar} />
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-drawer"
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles.drawerLink}
            onClick={navigateHome}
          >
            HOME
          </button>
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={styles.drawerLink}
              onClick={() => navigate(l.id)}
            >
              {l.label}
            </button>
          ))}
          <div className={styles.drawerTheme}>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </>
  );
}
