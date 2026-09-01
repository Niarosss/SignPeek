import { 
  FileCodeIcon, 
  CheckCircleIcon, 
  XIcon, 
  DownloadSimpleIcon, 
  FileArchiveIcon,
  CaretDownIcon 
} from '@phosphor-icons/react';

export default function Sidebar({ 
  files, selectedFile, onSelect, onRemove, onCheckSignature, onExport, getFileIcon 
}) {
  return (
    <aside className="w-80 border-r border-slate-200/60 bg-white flex flex-col z-10 shrink-0 overflow-hidden">
      <div className="p-5 shrink-0">
        <button 
          onClick={() => document.getElementById('fileInput').click()}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
        >
          <FileArchiveIcon size={18} weight="bold" />
          <span className="text-xs font-bold uppercase tracking-widest leading-none">
            Відкрити файл
          </span>
        </button>
        <input id="fileInput" type="file" multiple hidden onChange={(e) => onSelect(e.target.files)} />
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
        {files.length === 0 ? (
          <div className="text-center py-20 opacity-20 flex flex-col items-center select-none">
             <FileArchiveIcon size={40} weight="thin" className="mb-2" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Список порожній</p>
          </div>
        ) : (
          files.map(file => {
            const isSelected = selectedFile?.id === file.id;
            const depthPadding = file.depth * 1.25 + 0.75;
            
            // --- КОНТЕЙНЕР ---
            if (file.isContainer) {
              return (
                <div key={file.id} className="mt-6 mb-3 px-3 group relative" style={{ paddingLeft: `${depthPadding}rem` }}>
                  {file.depth > 0 && (
                    <div className="absolute top-6 bottom-0 w-px bg-slate-100" 
                         style={{ left: `${depthPadding - 0.6}rem` }} />
                  )}

                  <div className="overflow-hidden whitespace-nowrap mb-2 pr-6">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest truncate group-hover:overflow-visible group-hover:animate-marquee">
                      {file.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CaretDownIcon size={14} weight="bold" className="text-slate-300" />
                    
                    <div className="flex items-center gap-1.5">
                      {file.isSigned && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onCheckSignature(file.signatureInfo); }}
                          className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 hover:bg-green-600 hover:text-white transition-all cursor-pointer"
                        >
                          <CheckCircleIcon size={12} weight="fill" />
                          <span className="text-[9px] leading-0 font-bold uppercase">Підпис</span>
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onExport(file.id); }}
                        className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100 hover:bg-slate-600 hover:text-white transition-all cursor-pointer"
                      >
                        <DownloadSimpleIcon size={12} weight="bold" />
                        <span className="text-[9px] leading-0 font-bold uppercase">Вилучити</span>
                      </button>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(file.id); }} 
                      className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <XIcon size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              );
            }

            // --- ФАЙЛ ---
            return (
              <div 
                key={file.id}
                className="relative group select-none"
                style={{ paddingLeft: `${depthPadding - 1}rem` }}
              >
                <div className="absolute top-0 bottom-0 w-px bg-slate-100" 
                     style={{ left: `${depthPadding - 0.9}rem` }} />

                <div 
                  onClick={() => onSelect(file)}
                  className='
                    flex items-center gap-3 pl-3 h-[60px] transition-all mb-1'  
                >
                  {/* Іконка файлу */}
                  <div className={`
                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${isSelected ? 'bg-white shadow-md text-slate-600 border border-slate-100' : 'bg-white border border-slate-100 text-slate-400 shadow-sm'}
                  `}>
                    {getFileIcon(file)}
                  </div>

                  {/* Текст */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="h-5 flex items-center overflow-hidden whitespace-nowrap">
                      <p className={`
                        text-[13px] font-bold transition-colors
                        ${isSelected ? 'text-slate-700 text-shadow-md' : 'text-slate-500'}
                        truncate group-hover:overflow-visible group-hover:animate-marquee
                      `}>
                        {file.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                      {file.extension} • {(file.size/1024).toFixed(0)} KB
                    </p>
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5 ml-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); onExport(file.id); }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                    >
                      <DownloadSimpleIcon size={18} weight="bold" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(file.id); }} 
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-all active:scale-90"
                    >
                      <XIcon size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}