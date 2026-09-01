import { 
  FileArrowUpIcon, 
  ShieldCheckIcon,
  FilePdfIcon,
  FileDocIcon,
  FileZipIcon,
  CertificateIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  LightningIcon,
  ShieldStarIcon,
  InfoIcon
} from '@phosphor-icons/react';

export default function WelcomeScreen({ onSelect }) {
  return (
    <div className="flex-1 flex flex-col items-center h-full py-16 px-6 bg-[#F8FAFC] animate-in fade-in duration-700 justify-between relative overflow-hidden">

      <div className="flex flex-col items-center text-center z-10 space-y-8">
        <div className="relative group">
          <div className="w-24 h-24 bg-white rounded-[2.2rem] shadow-2xl shadow-indigo-100 flex items-center justify-center border border-white transition-transform hover:scale-105 duration-500">
            <EyeIcon size={48} weight="duotone" className="text-slate-600 group-hover:rotate-4 transition-transform duration-500" />
          </div>
          <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#F8FAFC] flex items-center justify-center text-white shadow-lg">
            <ShieldCheckIcon size={16} weight="bold" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Sign<span className="text-slate-600">Peek</span>
          </h1>
          <p className="text-slate-700 text-lg font-medium max-w-sm mx-auto leading-tight opacity-80">
            Миттєвий та безпечний перегляд підписаних документів прямо у вашому браузері
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-3xl z-10 space-y-12"> 

         
        
        <div className="flex flex-col items-center gap-8 w-full">

          <div className="flex items-center gap-8 opacity-40 select-none">
             <FormatHint icon={<FilePdfIcon size={28} />} label="PDF" />
             <FormatHint icon={<FileDocIcon size={28} />} label="DOCX" />
             <FormatHint icon={<FileZipIcon size={28} />} label="ASIC-E" />
             <FormatHint icon={<CertificateIcon size={28} />} label="P7S" />
          </div>
        </div>

          {onSelect && (
            <button
              onClick={() => document.getElementById('welcomeFileInput').click()}
              className="inline-flex items-center gap-4 bg-slate-500 hover:bg-slate-600 text-white px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-2xl shadow-slate-200 active:scale-95 cursor-pointer group"
            >
              <FileArrowUpIcon size={24} weight="bold" className="group-hover:-translate-y-1 transition-transform" />
              <span className="leading-none translate-y-[0.5px]">Обрати файл</span>
            </button>
          )}


          <div className='flex items-center gap-1'>
            <InfoIcon size={24} className="text-slate-400" />
            <p className=" text-xs font-medium tracking-widest leading-0 text-slate-600">
              Перетягніть підписаний файл в будь яку частину екрану або завантажте з носія
            </p>
            <input 
              id="welcomeFileInput" 
              type="file" 
              multiple 
              hidden 
              onChange={(e) => onSelect(e.target.files)} 
            />
          </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-4 gap-12 z-10 pt-8 border-t border-slate-100">
         <FeatureItem 
            icon={<ShieldStarIcon size={22} weight="bold" className="text-emerald-500" />}
            title="Приватність"
            desc="Файли не залишають пристрій"
         />
         <FeatureItem 
            icon={<MagnifyingGlassIcon size={22} weight="bold" className="text-slate-500" />}
            title="Деталі підпису"
            desc="Перевірка сертифікатів та ПІБ"
         />
         <FeatureItem 
            icon={<FileZipIcon size={22} weight="bold" className="text-amber-500" />}
            title="Розпаковка"
            desc="Вилучення вмісту з контейнерів"
         />
         <FeatureItem 
            icon={<LightningIcon size={22} weight="bold" className="text-yellow-300" />}
            title="Швидкість"
            desc="Миттєвий перегляд вмісту"
         />
      </div>
    </div>
  );
}

function FormatHint({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {icon}
      <span className="text-[9px] font-black tracking-widest">{label}</span>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 group">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{title}</h4>
      <p className="text-[10px] text-slate-500 font-medium uppercase leading-tight tracking-wide px-4">{desc}</p>
    </div>
  );
}