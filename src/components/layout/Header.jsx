import { 
  EyeIcon, 
  ShieldCheckIcon, 
  GitCommitIcon, 
  GithubLogoIcon,
  ListIcon
} from '@phosphor-icons/react';

export default function Header( { onMenuClick, hasFiles }) {
  const appVersion = import.meta.env.APP_VERSION || '0.0.0';

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 md:px-8 justify-between z-20 shrink-0">
      
      <div className="flex items-center gap-3 select-none">

        {hasFiles && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            title="Відкрити список документів"
          >
            <ListIcon size={24} weight="bold" />
          </button>
        )}

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
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1 leading-none">
            Більше ніж просто перегляд документів
          </p>
        </div>
      </div>

      <a 
        href="https://github.com/Niarosss/SignPeek" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-4 group cursor-pointer"
      >
        <div className="hidden md:flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <GitCommitIcon size={14} weight="bold" className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">
            v{appVersion} rdy
          </span>
        </div>
        
        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
          <GithubLogoIcon size={18} weight="bold" />
        </div>
      </a>
    </header>
  );
}