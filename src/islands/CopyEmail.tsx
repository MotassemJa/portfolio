import { useEffect, useRef, useState } from 'react';
import { EMAIL } from '../data/site';
import { useDict } from './hooks';

export default function CopyEmail() {
  const t = useDict();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  function copy() {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, done);
    else done();
  }

  return (
    <button type="button" className={`ctl copy-btn mono${copied ? ' copied' : ''}`} onClick={copy}>
      {/* The label itself is the live region, so the confirmation is announced. */}
      <span aria-live="polite">{copied ? t.copied : t.copyBtn}</span>
    </button>
  );
}
