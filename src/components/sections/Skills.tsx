"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { constellations, type Constellation, type SkillNode } from "@/data/skills";

const VIEWBOX = { w: 1000, h: 550 };

function getNode(c: Constellation, id: string): SkillNode | undefined {
  return c.nodes.find((n) => n.id === id);
}

export function Skills() {
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="skills" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-violet)] mb-3">02 // SKILLS</p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider mb-4">CONSTELLATION MAP</h2>
          <p className="font-mono text-sm text-[var(--text-muted)] tracking-wider">
            HOVER A CONSTELLATION TO ILLUMINATE · CLICK A NODE FOR DETAIL
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {constellations.map((c) => (
            <button
              key={c.id}
              data-cursor="hover"
              onClick={() =>
                setActiveConstellation((prev) => (prev === c.id ? null : c.id))
              }
              className="flex items-center gap-2 px-3 py-1.5 border rounded-full font-mono text-xs tracking-wider transition-all duration-300"
              style={{
                borderColor:
                  activeConstellation === c.id ? c.color : `${c.color}30`,
                color:
                  activeConstellation === c.id
                    ? c.color
                    : "var(--text-secondary)",
                background:
                  activeConstellation === c.id
                    ? `${c.color}15`
                    : "transparent",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: c.color }}
              />
              {c.name}
            </button>
          ))}
        </motion.div>

        {/* SVG Star Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.0 }}
          className="relative w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/30 backdrop-blur-sm overflow-hidden"
          style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}
        >
          <svg
            viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
            className="w-full h-full"
          >
            <defs>
              <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {constellations.map((c) => {
              const isActive =
                !activeConstellation || activeConstellation === c.id;
              const opacity = isActive ? 1 : 0.15;

              return (
                <g
                  key={c.id}
                  style={{ opacity, transition: "opacity 0.4s ease" }}
                  onMouseEnter={() => setActiveConstellation(c.id)}
                  onMouseLeave={() => setActiveConstellation(null)}
                >
                  {/* Edges */}
                  {c.edges.map(([aId, bId], i) => {
                    const a = getNode(c, aId);
                    const b = getNode(c, bId);
                    if (!a || !b) return null;
                    return (
                      <line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={c.color}
                        strokeWidth={0.8}
                        strokeOpacity={0.35}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {c.nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    return (
                      <g key={node.id}>
                        {/* Hover glow */}
                        {isHovered && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={14}
                            fill={c.color}
                            opacity={0.15}
                            filter="url(#node-glow)"
                          />
                        )}
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 6 : 4}
                          fill={c.color}
                          filter={isHovered ? "url(#node-glow)" : undefined}
                          animate={{ r: isHovered ? 6 : 4 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={{ cursor: "default" }}
                        />
                        {/* Subtle pulse ring */}
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          r={7}
                          fill="none"
                          stroke={c.color}
                          strokeWidth={0.5}
                          strokeOpacity={0.4}
                          animate={{ r: [6, 10, 6], strokeOpacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 3, repeat: Infinity, delay: node.pulseDelay }}
                        />
                        {/* Label — always visible, brighter on hover */}
                        <text
                          x={node.x}
                          y={node.y - 10}
                          fill={c.color}
                          fontSize={9}
                          textAnchor="middle"
                          fontFamily="JetBrains Mono, monospace"
                          letterSpacing={1}
                          opacity={isHovered ? 1 : 0.7}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Hovered node tooltip */}
          {hoveredNode && (
            <div className="absolute bottom-4 left-4 font-mono text-xs text-[var(--text-secondary)] tracking-wider">
              {constellations.flatMap((c) =>
                c.nodes.filter((n) => n.id === hoveredNode).map((n) => (
                  <span key={n.id} style={{ color: c.color }}>
                    {n.label}{" // "}{c.name}
                  </span>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
