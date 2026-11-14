export function ProgressMeter({ count, compact = false }: { count: number; compact?: boolean }) {
  return <div className={`progress-meter ${compact ? 'progress-meter-compact' : ''}`}>
    <span className="progress-copy"><span>{compact ? 'Discoveries' : 'Your discoveries'}</span><strong>{count}<span> / 3</span></strong></span>
    <div className="progress-segments" role="progressbar" aria-label="Core discoveries collected" aria-valuemin={0} aria-valuemax={3} aria-valuenow={count}>
      {[0, 1, 2].map(i => <span key={i} className={i < count ? 'is-filled' : ''} />)}
    </div>
  </div>;
}
