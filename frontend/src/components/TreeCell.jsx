import { getStatusConfig } from '../utils/treeUtils';

export default function TreeCell({ tree, onClick, isSelected }) {
  const config = getStatusConfig(tree.status);
  return (
    <button
      onClick={() => onClick(tree)}
      title={`Row ${tree.rowNumber}, Col ${tree.columnNumber} — ${tree.variety || 'Unknown'} (${config.label})`}
      className={`
        relative flex flex-col items-center justify-center
        w-12 h-12 rounded-md border-2 transition-all cursor-pointer
        hover:scale-110 hover:shadow-md hover:z-10
        ${config.color} ${isSelected ? 'ring-2 ring-offset-1 ring-gray-800 scale-110 z-10' : 'border-white/40'}
      `}
    >
      <span className="text-white text-[9px] font-bold leading-none">{tree.rowNumber}-{tree.columnNumber}</span>
      <span className="text-white/80 text-[8px] leading-none mt-0.5">{tree.healthScore}</span>
    </button>
  );
}
