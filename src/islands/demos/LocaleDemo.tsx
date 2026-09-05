import { useState } from 'react';

const LOCALES = ['de-DE', 'en-US', 'ar-EG'] as const;
type Loc = (typeof LOCALES)[number];

/** Real Intl output, not hardcoded strings - the same data through three locales. */
function formatRows(loc: Loc) {
  try {
    return [
      {
        k: 'currency',
        v: new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR' }).format(1234567.89),
      },
      {
        k: 'date',
        v: new Intl.DateTimeFormat(loc, { dateStyle: 'full' }).format(new Date(2026, 6, 19)),
      },
      {
        k: 'relative',
        v: new Intl.RelativeTimeFormat(loc, { numeric: 'auto' }).format(-3, 'day'),
      },
    ];
  } catch {
    return [];
  }
}

export default function LocaleDemo() {
  const [loc, setLoc] = useState<Loc>('de-DE');
  const rows = formatRows(loc);

  return (
    <div className="panel locale-panel">
      <div className="locale-tabs" role="group" aria-label="Locale" dir="ltr">
        {LOCALES.map((c) => (
          <button
            key={c}
            type="button"
            className="locale-tab mono"
            aria-pressed={loc === c}
            onClick={() => setLoc(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="locale-rows mono" dir="ltr">
        {rows.map((r) => (
          <div className="locale-row" key={r.k}>
            <span className="k">{r.k}</span>
            <span className="v">{r.v}</span>
          </div>
        ))}
        <div className="locale-row">
          <span className="k">dir</span>
          <span className="dir">{loc === 'ar-EG' ? 'rtl' : 'ltr'}</span>
        </div>
      </div>
    </div>
  );
}
