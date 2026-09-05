import type en from './en';

/** Shape of a locale dictionary, derived from the English source. */
export type Dict = typeof en;
export type Lang = 'en' | 'de' | 'ar';
export const LANGS: readonly Lang[] = ['en', 'de', 'ar'] as const;
