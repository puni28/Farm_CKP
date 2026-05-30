import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrees } from '../api/trees';
import { getOrchards } from '../api/orchards';
import TreeCell from '../components/TreeCell';
import TreeFilters from '../components/TreeFilters';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TreeForm from '../components/TreeForm';
import { getStatusConfig, formatDate, getHealthColor } from '../utils/treeUtils';

const LEGEND = [
  { status: 'HEALTHY', label: 'Healthy' },
  { status: 'NEEDS_ATTENTION', label: 'Needs Attention' },
  { status: 'DISEASED', label: 'Diseased' },
  { status: 'DEAD', label: 'Dead' },
];

// Convert 1-based index to letter label: 1→A, 26→Z, 27→AA, 28→AB, ...
function toLetterLabel(n) {
  let label = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function getLabel(index, mode) {
  return mode === 'letters' ? toLetterLabel(index) : String(index);
}

function LabelToggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">{label}:</span>
      <div className="flex rounded border border-gray-300 overflow-hidden text-xs">
        <button
          onClick={() => onChange('numbers')}
          className={`px-2.5 py-1 transition-colors ${value === 'numbers' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          1, 2, 3…
        </button>
        <button
          onClick={() => onChange('letters')}
          className={`px-2.5 py-1 transition-colors border-l border-gray-300 ${value === 'letters' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          A, B, C…
        </button>
      </div>
    </div>
  );
}

export default function OrchardGrid() {
  const [orchard, setOrchard] = useState(null);
  const [trees, setTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [rowMode, setRowMode] = useState('numbers');
  const [colMode, setColMode] = useState('numbers');
  const navigate = useNavigate();

  useEffect(() => {
    getOrchards()
      .then(res => {
        const o = res.data[0];
        setOrchard(o);
        return getTrees(o.id);
      })
      .then(res => {
        setTrees(res.data);
        setFilteredTrees(res.data);
      })
      .catch(() => setError('Failed to load orchard data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!orchard) return;
    const hasFilters = Object.values(filters).some(v => v !== '' && v != null);
    if (!hasFilters) {
      setFilteredTrees(trees);
      return;
    }
    getTrees(orchard.id, {
      status: filters.status || undefined,
      row: filters.row || undefined,
      col: filters.col || undefined,
      variety: filters.variety || undefined,
      minHealth: filters.minHealth || undefined,
    }).then(res => setFilteredTrees(res.data));
  }, [filters, orchard, trees]);

  const treeMap = {};
  filteredTrees.forEach(t => { treeMap[`${t.rowNumber}-${t.columnNumber}`] = t; });

  const rows = orchard?.totalRows || 10;
  const cols = orchard?.totalColumns || 12;

  if (loading) return <LoadingSpinner message="Loading orchard..." />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  const selectedRowLabel = selected ? getLabel(selected.rowNumber, rowMode) : '';
  const selectedColLabel = selected ? getLabel(selected.columnNumber, colMode) : '';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{orchard?.name}</h1>
          <p className="text-gray-500 text-sm">{orchard?.location} · {orchard?.totalRows}×{orchard?.totalColumns} grid · {trees.length} trees</p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Tree
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Add New Tree</h2>
          <TreeForm
            orchardId={orchard.id}
            onSaved={() => {
              setShowAddForm(false);
              getTrees(orchard.id).then(res => { setTrees(res.data); setFilteredTrees(res.data); });
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Legend + Label Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          {LEGEND.map(l => {
            const cfg = getStatusConfig(l.status);
            return (
              <div key={l.status} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className={`w-3 h-3 rounded-sm ${cfg.color}`} />
                {l.label}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <LabelToggle label="Rows" value={rowMode} onChange={setRowMode} />
          <LabelToggle label="Columns" value={colMode} onChange={setColMode} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <TreeFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 overflow-x-scroll scrollbar-always" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Column headers */}
        <div className="flex gap-1 mb-1">
          <div className="w-10 shrink-0" />
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="w-12 text-center text-xs text-gray-400 font-medium">
              {getLabel(c + 1, colMode)}
            </div>
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex gap-1 mb-1 items-center">
            {/* Row header */}
            <div className="w-10 text-xs text-gray-400 font-medium text-right pr-1 shrink-0">
              {getLabel(r + 1, rowMode)}
            </div>
            {Array.from({ length: cols }, (_, c) => {
              const tree = treeMap[`${r + 1}-${c + 1}`];
              if (!tree) return (
                <div key={c} className="w-12 h-12 rounded-md border-2 border-dashed border-gray-200 bg-gray-50" />
              );
              return (
                <TreeCell
                  key={c}
                  tree={tree}
                  rowLabel={getLabel(r + 1, rowMode)}
                  colLabel={getLabel(c + 1, colMode)}
                  onClick={t => setSelected(t)}
                  isSelected={selected?.id === tree.id}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected Tree Panel */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Tree #{selected.id} — Row {selectedRowLabel}, Col {selectedColLabel}
              </h2>
              <p className="text-sm text-gray-500">{selected.variety || 'Unknown variety'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/trees/${selected.id}`)}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"
              >
                Full Details →
              </button>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Health Score</p>
              <p className={`font-bold text-lg ${getHealthColor(selected.healthScore)}`}>{selected.healthScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Current Season Yield</p>
              <p className="font-semibold text-green-700">{selected.currentSeasonYieldKg?.toFixed(1) ?? '—'} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Inspection</p>
              <p className="text-gray-700">{formatDate(selected.lastInspectionDate)}</p>
            </div>
          </div>
          {selected.notes && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded p-2">{selected.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
