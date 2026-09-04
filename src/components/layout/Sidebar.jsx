import { CheckCircleIcon, XIcon, DownloadSimpleIcon, FileArchiveIcon, CaretDownIcon, ArrowLeftIcon } from '@phosphor-icons/react';

export default function Sidebar({ 
  files, selectedFile, onSelect, onAddFiles, onRemove, onCheckSignature, onExport, getFileIcon, isOpen, onClose 
}) {

  return (
    <aside className={`
      /* до 768px */
      fixed inset-0 z-60 w-full bg-white flex flex-col transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      /* від 768px */
      md:relative md:translate-x-0 md:w-80 md:z-10 md:border-r md:border-slate-200/60
    `}>
      <div className="p-4 shrink-0 flex flex-col gap-4 border-b border-slate-50 md:border-none">
        <div className="flex items-center justify-between md:hidden">
           <button onClick={onClose} className="p-2 -ml-2 text-slate-400 active:scale-90 transition-transform">
              <ArrowLeftIcon size={24} weight="bold" />
           </button>
           <span className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Документи</span>
           <div className="w-10" />
        </div>

        <button 
          onClick={() => document.getElementById('sidebarFileInput').click()} 
          className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer transition-all"
        >
          <FileArchiveIcon size={18} weight="bold" />
          <span className="translate-y-[0.5px]">Відкрити файл</span>
        </button>
        <input 
          id="sidebarFileInput" 
          type="file" 
          multiple 
          hidden 
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              onAddFiles(e.target.files);
              e.target.value = '';
            }
          }}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
        {files.length === 0 ? (
          <div className="text-center py-20 opacity-20 flex flex-col items-center">
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
                      className="ml-auto md:opacity-0 md:group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
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
                    flex items-center gap-3 pl-3 h-15 transition-all mb-1'  
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

                  <div className="flex items-center md:opacity-0 md:group-hover:opacity-100 transition-all gap-0.5 ml-auto">
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