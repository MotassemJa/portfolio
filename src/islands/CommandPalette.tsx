import { useEffect, useMemo, useRef, useState } from 'react';
import { EMAIL, NAV_IDS } from '../data/site';
import type { Lang } from '../i18n';
import { useDict } from './hooks';
import { goto, setHue, setLang, setTheme, usePrefs } from './store';

interface Action {
  icon: string;
  label: string;
  kind: string;
  run: () => void;
}

const LANG_ACTIONS: [Lang, string, string][] = [
  ['en', 'English', 'E'],
  ['de', 'Deutsch', 'D'],
  ['ar', 'العربية', 'ع'],
];

/**
 * Native <dialog> opened with showModal(): focus trap, Escape and the inert
 * background all come from the platform. Deliberately not rebuilt from divs.
 */
export default function CommandPalette() {
  const t = useDict();
  const { theme } = usePrefs();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  const all = useMemo<Action[]>(() => {
    const acts: Action[] = NAV_IDS.map((id) => ({
      icon: '→',
      label: `${t.palGoto} · ${t.nav[id]}`,
      kind: t.kGo,
      run: () => goto(id),
    }));
    acts.push({
      icon: '◐',
      label: t.palTheme,
      kind: t.kTheme,
      run: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    });
    acts.push({
      icon: '◍',
      label: t.palHue,
      kind: t.kTheme,
      run: () => setHue(Math.floor(Math.random() * 360)),
    });
    for (const [code, label, icon] of LANG_ACTIONS) {
      acts.push({ icon, label, kind: t.kLang, run: () => setLang(code) });
    }
    acts.push({ icon: '@', label: t.palCopy, kind: t.kContact, run: () => copy() });
    acts.push({ icon: '$', label: t.palHire, kind: t.kEgg, run: () => goto('contact') });
    return acts;
  }, [t, theme]);

  const query = q.trim().toLowerCase();
  const acts = query
    ? all.filter((a) => `${a.label} ${a.kind}`.toLowerCase().includes(query))
    : all;
  const active = Math.min(sel, Math.max(0, acts.length - 1));

  function copy() {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
  }

  function close() {
    dialogRef.current?.close();
  }

  function run(a: Action) {
    close();
    a.run();
  }

  // ⌘K / Ctrl+K toggles. The button in the header opens it declaratively via
  // command/commandfor, so this only has to cover the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const d = dialogRef.current;
        if (!d) return;
        if (d.open) d.close();
        else d.showModal();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  // Reset and focus on every open, however it was opened.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState !== 'open') return;
      setQ('');
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    d.addEventListener('toggle', onToggle);
    return () => d.removeEventListener('toggle', onToggle);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    const n = acts.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel(n ? (active + 1) % n : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel(n ? (active - 1 + n) % n : 0);
    } else if (e.key === 'Enter' && acts[active]) {
      e.preventDefault();
      run(acts[active]);
    }
  }

  return (
    <dialog
      id="palette"
      ref={dialogRef}
      className="palette"
      aria-label={t.palOpen}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="pal-head">
        <span className="pal-caret mono" aria-hidden="true">
          ›
        </span>
        <input
          ref={inputRef}
          className="pal-input"
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={acts.length ? `pal-opt-${active}` : undefined}
          aria-label={t.palPh}
          placeholder={t.palPh}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={onKeyDown}
        />
        <kbd className="pal-esc mono">esc</kbd>
      </div>
      <ul id="pal-list" className="pal-list" role="listbox">
        {acts.map((a, i) => (
          <li
            key={a.label}
            id={`pal-opt-${i}`}
            role="option"
            className="pal-opt"
            aria-selected={i === active}
            onClick={() => run(a)}
            onMouseEnter={() => setSel(i)}
          >
            <span className="pal-icon mono" aria-hidden="true">
              {a.icon}
            </span>
            <span className="pal-label">{a.label}</span>
            <span className="pal-kind mono">{a.kind}</span>
          </li>
        ))}
        {acts.length === 0 && <li className="pal-none">{t.palNone}</li>}
      </ul>
    </dialog>
  );
}
