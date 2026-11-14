import { useT } from '../i18n';

export function ProgressMeter({ count, compact = false }: { count: number; compact?: boolean }) {
  const { t } = useT();
  return <div className={`progress-meter ${compact ? 'progress-meter-compact' : ''}`}>
    <span className="progress-copy"><span>{compact ? t('progress.short') : t('progress.long')}</span><strong>{count}<span> / 3</span></strong></span>
    <div className="progress-segments" role="progressbar" aria-label={t('progress.aria')} aria-valuemin={0} aria-valuemax={3} aria-valuenow={count}>
      {[0, 1, 2].map(i => <span key={i} className={i < count ? 'is-filled' : ''} />)}
    </div>
  </div>;
}
