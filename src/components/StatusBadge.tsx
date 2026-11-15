import type { Mission } from '../app/missions';
import { useShell } from '../app/l10n';
export function StatusBadge({ mission }: { mission: Mission }) {
  const { mission: text } = useShell();
  return <span className={`status-badge status-${mission.statusKind}`}><span aria-hidden="true" />{text(mission.id).status}</span>;
}
