import { useEffect } from 'react';
import { MOTION } from '../data/site';

/**
 * Card spotlight and CTA magnet. Pure decoration - nothing here is needed to
 * understand the page, so it stays off for coarse pointers and calm motion.
 *
 * Attaches to static markup and renders nothing, so the sections never hydrate.
 */
export default function PointerFX() {
  useEffect(() => {
    if (MOTION === 'calm') return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    const spots = Array.from(document.querySelectorAll<HTMLElement>('[data-spot]'));
    const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'));

    const onSpotMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      const layer = el.querySelector<HTMLElement>('.card-spot');
      if (layer) layer.style.opacity = '1';
    };
    const onSpotLeave = (e: PointerEvent) => {
      const layer = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('.card-spot');
      if (layer) layer.style.opacity = '0';
    };
    const onMagMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 16;
      const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * 11;
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    };
    const onMagLeave = (e: PointerEvent) => {
      (e.currentTarget as HTMLElement).style.translate = '0 0';
    };

    for (const el of spots) {
      el.addEventListener('pointermove', onSpotMove);
      el.addEventListener('pointerleave', onSpotLeave);
    }
    for (const el of magnets) {
      el.addEventListener('pointermove', onMagMove);
      el.addEventListener('pointerleave', onMagLeave);
    }
    return () => {
      for (const el of spots) {
        el.removeEventListener('pointermove', onSpotMove);
        el.removeEventListener('pointerleave', onSpotLeave);
      }
      for (const el of magnets) {
        el.removeEventListener('pointermove', onMagMove);
        el.removeEventListener('pointerleave', onMagLeave);
      }
    };
  }, []);

  return null;
}
