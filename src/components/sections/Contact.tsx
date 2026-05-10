"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { slideUp, staggerContainer } from "@/lib/motion-variants";

export function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const socials = [
    {
      label: "GitHub",
      href: "https://github.com/CalmAfterReboot",
      Icon: Github,
      color: "#7B4FFF",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/mihaiferencz",
      Icon: Linkedin,
      color: "#00D4FF",
    },
    {
      label: "Email",
      href: "mailto:mihai.ferencz@bluelayersystems.com",
      Icon: Mail,
      color: "#FFB347",
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-rose)] mb-3">
            06 // CONTACT
          </p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider mb-4">
            OPEN CHANNEL
          </h2>
          <p className="font-body text-[var(--text-secondary)] max-w-xl">
            Available for cloud engineering roles, infrastructure consultancy, or just a good
            conversation about platform engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-5"
          >
            {[
              { id: "name", label: "NAME", type: "text", placeholder: "Your name" },
              { id: "email", label: "EMAIL", type: "email", placeholder: "your@email.com" },
            ].map(({ id, label, type, placeholder }) => (
              <motion.div key={id} variants={slideUp}>
                <label className="block font-mono text-xs tracking-widest text-[var(--text-muted)] mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[id as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                  className="w-full bg-[var(--cosmos-deep)] border border-[var(--border-subtle)] rounded px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--nebula-cyan)] transition-colors"
                />
              </motion.div>
            ))}

            <motion.div variants={slideUp}>
              <label className="block font-mono text-xs tracking-widest text-[var(--text-muted)] mb-2">
                MESSAGE
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full bg-[var(--cosmos-deep)] border border-[var(--border-subtle)] rounded px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--nebula-cyan)] transition-colors resize-none"
              />
            </motion.div>

            <motion.div variants={slideUp}>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] font-mono text-sm tracking-wider hover:bg-[var(--nebula-cyan)] hover:text-[var(--cosmos-void)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {status === "sending"
                  ? "TRANSMITTING…"
                  : status === "sent"
                    ? "SENT ✓"
                    : status === "error"
                      ? "RETRY"
                      : "TRANSMIT"}
              </button>
              {status === "error" && (
                <p className="mt-2 font-mono text-xs text-[var(--nebula-rose)]">
                  Transmission failed. Try email directly.
                </p>
              )}
            </motion.div>
          </motion.form>

          {/* Right — socials + info */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            {/* Socials */}
            <div className="space-y-4">
              {socials.map(({ label, href, Icon, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  variants={slideUp}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 group-hover:shadow-glow-cyan"
                    style={{
                      borderColor: `${color}40`,
                      background: `${color}10`,
                    }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <p className="font-mono text-sm tracking-wider" style={{ color }}>
                      {label.toUpperCase()}
                    </p>
                    <p className="font-body text-xs text-[var(--text-muted)]">
                      {href.replace("https://", "").replace("mailto:", "")}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Quick info */}
            <motion.div
              variants={slideUp}
              className="border border-[var(--border-subtle)] rounded-lg p-6 space-y-3 font-mono text-xs"
            >
              {[
                ["LOCATION",     "Carlisle, UK"],
                ["PHONE",        "07436 784212"],
                ["MODE",         "Remote · Hybrid · On-site"],
                ["RIGHT TO WORK","Full UK"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[var(--text-muted)] tracking-wider">{k}</span>
                  <span className="text-[var(--text-primary)]">{v}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
