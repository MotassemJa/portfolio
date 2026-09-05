// Generated from handoff/spec/CONTENT.md. Locale-independent constants.

export const EMAIL = 'Motassem.Jalal-Aldeen@outlook.com';

/** Real profile URLs. CONTENT.md ships '#' placeholders; SECTIONS.md supplies these
 *  and says to drop the Xing pill until a URL exists rather than shipping a '#'. */
export const SOCIAL_URLS: Record<string, string> = {
  GitHub: 'https://github.com/MotassemJa',
  LinkedIn: 'https://www.linkedin.com/in/motassem-jalal-71b507a5/',
};

export const NAV_IDS = ['about', 'skills', 'work', 'experience', 'certs', 'contact'] as const;
export type NavId = (typeof NAV_IDS)[number];

/** Design-token demo scale. Its rounded radii are the demo's content, not page shape. */
export const STEPS = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl"
] as const;
export const RADII = [
  4,
  8,
  12,
  16,
  24
] as const;
export const SPACES = [
  8,
  12,
  16,
  24,
  32
] as const;

export const PIPE = [
  {
    "n": "install",
    "t": "4.2s"
  },
  {
    "n": "lint",
    "t": "1.8s"
  },
  {
    "n": "test",
    "t": "6.3s"
  },
  {
    "n": "build",
    "t": "12.4s"
  },
  {
    "n": "deploy",
    "t": "8.1s"
  }
] as const;

export const EXP_ICONS: Record<string, string> = {
  "work": "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z",
  "internship": "M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",
  "education": "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5"
};

export const CERT_FIELD_ORDER = ['db', 'ai', 'other'] as const;

export const SWATCH_HUES = [
  125,
  92,
  200,
  30,
  265,
  340
] as const;
export const DEFAULT_HUE = 125;

/** Ambient halo animation. 'calm' freezes the glows; shipped as a site constant. */
export const MOTION: 'full' | 'calm' = 'full';
/** 'sticky' shows the project index rail. */
export const WORK_MODE: 'sticky' | 'stacked' = 'sticky';
