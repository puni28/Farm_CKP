import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTree, deleteTree } from '../api/trees';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import InspectionList from '../components/InspectionList';
import YieldHistory from '../components/YieldHistory';
import TreeForm from '../components/TreeForm';
import { formatDate, getHealthColor } from '../utils/treeUtils';

export default function TreeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const load = () => {
    setLoading(true);
    getTree(id)
      .then(res => setTree(res.data))
      .catch(() => setError('Tree not found.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this tree and all its records?')) return;
    try {
      await deleteTree(id);
      navigate('/orchard');
    } catch {
      alert('Failed to delete tree.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading tree..." />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-gray-600">Dashboard</Link>
        <span className="mx-2">›</span>
        <Link to="/orchard" className="hover:text-gray-600">Orchard Grid</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">Tree #{tree.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Tree #{tree.id}</h1>
              <StatusBadge status={tree.status} />
            </div>
            <p className="text-gray-500 text-sm">
              {tree.orchardName} · Row {tree.rowNumber}, Column {tree.columnNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(v => !v)}
              className="text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50"
            >
              {editing ? 'Cancel Edit' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              className="text-sm border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {editing ? (
          <TreeForm
            orchardId={tree.orchardId}
            tree={tree}
            onSaved={() => { setEditing(false); load(); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Variety</p>
              <p className="font-medium text-gray-800">{tree.variety || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Health Score</p>
              <p className={`font-bold text-xl ${getHealthColor(tree.healthScore)}`}>{tree.healthScore}<span className="text-sm font-normal text-gray-400">/100</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Planting Date</p>
              <p className="font-medium text-gray-800">{formatDate(tree.plantingDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Last Inspection</p>
              <p className="font-medium text-gray-800">{formatDate(tree.lastInspectionDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Current Season Yield</p>
              <p className="font-bold text-green-700">{tree.currentSeasonYieldKg?.toFixed(1) ?? '—'} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Lifetime Yield</p>
              <p className="font-semibold text-gray-800">{tree.totalLifetimeYieldKg?.toFixed(1) ?? '—'} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Position</p>
              <p className="font-medium text-gray-800">R{tree.rowNumber} · C{tree.columnNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Orchard</p>
              <p className="font-medium text-gray-800">{tree.orchardName}</p>
            </div>
            {tree.notes && (
              <div className="col-span-4 bg-yellow-50 border border-yellow-100 rounded p-3">
                <p className="text-xs text-gray-500 mb-0.5">Notes</p>
                <p className="text-gray-700">{tree.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspection History */}
      <div className="mb-4">
        <InspectionList treeId={tree.id} onTreeUpdated={load} />
      </div>

      {/* Yield History */}
      <YieldHistory treeId={tree.id} onTreeUpdated={load} />
    </div>
  );
}
