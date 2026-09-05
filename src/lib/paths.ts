/**
 * Join a path onto the configured `base`.
 *
 * `import.meta.env.BASE_URL` is '/portfolio' here (no trailing slash, because
 * astro.config sets trailingSlash: 'ignore'), so naive template concatenation
 * silently produces '/portfoliofavicon.svg'. Always route public/ asset URLs
 * through this. Assets imported via astro:assets already handle base
 * themselves and must NOT be passed through here.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
