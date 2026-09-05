import { useState } from 'react';
import { useDict } from '../hooks';

/** One source of truth, three derivations - recomputed, never synced by hand. */
export default function SignalDemo() {
  const t = useDict();
  const [rx, setRx] = useState('Design Systems');

  const slug = rx
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  const rows = [
    { fn: 'slug()', v: slug || '-' },
    { fn: 'words()', v: rx.trim() ? String(rx.trim().split(/\s+/).length) : '0' },
    { fn: 'shout()', v: rx.toUpperCase() || '-' },
  ];

  return (
    <div className="panel signal-panel">
      <label className="demo-label mono" htmlFor="rx-in">
        {t.demo1Label}
      </label>
      <div className="signal-row mono" dir="ltr">
        <span aria-hidden="true">signal(</span>
        <input
          id="rx-in"
          value={rx}
          maxLength={40}
          onChange={(e) => setRx(e.target.value)}
        />
        <span aria-hidden="true">)</span>
      </div>
      <div className="derived mono" dir="ltr">
        {rows.map((r) => (
          <div className="derived-row" key={r.fn}>
            <span className="fn">{r.fn}</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
            <span className="val">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
