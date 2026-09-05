import { useState } from 'react';
import { RADII, SPACES, STEPS } from '../../data/site';

/**
 * The radii here step 4/8/12/16/24 - that scale is this demo's content, not the
 * page's bevel system, which is the one documented exception in DESIGN-TOKENS.md.
 */
export default function TokenDemo() {
  const [radiusI, setRadiusI] = useState(3);
  const [spaceI, setSpaceI] = useState(2);

  const radiusPx = `${RADII[radiusI]}px`;
  const spacePx = `${SPACES[spaceI]}px`;
  const gapPx = `${SPACES[Math.max(0, spaceI - 1)]}px`;

  return (
    <div className="panel token-panel">
      <div className="token-controls">
        <label>
          <span className="token-legend" dir="ltr">
            <span>--radius: var(--ds-radius-{STEPS[radiusI]})</span>
            <b>{radiusPx}</b>
          </span>
          {/* aria-valuetext so a screen reader announces "md", not "2". */}
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={radiusI}
            aria-label="--radius"
            aria-valuetext={STEPS[radiusI]}
            onChange={(e) => setRadiusI(Number(e.target.value))}
          />
        </label>
        <label>
          <span className="token-legend" dir="ltr">
            <span>--space: var(--ds-space-{STEPS[spaceI]})</span>
            <b>{spacePx}</b>
          </span>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={spaceI}
            aria-label="--space"
            aria-valuetext={STEPS[spaceI]}
            onChange={(e) => setSpaceI(Number(e.target.value))}
          />
        </label>
        <div className="scale-rows mono" dir="ltr">
          {STEPS.map((step, i) => (
            <div
              className={`scale-row${i === radiusI || i === spaceI ? ' on' : ''}`}
              key={step}
            >
              <span>{step}</span>
              <span>
                {RADII[i]}px / {SPACES[i]}px
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="token-preview"
        aria-hidden="true"
        style={{ borderRadius: radiusPx, padding: spacePx, gap: gapPx }}
      >
        <div className="tp-head">
          <span className="tp-swatch" style={{ borderRadius: radiusPx }} />
          <span className="tp-bar" />
        </div>
        <span className="tp-line" style={{ width: '82%' }} />
        <span className="tp-line" style={{ width: '55%' }} />
      </div>
    </div>
  );
}
