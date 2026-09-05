import { useEffect, useState } from 'react';
import { LANGS, type Lang } from '../i18n';
import { NAV_IDS } from '../data/site';
import { useDict, useIsMobile } from './hooks';
import { setLang, toggleTheme, usePrefs } from './store';

/** Display label per language. Arabic labels itself in Arabic. */
const LANG_LABEL: Record<Lang, string> = { en: 'EN', de: 'DE', ar: 'عربي' };

function LangGroup({ className }: { className?: string }) {
  const t = useDict();
  const { lang } = usePrefs();
  return (
    // Each button is an immediate action, not a pending selection, so these are
    // aria-pressed toggles rather than a radio group.
    <div className={className} role="group" aria-label={t.langSw}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="langbtn mono"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export default function HeaderControls() {
  const t = useDict();
  const { theme } = usePrefs();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Body scroll is locked while the overlay is open, and restored on close,
  // on unmount, and on a language change (see store.setLang).
  function setMenu(open: boolean) {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    setMenuOpen(open);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // A resize past the breakpoint must not strand the overlay open.
  useEffect(() => {
    if (!isMobile && menuOpen) setMenu(false);
  }, [isMobile, menuOpen]);

  useEffect(() => () => {
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <>
      <div className="header-right">
        <LangGroup className="langgroup desktop-only" />

        {/* popovertarget, not a JS handler: light dismiss and focus handling come
            from the platform. INTERACTIONS.md specifies this attribute. */}
        <button
          type="button"
          className="ctl ctl-icon"
          popoverTarget="themelab"
          aria-label={t.themeLab}
          title={t.themeLab}
        >
          <span className="lab-dot" aria-hidden="true" />
        </button>

        <button type="button" className="ctl ctl-icon" onClick={toggleTheme} aria-label={t.themeTo}>
          <span aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
        </button>

        {/* Declarative dialog control - the browser wires up the open. */}
        <button
          type="button"
          className="ctl kbd-btn mono desktop-only"
          dir="ltr"
          {...({ command: 'show-modal', commandfor: 'palette' } as Record<string, string>)}
          aria-label={t.palOpen}
        >
          ⌘K
        </button>

        <button
          type="button"
          className="burger mobile-only"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t.menuCloseL : t.menuOpenL}
          onClick={() => setMenu(!menuOpen)}
        >
          <span aria-hidden="true">
            <b />
            <b />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {/* Shares the "Primary" label with the desktop nav - only one is ever
              in the tree at a time. */}
          <nav className="wrap mobile-nav" aria-label="Primary">
            {NAV_IDS.map((id, i) => (
              <a
                key={id}
                className="m-link"
                href={`#${id}`}
                style={{ animationDelay: `${(0.04 * i).toFixed(2)}s` }}
                onClick={() => setMenu(false)}
              >
                <span>{t.nav[id]}</span>
              </a>
            ))}
            <LangGroup className="m-langs" />
          </nav>
        </div>
      )}
    </>
  );
}
