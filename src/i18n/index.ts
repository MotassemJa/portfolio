import en from './en';
import de from './de';
import ar from './ar';
import type { Dict, Lang } from './types';

export type { Dict, Lang };
export { LANGS } from './types';

export const DICTS = { en, de, ar } as const satisfies Record<Lang, Dict>;

export const DEFAULT_LANG: Lang = 'en';

/** Text direction for a locale. Only Arabic flips the page. */
export function dirFor(lang: Lang): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Builds the three-locale record that <T> renders, from any path in the dictionary.
 * pick((d) => d.nav.about) -> { en: 'About', de: 'Uber mich', ar: '...' }
 */
export function pick<T>(fn: (d: Dict) => T): Record<Lang, T> {
  return { en: fn(DICTS.en), de: fn(DICTS.de), ar: fn(DICTS.ar) };
}
