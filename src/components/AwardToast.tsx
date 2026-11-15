import { useEffect, useRef, useState } from 'react';
import { onAward, type Patch as PatchData } from '../app/explorer';
import { Patch } from './Patch';
import { useShell } from '../app/l10n';

/** Small, non-blocking celebration when a patch is earned. Announced politely. */
export function AwardToast() {
  const [queue, setQueue] = useState<PatchData[]>([]);
  const { t, patch: localize } = useShell();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => onAward(patch => setQueue(q => [...q, patch])), []);
  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    timer.current = window.setTimeout(() => setQueue(q => q.slice(1)), 4200);
    return () => window.clearTimeout(timer.current);
  }, [current]);
  return <div className="award-region" role="status" aria-live="polite">
    {current && <div className="award-toast" key={current.id}>
      <Patch patch={current} earned size={56} />
      <div><strong>{t('ui.toast.earned', { name: localize(current).name })}</strong><span>{t('ui.toast.points', { points: current.points })}</span></div>
      <button type="button" className="award-close" onClick={() => setQueue(q => q.slice(1))} aria-label={t('ui.toast.dismiss')}>×</button>
    </div>}
  </div>;
}
