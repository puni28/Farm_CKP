import { getStatusConfig } from '../utils/treeUtils';

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
      {config.label}
    </span>
  );
}
