import { useState, useEffect } from 'react';
import { getInspections, createInspection, deleteInspection } from '../api/inspections';
import { getDropdownOptions } from '../api/dropdownOptions';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/treeUtils';

const STATUSES = ['HEALTHY', 'NEEDS_ATTENTION', 'DISEASED', 'DEAD'];

export default function InspectionList({ treeId, onTreeUpdated }) {
  const [inspections, setInspections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [canopyOptions, setCanopyOptions] = useState([]);
  const [trunkOptions, setTrunkOptions] = useState([]);
  const [form, setForm] = useState({
    inspectionDate: new Date().toISOString().split('T')[0],
    status: 'HEALTHY',
    healthScore: 80,
    diseaseObserved: false,
    pestObserved: false,
    irrigationIssue: false,
    canopyCondition: '',
    trunkCondition: '',
    notes: '',
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getDropdownOptions('CANOPY_CONDITION'),
      getDropdownOptions('TRUNK_CONDITION'),
    ]).then(([c, t]) => {
      setCanopyOptions(c.data);
      setTrunkOptions(t.data);
    }).catch(() => {});
  }, []);

  const load = async () => {
    if (inspections !== null) return;
    setLoading(true);
    try {
      const res = await getInspections(treeId);
      setInspections(res.data);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!open) load();
    setOpen(v => !v);
  };

  const submit = async (e) => {
    e.preventDefault();
    await createInspection({ ...form, treeId, healthScore: Number(form.healthScore) });
    const res = await getInspections(treeId);
    setInspections(res.data);
    setShowForm(false);
    onTreeUpdated?.();
  };

  const remove = async (id) => {
    if (!confirm('Delete this inspection?')) return;
    await deleteInspection(id);
    setInspections(prev => prev.filter(i => i.id !== id));
  };

  const handle = (key) => (e) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
      >
        <span>🔍 Inspection History</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowForm(v => !v)}
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"
            >
              + Log Inspection
            </button>
          </div>

          {showForm && (
            <form onSubmit={submit} className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Date</label>
                <input type="date" value={form.inspectionDate} onChange={handle('inspectionDate')} required
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={handle('status')} className="border border-gray-300 rounded px-2 py-1.5 w-full bg-white">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Health Score (0–100)</label>
                <input type="number" min="0" max="100" value={form.healthScore} onChange={handle('healthScore')} required
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Canopy Condition</label>
                <select value={form.canopyCondition} onChange={handle('canopyCondition')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full bg-white">
                  <option value="">— Select —</option>
                  {canopyOptions.map(o => <option key={o.id} value={o.value}>{o.value}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Trunk Condition</label>
                <select value={form.trunkCondition} onChange={handle('trunkCondition')}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full bg-white">
                  <option value="">— Select —</option>
                  {trunkOptions.map(o => <option key={o.id} value={o.value}>{o.value}</option>)}
                </select>
              </div>
              <div className="flex gap-4 items-center pt-4">
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" checked={form.diseaseObserved} onChange={handle('diseaseObserved')} /> Disease
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" checked={form.pestObserved} onChange={handle('pestObserved')} /> Pest
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" checked={form.irrigationIssue} onChange={handle('irrigationIssue')} /> Irrigation Issue
                </label>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={handle('notes')} rows={2}
                  className="border border-gray-300 rounded px-2 py-1.5 w-full" />
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          )}

          {loading && <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>}

          {!loading && inspections?.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">No inspections recorded yet.</p>
          )}

          {!loading && inspections?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 pr-3">Date</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2 pr-3">Health</th>
                    <th className="pb-2 pr-3">Issues</th>
                    <th className="pb-2 pr-3">Canopy</th>
                    <th className="pb-2 pr-3">Notes</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map(ins => (
                    <tr key={ins.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-3 whitespace-nowrap">{formatDate(ins.inspectionDate)}</td>
                      <td className="py-2 pr-3"><StatusBadge status={ins.status} /></td>
                      <td className="py-2 pr-3 font-medium">{ins.healthScore}</td>
                      <td className="py-2 pr-3">
                        {[ins.diseaseObserved && '🦠', ins.pestObserved && '🐛', ins.irrigationIssue && '💧'].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="py-2 pr-3 text-gray-500">{ins.canopyCondition || '—'}</td>
                      <td className="py-2 pr-3 text-gray-500 max-w-xs truncate">{ins.notes || '—'}</td>
                      <td className="py-2">
                        <button onClick={() => remove(ins.id)} className="text-red-400 hover:text-red-600">✕</button>
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
