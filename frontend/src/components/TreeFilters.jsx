const STATUSES = ['', 'HEALTHY', 'NEEDS_ATTENTION', 'DISEASED', 'DEAD'];

export default function TreeFilters({ filters, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Status</label>
        <select
          value={filters.status || ''}
          onChange={handle('status')}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Row</label>
        <input
          type="number" min="1" placeholder="Any"
          value={filters.row || ''}
          onChange={handle('row')}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-20"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Column</label>
        <input
          type="number" min="1" placeholder="Any"
          value={filters.col || ''}
          onChange={handle('col')}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-20"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Variety</label>
        <input
          type="text" placeholder="Any"
          value={filters.variety || ''}
          onChange={handle('variety')}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-28"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Min Health</label>
        <input
          type="number" min="0" max="100" placeholder="0"
          value={filters.minHealth || ''}
          onChange={handle('minHealth')}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-20"
        />
      </div>
      <button
        onClick={() => onChange({})}
        className="text-xs text-gray-500 hover:text-red-600 underline pb-1"
      >
        Clear
      </button>
    </div>
  );
}
