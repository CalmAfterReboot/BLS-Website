import { experience } from "@/config/bls.config";

export interface Achievement {
  icon: string;
  title: string;
  detail: string;
  tags: string[];
}

export interface EraPalette {
  accent: string;
  bg: string;
}

export interface Era {
  id: string;
  type: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  achievements: Achievement[];
  daily: string[];
  deepened: string[];
  palette: EraPalette;
}

export const timeline: Era[] = experience.map((e) => ({
  id:           e.id,
  type:         e.type,
  role:         e.role,
  company:      e.company,
  period:       e.period,
  location:     e.location,
  summary:      e.summary,
  achievements: e.achievements.map((a) => ({
    icon:   a.icon,
    title:  a.title,
    detail: a.detail,
    tags:   a.tags,
  })),
  daily:    e.stack.daily,
  deepened: e.stack.deepened,
  palette:  { accent: e.accent, bg: e.bg },
}));
