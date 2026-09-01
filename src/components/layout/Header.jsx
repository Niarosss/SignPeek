import { EyeIcon, ShieldCheckIcon, GitCommitIcon } from '@phosphor-icons/react';

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 justify-between z-20 shrink-0">

      <div className="flex items-center gap-3 select-none">
        <div className="relative">
          <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <EyeIcon size={22} weight="bold" />
          </div>
          <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
            <ShieldCheckIcon size={12} weight="bold" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="font-black text-xl leading-none tracking-tighter text-slate-800">
            Sign<span className="text-slate-600 font-black">Peek</span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1 leading-none">
            Зручний перегляд документів
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 opacity-40">
        <GitCommitIcon size={14} weight="bold" className="text-slate-400" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">
          v1.0.4 rdy
        </span>
      </div>
    </header>
  );
}