import { 
  ShieldStarIcon, 
  MagnifyingGlassIcon, 
  FileZipIcon, 
  LightningIcon, 
  GithubLogoIcon 
} from '@phosphor-icons/react';
import FeatureItem from '../ui/FeatureItem';

export default function Footer() {
  const appVersion = 
    import.meta.env?.VITE_APP_VERSION || 
    import.meta.env?.APP_VERSION || 
    '1.0.4';

  const currentYear = new Date().getFullYear();
  const startYear = 2026;

  return (
    <footer className="w-full bg-[#0B0F1A] text-white shrink-0">
      <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center min-h-125">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 md:gap-12">
          <FeatureItem 
            icon={ShieldStarIcon} 
            iconColor="text-emerald-400"
            title="Приватність" 
            desc="Файли не залишають пристрій" 
          />
          <FeatureItem 
            icon={MagnifyingGlassIcon} 
            iconColor="text-slate-400"
            title="Деталі підпису" 
            desc="Перевірка сертифікатів та ПІБ" 
          />
          <FeatureItem 
            icon={FileZipIcon} 
            iconColor="text-amber-500"
            title="Розпаковка" 
            desc="Вилучення вмісту з контейнерів" 
          />
          <FeatureItem 
            icon={LightningIcon} 
            iconColor="text-yellow-400"
            title="Швидкість" 
            desc="Миттєвий перегляд вмісту" 
          />
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8">
          
          <div className="text-center md:text-left space-y-3 md:space-y-6">
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter select-none leading-none">
              <span className="text-slate-300 ">Sign</span>
              <span className="text-slate-700">Peek</span>
            </h2>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>Open Source Project</span>
              <span className="text-slate-500">/</span>
              <span>MIT License</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-200">
                © {startYear === currentYear ? startYear : `${startYear}–${currentYear}`} SignPeek
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-center items-center md:items-end gap-3 w-full md:w-auto">
            <a 
              href="https://github.com/Niarosss/SignPeek" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 active:scale-95 px-5 py-2.5 rounded-2xl transition-all border border-white/5 group shadow-lg"
            >
              <GithubLogoIcon size={20} weight="bold" className="group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-none mb-1">Github</p>
                <p className="text-[10px] font-bold tracking-wider leading-none uppercase">v{appVersion} rdy</p>
              </div>
            </a>
            
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Developed by <span className="text-slate-100">Niaros</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}