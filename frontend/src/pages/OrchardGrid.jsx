import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrees, updateTree } from '../api/trees';
import { getOrchards, updateOrchard } from '../api/orchards';
import { getVarieties } from '../api/varieties';
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

const STATUSES = ['HEALTHY', 'NEEDS_ATTENTION', 'DISEASED', 'DEAD'];

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
  const [addPosition, setAddPosition] = useState(null);
  const [rowMode, setRowMode] = useState('numbers');
  const [colMode, setColMode] = useState('numbers');

  // Grid resize
  const [showResize, setShowResize] = useState(false);
  const [resizeRows, setResizeRows] = useState('');
  const [resizeCols, setResizeCols] = useState('');
  const [resizeSaving, setResizeSaving] = useState(false);
  const [resizeError, setResizeError] = useState('');

  const openResize = () => {
    setResizeRows(String(orchard?.totalRows || 10));
    setResizeCols(String(orchard?.totalColumns || 12));
    setResizeError('');
    setShowResize(true);
  };

  const saveResize = async () => {
    const newRows = parseInt(resizeRows, 10);
    const newCols = parseInt(resizeCols, 10);
    if (!newRows || !newCols || newRows < 1 || newCols < 1) {
      setResizeError('Rows and columns must be at least 1.');
      return;
    }
    const outOfBounds = trees.find(t => t.rowNumber > newRows || t.columnNumber > newCols);
    if (outOfBounds) {
      setResizeError(`Tree at row ${outOfBounds.rowNumber}, col ${outOfBounds.columnNumber} would fall outside the new grid. Remove it first or use larger dimensions.`);
      return;
    }
    setResizeSaving(true);
    setResizeError('');
    try {
      const updated = await updateOrchard(orchard.id, { ...orchard, totalRows: newRows, totalColumns: newCols });
      setOrchard(updated.data);
      setShowResize(false);
    } catch {
      setResizeError('Failed to save. Please try again.');
    } finally {
      setResizeSaving(false);
    }
  };

  // Multi-select
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [varieties, setVarieties] = useState([]);
  const [bulkVariety, setBulkVariety] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkApplying, setBulkApplying] = useState(false);

  const navigate = useNavigate();

  const loadTrees = (orchardId) =>
    getTrees(orchardId).then(res => { setTrees(res.data); setFilteredTrees(res.data); });

  useEffect(() => {
    Promise.all([getOrchards(), getVarieties()])
      .then(([orchRes, varRes]) => {
        const o = orchRes.data[0];
        setOrchard(o);
        setVarieties(varRes.data);
        return getTrees(o.id);
      })
      .then(res => { setTrees(res.data); setFilteredTrees(res.data); })
      .catch(() => setError('Failed to load orchard data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!orchard) return;
    const hasFilters = Object.values(filters).some(v => v !== '' && v != null);
    if (!hasFilters) { setFilteredTrees(trees); return; }
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

  const toggleSelect = (tree) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(tree.id) ? next.delete(tree.id) : next.add(tree.id);
      return next;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setBulkVariety('');
    setBulkStatus('');
  };

  const applyBulk = async () => {
    if (!bulkVariety && !bulkStatus) return;
    setBulkApplying(true);
    try {
      const selectedTrees = trees.filter(t => selectedIds.has(t.id));
      await Promise.all(selectedTrees.map(t =>
        updateTree(t.id, {
          orchardId: t.orchardId,
          rowNumber: t.rowNumber,
          columnNumber: t.columnNumber,
          variety: bulkVariety || t.variety,
          plantingDate: t.plantingDate,
          status: bulkStatus || t.status,
          healthScore: t.healthScore,
          lastInspectionDate: t.lastInspectionDate,
          currentSeasonYieldKg: t.currentSeasonYieldKg,
          totalLifetimeYieldKg: t.totalLifetimeYieldKg,
          notes: t.notes,
        })
      ));
      await loadTrees(orchard.id);
      exitSelectMode();
    } finally {
      setBulkApplying(false);
    }
  };

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
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectMode(v => !v); setSelectedIds(new Set()); setSelected(null); }}
            className={`text-sm px-4 py-2 rounded border transition-colors ${
              selectMode
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {selectMode ? `Selecting (${selectedIds.size})` : '☑ Select Trees'}
          </button>
          {selectMode && (
            <button onClick={exitSelectMode} className="text-sm px-3 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
          )}
          {!selectMode && (
            <>
              <button
                onClick={openResize}
                className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                ⊞ Resize Grid
              </button>
              <button
                onClick={() => { setAddPosition(null); setShowAddForm(v => !v); }}
                className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
              >
                + Add Tree
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Edit Panel */}
      {selectMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 shadow-sm">
          <p className="text-sm font-medium text-blue-800 mb-3">
            {selectedIds.size === 0
              ? 'Click trees on the grid to select them'
              : `${selectedIds.size} tree${selectedIds.size > 1 ? 's' : ''} selected`}
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Set Variety</label>
              <select
                value={bulkVariety}
                onChange={e => setBulkVariety(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white min-w-[160px]"
              >
                <option value="">— Keep existing —</option>
                {varieties.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Set Status</label>
              <select
                value={bulkStatus}
                onChange={e => setBulkStatus(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white min-w-[160px]"
              >
                <option value="">— Keep existing —</option>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <button
              onClick={applyBulk}
              disabled={selectedIds.size === 0 || (!bulkVariety && !bulkStatus) || bulkApplying}
              className="bg-blue-600 text-white text-sm px-5 py-1.5 rounded hover:bg-blue-700 disabled:opacity-40"
            >
              {bulkApplying ? 'Applying…' : `Apply to ${selectedIds.size} tree${selectedIds.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* Resize Grid Panel */}
      {showResize && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Resize Grid</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="200"
                value={resizeRows}
                onChange={e => setResizeRows(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-24"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="200"
                value={resizeCols}
                onChange={e => setResizeCols(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-24"
              />
            </div>
            <button
              onClick={saveResize}
              disabled={resizeSaving}
              className="bg-green-600 text-white text-sm px-5 py-1.5 rounded hover:bg-green-700 disabled:opacity-40"
            >
              {resizeSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setShowResize(false)}
              className="text-sm px-4 py-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          {resizeError && <p className="mt-3 text-sm text-red-600">{resizeError}</p>}
          <p className="mt-2 text-xs text-gray-400">Current: {orchard?.totalRows} × {orchard?.totalColumns}</p>
        </div>
      )}

      {showAddForm && !selectMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Add New Tree{addPosition ? ` — Row ${addPosition.row}, Col ${addPosition.col}` : ''}
          </h2>
          <TreeForm
            orchardId={orchard.id}
            defaultRow={addPosition?.row}
            defaultCol={addPosition?.col}
            onSaved={() => { setShowAddForm(false); setAddPosition(null); loadTrees(orchard.id); }}
            onCancel={() => { setShowAddForm(false); setAddPosition(null); }}
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
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 overflow-x-scroll scrollbar-always"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div style={{ minWidth: `${cols * 52 + 48}px` }}>
          {/* Column headers */}
          <div className="flex gap-1 mb-1">
            <div className="w-10 shrink-0" />
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className="w-12 shrink-0 text-center text-xs text-gray-400 font-medium">
                {getLabel(c + 1, colMode)}
              </div>
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex gap-1 mb-1 items-center">
              <div className="w-10 shrink-0 text-xs text-gray-400 font-medium text-right pr-1">
                {getLabel(r + 1, rowMode)}
              </div>
              {Array.from({ length: cols }, (_, c) => {
                const tree = treeMap[`${r + 1}-${c + 1}`];
                if (!tree) return (
                  <div
                    key={c}
                    title={`Add tree at row ${r + 1}, col ${c + 1}`}
                    onClick={() => {
                      if (selectMode) return;
                      setAddPosition({ row: r + 1, col: c + 1 });
                      setShowAddForm(true);
                      setSelected(null);
                    }}
                    className="w-12 h-12 shrink-0 rounded-md border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                  />
                );
                return (
                  <TreeCell
                    key={c}
                    tree={tree}
                    rowLabel={getLabel(r + 1, rowMode)}
                    colLabel={getLabel(c + 1, colMode)}
                    onClick={t => {
                      if (selectMode) toggleSelect(t);
                      else setSelected(t);
                    }}
                    isSelected={selectMode ? selectedIds.has(tree.id) : selected?.id === tree.id}
                    selectMode={selectMode}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Single Tree Preview Panel (normal mode only) */}
      {!selectMode && selected && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Tree #{selected.id} — Row {selectedRowLabel}, Col {selectedColLabel}
              </h2>
              <p className="text-sm text-gray-500">{selected.variety || 'No variety set'}</p>
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
