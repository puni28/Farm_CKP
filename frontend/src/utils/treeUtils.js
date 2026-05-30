export const STATUS_CONFIG = {
  HEALTHY: { label: 'Healthy', color: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-100 text-green-800', border: 'border-green-500' },
  NEEDS_ATTENTION: { label: 'Needs Attention', color: 'bg-yellow-400', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-400' },
  DISEASED: { label: 'Diseased', color: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800', border: 'border-red-500' },
  DEAD: { label: 'Dead', color: 'bg-gray-600', text: 'text-gray-600', badge: 'bg-gray-200 text-gray-700', border: 'border-gray-500' },
};

export const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.HEALTHY;

export const getHealthColor = (score) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 25) return 'text-orange-600';
  return 'text-red-600';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
