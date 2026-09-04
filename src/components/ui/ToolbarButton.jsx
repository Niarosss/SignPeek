export default function ToolbarButton({ onClick, icon, title }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className="p-2 hover:bg-indigo-50 hover:text-slate-800 rounded-lg transition-all text-slate-600"
    >
      {icon}
    </button>
  );
}