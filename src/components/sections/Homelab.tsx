"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { homelabSpecs } from "@/data/homelab";
import { PersonaGate } from "@/components/ui/PersonaGate";
import { Server, Network, Activity } from "lucide-react";
import { slideUp, staggerContainer } from "@/lib/motion-variants";

function ServiceRow({
  name,
  status,
  tech,
}: {
  name: string;
  status: string;
  url: string;
  tech: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: status === "running" ? "var(--nebula-green)" : "var(--nebula-rose)",
            boxShadow:
              status === "running"
                ? "0 0 8px var(--nebula-green)"
                : "0 0 8px var(--nebula-rose)",
          }}
        />
        <span className="font-mono text-sm tracking-wider text-[var(--text-primary)]">
          {name}
        </span>
      </div>
      <span className="font-mono text-xs text-[var(--text-muted)]">{tech}</span>
    </div>
  );
}

function HomelabContent() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="homelab" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-violet)] mb-3">
            05 // HOMELAB
          </p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider mb-4">
            THE LAB
          </h2>
          <p className="font-body text-[var(--text-secondary)] max-w-xl">
            A production-grade homelab that mirrors enterprise patterns — VLAN segmentation,
            monitoring stack, AI gateway, and all infrastructure as code.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Hypervisor card */}
          <motion.div
            variants={slideUp}
            className="border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/40 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Server size={16} className="text-[var(--nebula-cyan)]" />
              <span className="font-mono text-sm tracking-wider text-[var(--nebula-cyan)]">
                HYPERVISOR
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                ["PLATFORM", homelabSpecs.hypervisor.name],
                ["VMs",      homelabSpecs.hypervisor.vms.toString()],
                ["CPU",      homelabSpecs.hypervisor.cpu],
                ["RAM",      homelabSpecs.hypervisor.ram],
                ["STORAGE",  homelabSpecs.hypervisor.storage],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[var(--text-muted)]">
                  <span>{k}</span>
                  <span className="text-[var(--text-secondary)]">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Network VLANs */}
          <motion.div
            variants={slideUp}
            className="border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/40 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Network size={16} className="text-[var(--nebula-violet)]" />
              <span className="font-mono text-sm tracking-wider text-[var(--nebula-violet)]">
                NETWORK / VLANs
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] mb-3">
              {homelabSpecs.network.firewall} · {homelabSpecs.network.switch}
            </p>
            <div className="space-y-2">
              {homelabSpecs.network.vlans.map((vlan) => (
                <div key={vlan.id} className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: vlan.color }}
                  />
                  <span className="text-[var(--text-muted)] w-8">
                    {vlan.id}
                  </span>
                  <span style={{ color: vlan.color }}>{vlan.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            variants={slideUp}
            className="border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/40 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-[var(--nebula-green)]" />
              <span className="font-mono text-sm tracking-wider text-[var(--nebula-green)]">
                SERVICES
              </span>
            </div>
            <div>
              {homelabSpecs.services.map((svc) => (
                <ServiceRow key={svc.name} {...svc} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Homelab() {
  return (
    <PersonaGate allowedPersonas={["engineer", "architect"]}>
      <HomelabContent />
    </PersonaGate>
  );
}
