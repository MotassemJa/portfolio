import { useEffect } from 'react';

/**
 * Marks the active nav link and moves the project index marker.
 *
 * Two IntersectionObservers and nothing else — there is deliberately no
 * scroll listener anywhere on this page.
 *
 * Renders nothing: it drives attributes on static markup so the sections
 * themselves never have to hydrate.
 */
export default function ScrollSpy() {
  useEffect(() => {
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')
    );
    const idxLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-proj-link]')
    );
    const marker = document.querySelector<HTMLElement>('[data-rail-marker]');

    const setActiveSection = (id: string) => {
      for (const a of navLinks) {
        if (a.dataset.navLink === id) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      }
    };

    const setActiveProject = (id: string) => {
      let index = 0;
      idxLinks.forEach((a, i) => {
        const on = a.dataset.projLink === id;
        a.classList.toggle('on', on);
        if (on) index = i;
      });
      if (marker) marker.style.translate = `0 ${index * 42}px`;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActiveSection(en.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    const ioProj = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const id = (en.target as HTMLElement).dataset.proj;
          if (en.isIntersecting && id) setActiveProject(id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px' }
    );

    document.querySelectorAll('main section[id]').forEach((el) => io.observe(el));
    document.querySelectorAll('[data-proj]').forEach((el) => ioProj.observe(el));

    return () => {
      io.disconnect();
      ioProj.disconnect();
    };
  }, []);

  return null;
}
