import { useState } from 'react';
import { getYields, createYield, deleteYield } from '../api/yields';
import { formatDate } from '../utils/treeUtils';

export default function YieldHistory({ treeId, onTreeUpdated }) {
  const [yields, setYields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    seasonYear: new Date().getFullYear(),
    estimatedYieldKg: '',
    actualYieldKg: '',
    harvestDate: '',
    remarks: '',
  });

  const load = async () => {
    if (yields !== null) return;
    setLoading(true);
    try {
      const res = await getYields(treeId);
      setYields(res.data);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!open) load();
    setOpen(v => !v);
  };

  const handle = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    await createYield({
      ...form,
      treeId,
      seasonYear: Number(form.seasonYear),
      estimatedYieldKg: form.estimatedYieldKg ? Number(form.estimatedYieldKg) : null,
      actualYieldKg: form.actualYieldKg ? Number(form.actualYieldKg) : null,
    });
    const res = await getYields(treeId);
    setYields(res.data);
    setShowForm(false);
    onTreeUpdated?.();
  };

  const remove = async (id) => {
    if (!confirm('Delete this yield record?')) return;
    await deleteYield(id);
    setYields(prev => prev.filter(y => y.id !== id));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
      >
        <span>📊 Yield History</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowForm(v => !v)}
              className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
            >
              + Add Yield Record
            </button>
          </div>

          {showForm && (
            <form onSubmit={submit} className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Season Year</label>
                <input type="number" min="2000" max="2100" value={form.seasonYear} onChange={handle('seasonYear')} required
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Estimated Yield (kg)</label>
                <input type="number" step="0.1" value={form.estimatedYieldKg} onChange={handle('estimatedYieldKg')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Actual Yield (kg)</label>
                <input type="number" step="0.1" value={form.actualYieldKg} onChange={handle('actualYieldKg')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Harvest Date</label>
                <input type="date" value={form.harvestDate} onChange={handle('harvestDate')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Remarks</label>
                <input type="text" value={form.remarks} onChange={handle('remarks')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                <button type="submit" className="bg-green-600 text-white text-xs px-4 py-1.5 rounded hover:bg-green-700">Save</button>
              </div>
            </form>
          )}

          {loading && <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>}

          {!loading && yields?.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">No yield records yet.</p>
          )}

          {!loading && yields?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 pr-3">Season</th>
                    <th className="pb-2 pr-3">Estimated (kg)</th>
                    <th className="pb-2 pr-3">Actual (kg)</th>
                    <th className="pb-2 pr-3">Harvest Date</th>
                    <th className="pb-2 pr-3">Remarks</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {yields.map(y => (
                    <tr key={y.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-3 font-medium">{y.seasonYear}</td>
                      <td className="py-2 pr-3">{y.estimatedYieldKg?.toFixed(1) ?? '—'}</td>
                      <td className="py-2 pr-3 font-semibold text-green-700">{y.actualYieldKg?.toFixed(1) ?? '—'}</td>
                      <td className="py-2 pr-3">{formatDate(y.harvestDate)}</td>
                      <td className="py-2 pr-3 text-gray-500">{y.remarks || '—'}</td>
                      <td className="py-2">
                        <button onClick={() => remove(y.id)} className="text-red-400 hover:text-red-600">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
