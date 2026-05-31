import { useEffect, useState } from 'react';
import { getAllDropdownOptions, createDropdownOption, updateDropdownOption, deleteDropdownOption } from '../api/dropdownOptions';
import { getVarieties, createVariety, updateVariety, deleteVariety } from '../api/varieties';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORY_LABELS = {
  VARIETIES: { label: 'Varieties', description: 'Tree varieties shown in all tree forms (e.g. Alphonso, Kesar, Coconut).' },
  CANOPY_CONDITION: { label: 'Canopy Condition', description: 'Options for canopy condition during tree inspections.' },
  TRUNK_CONDITION: { label: 'Trunk Condition', description: 'Options for trunk condition during tree inspections.' },
};

function OptionSection({ categoryKey, label, description, items, onAdd, onEdit, onDelete }) {
  const [newValue, setNewValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    setAdding(true);
    setError('');
    try {
      await onAdd(categoryKey, newValue.trim());
      setNewValue('');
    } catch (err) {
      setError(err.response?.data?.message || 'Already exists or failed to add.');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      await onEdit(id, editValue.trim());
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">{label}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>

      {/* Add input */}
      <div className="px-5 py-3 border-b border-gray-100">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={e => { setNewValue(e.target.value); setError(''); }}
            placeholder={`Add new ${label.toLowerCase()} option…`}
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={adding || !newValue.trim()}
            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
          >
            {adding ? 'Adding…' : '+ Add'}
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No options yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <li key={item.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50">
              {editingId === item.id ? (
                <div className="flex gap-2 flex-1 mr-3">
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(item.id); if (e.key === 'Escape') setEditingId(null); }}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button onClick={() => handleEdit(item.id)} className="text-xs text-green-700 hover:underline font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs text-gray-300 w-4 text-right">{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  <span className="text-sm text-gray-800">{item.name || item.value}</span>
                </div>
              )}
              {editingId !== item.id && (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditingId(item.id); setEditValue(item.name || item.value); setError(''); }}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >Edit</button>
                  <button
                    onClick={() => onDelete(item.id, item.name || item.value)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >Remove</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="px-5 py-2 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-400">{items.length} option{items.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

export default function DropdownSettings() {
  const [varieties, setVarieties] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [varRes, optRes] = await Promise.all([getVarieties(), getAllDropdownOptions()]);
      setVarieties(varRes.data);
      const grouped = {};
      optRes.data.forEach(o => {
        if (!grouped[o.category]) grouped[o.category] = [];
        grouped[o.category].push(o);
      });
      setDropdownOptions(grouped);
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Variety handlers
  const handleAddVariety = async (_, value) => {
    await createVariety({ name: value });
    await load();
  };
  const handleEditVariety = async (id, value) => {
    await updateVariety(id, { name: value });
    await load();
  };
  const handleDeleteVariety = async (id, name) => {
    if (!confirm(`Remove "${name}"?`)) return;
    await deleteVariety(id);
    await load();
  };

  // Generic dropdown handlers
  const handleAddOption = async (category, value) => {
    await createDropdownOption(category, { value });
    await load();
  };
  const handleEditOption = async (id, value) => {
    await updateDropdownOption(id, { value });
    await load();
  };
  const handleDeleteOption = async (id, value) => {
    if (!confirm(`Remove "${value}"?`)) return;
    await deleteDropdownOption(id);
    await load();
  };

  if (loading) return <LoadingSpinner message="Loading settings…" />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dropdown Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all dropdown options used across the app from one place. Changes apply everywhere immediately.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Varieties */}
        <OptionSection
          categoryKey="VARIETIES"
          label={CATEGORY_LABELS.VARIETIES.label}
          description={CATEGORY_LABELS.VARIETIES.description}
          items={varieties}
          onAdd={handleAddVariety}
          onEdit={handleEditVariety}
          onDelete={handleDeleteVariety}
        />

        {/* Other dropdown categories */}
        {['CANOPY_CONDITION', 'TRUNK_CONDITION'].map(cat => (
          <OptionSection
            key={cat}
            categoryKey={cat}
            label={CATEGORY_LABELS[cat].label}
            description={CATEGORY_LABELS[cat].description}
            items={dropdownOptions[cat] || []}
            onAdd={handleAddOption}
            onEdit={handleEditOption}
            onDelete={handleDeleteOption}
          />
        ))}
      </div>
    </div>
  );
}
