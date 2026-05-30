import { useState } from 'react';
import { createTree, updateTree } from '../api/trees';

const STATUSES = ['HEALTHY', 'NEEDS_ATTENTION', 'DISEASED', 'DEAD'];

export default function TreeForm({ orchardId, tree, onSaved, onCancel }) {
  const [form, setForm] = useState({
    orchardId,
    rowNumber: tree?.rowNumber ?? '',
    columnNumber: tree?.columnNumber ?? '',
    variety: tree?.variety ?? '',
    plantingDate: tree?.plantingDate ?? '',
    status: tree?.status ?? 'HEALTHY',
    healthScore: tree?.healthScore ?? 80,
    currentSeasonYieldKg: tree?.currentSeasonYieldKg ?? '',
    totalLifetimeYieldKg: tree?.totalLifetimeYieldKg ?? '',
    notes: tree?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        rowNumber: Number(form.rowNumber),
        columnNumber: Number(form.columnNumber),
        healthScore: Number(form.healthScore),
        currentSeasonYieldKg: form.currentSeasonYieldKg ? Number(form.currentSeasonYieldKg) : null,
        totalLifetimeYieldKg: form.totalLifetimeYieldKg ? Number(form.totalLifetimeYieldKg) : null,
        plantingDate: form.plantingDate || null,
      };
      if (tree) {
        await updateTree(tree.id, payload);
      } else {
        await createTree(payload);
      }
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tree.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Row Number *</label>
        <input type="number" min="1" value={form.rowNumber} onChange={handle('rowNumber')} required
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Column Number *</label>
        <input type="number" min="1" value={form.columnNumber} onChange={handle('columnNumber')} required
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Variety</label>
        <input type="text" value={form.variety} onChange={handle('variety')} placeholder="e.g. Alphonso"
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Planting Date</label>
        <input type="date" value={form.plantingDate} onChange={handle('plantingDate')}
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Status *</label>
        <select value={form.status} onChange={handle('status')} required
          className="border border-gray-300 rounded px-2 py-1.5 w-full">
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Health Score (0-100) *</label>
        <input type="number" min="0" max="100" value={form.healthScore} onChange={handle('healthScore')} required
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Current Season Yield (kg)</label>
        <input type="number" step="0.1" value={form.currentSeasonYieldKg} onChange={handle('currentSeasonYieldKg')}
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Total Lifetime Yield (kg)</label>
        <input type="number" step="0.1" value={form.totalLifetimeYieldKg} onChange={handle('totalLifetimeYieldKg')}
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs text-gray-600 mb-1">Notes</label>
        <textarea value={form.notes} onChange={handle('notes')} rows={3}
          className="border border-gray-300 rounded px-2 py-1.5 w-full" />
      </div>

      {error && <div className="col-span-2 text-red-600 text-xs">{error}</div>}

      <div className="col-span-2 flex gap-2 justify-end border-t pt-3">
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:underline px-3 py-1.5">Cancel</button>
        <button type="submit" disabled={saving}
          className="bg-green-600 text-white text-sm px-5 py-1.5 rounded hover:bg-green-700 disabled:opacity-50">
          {saving ? 'Saving...' : tree ? 'Update Tree' : 'Add Tree'}
        </button>
      </div>
    </form>
  );
}
