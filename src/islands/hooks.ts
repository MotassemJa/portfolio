import { useEffect, useState } from 'react';
import { DICTS, type Lang } from '../i18n';
import { usePrefs } from './store';

/** Subscribes to a media query, cleaning the listener up on unmount. */
export function useMedia(query: string, serverValue = false): boolean {
  const [match, setMatch] = useState(serverValue);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useIsMobile = () => useMedia('(max-width: 900px)');
/** Pointer effects are decoration; they stay off for coarse pointers. */
export const useHoverFine = () => useMedia('(hover: hover) and (pointer: fine)', true);

/** The dictionary for the active language. */
export function useDict() {
  const { lang } = usePrefs();
  return DICTS[lang as Lang];
}
