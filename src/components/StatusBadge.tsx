import type { Mission } from '../app/missions';
import { useT } from '../i18n';

export function StatusBadge({ mission }: { mission: Mission }) {
  const { t } = useT();
  return <span className={`status-badge status-${mission.statusKind}`}><span aria-hidden="true" />{t(`m.${mission.id}.status`)}</span>;
}
