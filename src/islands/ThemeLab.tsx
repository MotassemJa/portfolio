import { SWATCH_HUES } from '../data/site';
import { useDict } from './hooks';
import { setHue, usePrefs } from './store';

/**
 * popover="auto" gives light dismiss and focus handling for free — no JS.
 * L and C stay locked so contrast holds at every hue; only H moves.
 */
export default function ThemeLab() {
  const t = useDict();
  const { hue, theme } = usePrefs();
  const L = theme === 'light' ? '0.5' : '0.855';
  const C = theme === 'light' ? '0.145' : '0.185';

  return (
    <div id="themelab" className="themelab" popover="auto">
      <strong>{t.themeLab}</strong>
      <div className="hue-strip" aria-hidden="true" />
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        value={hue}
        aria-label={t.hueLabel}
        onChange={(e) => setHue(Number(e.target.value))}
      />
      <div className="swatches">
        {SWATCH_HUES.map((h) => (
          <button
            key={h}
            type="button"
            className="swatch"
            style={{ background: `oklch(0.8 0.17 ${h})` }}
            aria-label={`${t.hueLabel} ${h}`}
            aria-pressed={hue === h}
            onClick={() => setHue(h)}
          />
        ))}
      </div>
      <div className="lab-readout mono" dir="ltr">
        oklch({L} {C} <b>{hue}</b>)
      </div>
      <p className="lab-readout" style={{ marginTop: 8 }}>
        {t.labNote}
      </p>
    </div>
  );
}
