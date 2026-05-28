"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  anchor?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "projects",     label: "Projects",     href: "/#projects",     anchor: true },
  { id: "tools",        label: "Tools",        href: "/tools" },
  { id: "case-studies", label: "Case Studies", href: "/case-studies" },
  { id: "contact",      label: "Contact",      href: "/#contact",      anchor: true },
];

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.anchor) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-colors",
        scrolled ? "bg-base/95 border-b border-border" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          data-cursor="hover"
          className="font-mono text-sm tracking-widest text-text uppercase"
        >
          BLS
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "font-mono text-xs uppercase tracking-wider transition-colors",
                isActive(item)
                  ? "text-accent-olive"
                  : "text-text-dim hover:text-accent-olive"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-text"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-base">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-mono text-sm uppercase tracking-wider transition-colors",
                  isActive(item)
                    ? "text-accent-olive"
                    : "text-text-dim hover:text-accent-olive"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
