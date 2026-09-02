import { DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react';

export default function ViewerToolbar({ file, onRemove }) {
  return (
    <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-bold text-slate-700 truncate select-all">
          {file.name}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a 
          href={file.url} 
          download={file.name}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-600 transition-all shadow-sm active:scale-95"
        >
          <DownloadSimpleIcon size={16} weight="bold" />
          <span>Зберегти {file.extension?.toUpperCase()}</span>
        </a>

        <div className="w-px h-6 bg-slate-100 mx-1" />

        <button
          onClick={() => onRemove(file.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
          title="Закрити документ"
        >
          <TrashIcon size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}