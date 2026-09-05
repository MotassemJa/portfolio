import { useSyncExternalStore } from 'react';
import { DEFAULT_HUE, MOTION } from '../data/site';
import { DEFAULT_LANG, dirFor, type Lang } from '../i18n';

/**
 * The three preferences the whole page reads: language, theme and accent hue.
 *
 * Deliberately a plain module rather than one big `client:load` island — the header,
 * command palette, theme lab and the skills demos all subscribe independently and
 * hydrate on their own schedule, which is the point of islands.
 */

const KEY = 'mja.prefs.v2';

export type Theme = 'light' | 'dark';

export interface Prefs {
  lang: Lang;
  theme: Theme;
  themeTouched: boolean;
  hue: number;
  hueTouched: boolean;
}

const isLang = (v: unknown): v is Lang => v === 'en' || v === 'de' || v === 'ar';
const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark';

function systemTheme(): Theme {
  if (typeof matchMedia === 'undefined') return 'dark';
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** Private-mode and blocked-storage failures must never break the page. */
function read(): Prefs {
  const base: Prefs = {
    lang: DEFAULT_LANG,
    theme: systemTheme(),
    themeTouched: false,
    hue: DEFAULT_HUE,
    hueTouched: false,
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const s = JSON.parse(raw) as Partial<Prefs>;
    return {
      lang: isLang(s.lang) ? s.lang : base.lang,
      // An untouched visitor keeps following the system; a deliberate choice sticks.
      theme: s.themeTouched && isTheme(s.theme) ? s.theme : base.theme,
      themeTouched: !!s.themeTouched,
      hue: s.hueTouched && typeof s.hue === 'number' ? s.hue : base.hue,
      hueTouched: !!s.hueTouched,
    };
  } catch {
    return base;
  }
}

function write(p: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable - the page still works, the choice just won't persist */
  }
}

let state: Prefs =
  typeof window === 'undefined'
    ? { lang: DEFAULT_LANG, theme: 'dark', themeTouched: false, hue: DEFAULT_HUE, hueTouched: false }
    : read();

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;
/** The server render always reflects the documented defaults. */
const getServerSnapshot = (): Prefs => ({
  lang: DEFAULT_LANG,
  theme: 'dark',
  themeTouched: false,
  hue: DEFAULT_HUE,
  hueTouched: false,
});

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Writes every preference onto <html>. Mirrors the pre-paint inline script exactly. */
export function applyChrome(p: Prefs = state) {
  const d = document.documentElement;
  d.lang = p.lang;
  d.dir = dirFor(p.lang);
  d.dataset.theme = p.theme;
  d.style.setProperty('--hue', String(p.hue));
  d.style.setProperty('--amb', MOTION === 'calm' ? 'none' : 'halo');
}

function set(patch: Partial<Prefs>, persist = true) {
  state = { ...state, ...patch };
  applyChrome();
  if (persist) write(state);
  emit();
}

export function setLang(lang: Lang) {
  // Body scroll is restored here too: the mobile menu closes on a language change.
  document.documentElement.style.overflow = '';
  set({ lang });
}

export function setTheme(theme: Theme) {
  const apply = () => set({ theme, themeTouched: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && !reduced) document.startViewTransition(apply);
  else apply();
}

export const toggleTheme = () => setTheme(state.theme === 'dark' ? 'light' : 'dark');

export function setHue(hue: number) {
  set({ hue, hueTouched: true });
}

/** Header offset is 70px; 90 leaves the section title clear of it. */
export function goto(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 90;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}
