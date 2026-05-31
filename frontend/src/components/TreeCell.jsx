import { getStatusConfig } from '../utils/treeUtils';

export default function TreeCell({ tree, rowLabel, colLabel, onClick, isSelected, selectMode }) {
  const config = getStatusConfig(tree.status);
  const label = `${rowLabel}-${colLabel}`;
  return (
    <button
      onClick={() => onClick(tree)}
      title={`Row ${rowLabel}, Col ${colLabel} — ${tree.variety || 'Unknown'} (${config.label})`}
      className={`
        relative flex flex-col items-center justify-center shrink-0
        w-12 h-12 rounded-md border-2 transition-all cursor-pointer
        hover:scale-110 hover:shadow-md hover:z-10
        ${config.color}
        ${isSelected && selectMode ? 'ring-4 ring-blue-400 ring-offset-1 scale-105 z-10 brightness-110' : ''}
        ${isSelected && !selectMode ? 'ring-2 ring-offset-1 ring-gray-800 scale-110 z-10' : ''}
        ${!isSelected ? 'border-white/40' : ''}
      `}
    >
      {isSelected && selectMode && (
        <span className="absolute top-0.5 right-0.5 bg-blue-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold">✓</span>
      )}
      <span className="text-white text-[9px] font-bold leading-none">{label}</span>
      <span className="text-white/80 text-[8px] leading-none mt-0.5">{tree.healthScore}</span>
    </button>
  );
}
