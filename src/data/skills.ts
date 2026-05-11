import { skills as skillsConfig } from "@/config/bls.config";

export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  pulseDelay: number;
}

export interface Constellation {
  id: string;
  name: string;
  color: string;
  nodes: SkillNode[];
  edges: [string, string][];
}

function toSlug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const constellations: Constellation[] = skillsConfig.map((c) => {
  const nodes: SkillNode[] = c.nodes.map((n, i) => ({
    id:         toSlug(n.label),
    label:      n.label,
    x:          n.x,
    y:          n.y,
    pulseDelay: i * 0.5,
  }));

  // Auto-generate ring edges connecting nodes in sequence
  const edges: [string, string][] = nodes.map((n, i) => [
    n.id,
    nodes[(i + 1) % nodes.length].id,
  ]);

  return {
    id:    toSlug(c.constellation),
    name:  c.constellation.toUpperCase(),
    color: c.color,
    nodes,
    edges,
  };
});
