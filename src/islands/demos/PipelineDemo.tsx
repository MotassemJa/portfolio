import { useEffect, useRef, useState } from 'react';
import { PIPE } from '../../data/site';
import { useDict } from '../hooks';

export default function PipelineDemo() {
  const t = useDict();
  const [step, setStep] = useState(-1);
  const timer = useRef<number>(0);

  useEffect(() => () => clearInterval(timer.current), []);

  function run() {
    clearInterval(timer.current);
    setStep(0);
    timer.current = window.setInterval(() => {
      setStep((s) => {
        const n = s + 1;
        if (n >= PIPE.length) clearInterval(timer.current);
        return Math.min(n, PIPE.length);
      });
    }, 850);
  }

  const done = step >= PIPE.length;

  return (
    <>
      <div className="panel pipe-panel mono" dir="ltr">
        {PIPE.map((p, i) => {
          const isDone = step > i || done;
          const isRun = step === i && !done;
          // The symbol changes with the state, so colour is never the only signal.
          const sym = isDone ? '●' : isRun ? '◐' : '○';
          return (
            <div
              className={`pipe-row${isDone ? ' done' : isRun ? ' run' : ''}`}
              key={p.n}
            >
              <span className="pipe-sym" aria-hidden="true">
                {sym}
              </span>
              <span className="pipe-name">{p.n}</span>
              <span className="pipe-time">{isDone ? p.t : isRun ? '...' : ''}</span>
            </div>
          );
        })}
      </div>
      <div className="pipe-foot">
        <button type="button" className="pipe-run mono" onClick={run}>
          {t.demo4Run}
        </button>
        {/* Exists in the DOM before it has content, so the completion announces. */}
        <span className="pipe-done mono" role="status">
          {done ? t.demo4Done : ''}
        </span>
      </div>
    </>
  );
}
