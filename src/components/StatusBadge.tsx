import type { Mission } from '../app/missions';
export function StatusBadge({ mission }: { mission: Mission }) {
  return <span className={`status-badge status-${mission.statusKind}`}><span aria-hidden="true" />{mission.status}</span>;
}
