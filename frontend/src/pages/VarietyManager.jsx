import { useEffect, useState } from 'react';
import { getVarieties, createVariety, updateVariety, deleteVariety } from '../api/varieties';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function VarietyManager() {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    getVarieties()
      .then(res => setVarieties(res.data))
      .catch(() => setError('Failed to load varieties.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setFormError('');
    try {
      await createVariety({ name: newName.trim() });
      setNewName('');
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add variety.');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateVariety(id, { name: editName.trim() });
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from the list?`)) return;
    try {
      await deleteVariety(id);
      load();
    } catch {
      alert('Failed to delete variety.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading varieties..." />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tree Varieties</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the list of tree varieties used across the farm. These appear in all dropdowns when adding or editing trees.
        </p>
      </div>

      {/* Add new variety */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add New Variety</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setFormError(''); }}
            placeholder="e.g. Alphonso, Coconut, Guava…"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
          >
            {adding ? 'Adding…' : '+ Add'}
          </button>
        </form>
        {formError && <p className="text-red-500 text-xs mt-2">{formError}</p>}
      </div>

      {/* Varieties list */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Your Varieties</span>
          <span className="text-xs text-gray-400">{varieties.length} total</span>
        </div>

        {varieties.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No varieties yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {varieties.map(v => (
              <li key={v.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                {editingId === v.id ? (
                  <div className="flex gap-2 flex-1 mr-3">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleEdit(v.id); if (e.key === 'Escape') setEditingId(null); }}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button onClick={() => handleEdit(v.id)} className="text-xs text-green-700 hover:underline font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm text-gray-800 font-medium">{v.name}</span>
                  </div>
                )}
                {editingId !== v.id && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditingId(v.id); setEditName(v.name); setFormError(''); }}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.id, v.name)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
