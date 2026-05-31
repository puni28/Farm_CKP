import { useEffect, useState } from 'react';
import { getDashboard } from '../api/trees';
import { getOrchards } from '../api/orchards';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate, getHealthColor } from '../utils/treeUtils';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orchards, setOrchards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getDashboard(), getOrchards()])
      .then(([statsRes, orchRes]) => {
        setStats(statsRes.data);
        setOrchards(orchRes.data);
      })
      .catch(() => setError('Failed to load dashboard. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  const chartData = [
    { name: 'Healthy', count: stats.healthyTrees, fill: '#22c55e' },
    { name: 'Needs Attention', count: stats.needsAttentionTrees, fill: '#facc15' },
    { name: 'Diseased', count: stats.diseasedTrees, fill: '#ef4444' },
    { name: 'Dead', count: stats.deadTrees, fill: '#6b7280' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orchards[0]?.name || 'Orchard'} — {orchards[0]?.location || ''}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Trees" value={stats.totalTrees} icon="🌳" />
        <StatCard title="Healthy" value={stats.healthyTrees} colorClass="text-green-600" icon="💚" />
        <StatCard title="Needs Attention" value={stats.needsAttentionTrees} colorClass="text-yellow-600" icon="⚠️" />
        <StatCard title="Diseased" value={stats.diseasedTrees} colorClass="text-red-600" icon="🦠" />
        <StatCard title="Dead" value={stats.deadTrees} colorClass="text-gray-500" icon="💀" />
        <StatCard
          title="Avg Health"
          value={`${stats.averageHealthScore?.toFixed(1)}%`}
          colorClass={getHealthColor(stats.averageHealthScore)}
          icon="❤️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Yield Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Current Season Yield</h2>
          <p className="text-4xl font-bold text-green-700">{stats.totalCurrentSeasonYieldKg?.toFixed(0)} <span className="text-lg font-normal text-gray-500">kg</span></p>
          <p className="text-xs text-gray-400 mt-2">Across all active trees</p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Trees by Status</h2>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} barSize={36}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trees Needing Attention */}
      {stats.lowHealthTrees?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">⚠️ Trees Needing Attention</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                  <th className="pb-2 pr-4">Tree</th>
                  <th className="pb-2 pr-4">Position</th>
                  <th className="pb-2 pr-4">Variety</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Health</th>
                  <th className="pb-2">Last Inspection</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowHealthTrees.map(tree => (
                  <tr key={tree.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <Link to={`/trees/${tree.id}`} className="text-blue-600 hover:underline font-medium">
                        Tree #{tree.id}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">R{tree.rowNumber} C{tree.columnNumber}</td>
                    <td className="py-2 pr-4 text-gray-600">{tree.variety || '—'}</td>
                    <td className="py-2 pr-4"><StatusBadge status={tree.status} /></td>
                    <td className={`py-2 pr-4 font-semibold ${getHealthColor(tree.healthScore)}`}>{tree.healthScore}</td>
                    <td className="py-2 text-gray-400">{formatDate(tree.lastInspectionDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/orchard" className="block bg-green-50 border border-green-200 rounded-lg p-5 hover:bg-green-100 transition-colors">
          <div className="text-2xl mb-2">🗺️</div>
          <h3 className="font-semibold text-green-800">View Orchard Grid</h3>
          <p className="text-sm text-green-600 mt-1">See all trees on the grid map</p>
        </Link>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="text-2xl mb-2">📅</div>
          <h3 className="font-semibold text-blue-800">Orchard Overview</h3>
          <p className="text-sm text-blue-600 mt-1">
            {orchards[0]?.totalRows} rows × {orchards[0]?.totalColumns} columns &nbsp;·&nbsp;
            Established {formatDate(orchards[0]?.establishedDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
