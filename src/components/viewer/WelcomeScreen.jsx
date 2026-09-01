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
    <div className="flex-1 flex flex-col items-center h-full bg-[#F8FAFC] animate-in fade-in duration-700 relative overflow-x-hidden overflow-y-auto custom-scrollbar">

      <div className="flex flex-col items-center w-full max-w-4xl min-h-full p-4 md:p-8 lg:p-12 z-10">

        <div className="flex flex-col items-center text-center space-y-6 md:space-y-10 mb-12 md:mb-24">
          <div className="relative group">
            <div className="size-20 md:size-24 bg-white rounded-4xl shadow-2xl shadow-indigo-100 flex items-center justify-center border border-white transition-transform hover:scale-105 duration-500">
              <EyeIcon weight="duotone" className="size-10 md:size-12 text-slate-600 group-hover:rotate-4 transition-transform duration-500" />
            </div>
            <div className="absolute -right-1 -bottom-1 size-6 md:size-8 bg-emerald-500 rounded-full border-4 border-[#F8FAFC] flex items-center justify-center text-white shadow-lg">
              <ShieldCheckIcon weight="bold" className="size-3 md:size-4" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Sign<span className="text-slate-600">Peek</span>
            </h1>
            <p className="text-slate-700 text-base md:text-lg font-medium max-w-sm mx-auto leading-tight opacity-80 px-4">
              Миттєвий та безпечний перегляд підписаних документів прямо у вашому браузері
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-full space-y-8 md:space-y-10 mb-12"> 
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-4 md:gap-8 opacity-40 select-none">
               <FormatHint icon={<FilePdfIcon className="size-6 md:size-7" />} label="PDF" />
               <FormatHint icon={<FileDocIcon className="size-6 md:size-7" />} label="DOCX" />
               <FormatHint icon={<FileZipIcon className="size-6 md:size-7" />} label="ASIC-E" />
               <FormatHint icon={<CertificateIcon className="size-6 md:size-7" />} label="P7S" />
            </div>
          </div>

          {onSelect && (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => document.getElementById('welcomeFileInput').click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-slate-500 hover:bg-slate-600 text-white px-10 py-4 md:py-5 rounded-3xl font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-slate-200 active:scale-95 cursor-pointer group"
              >
                <FileArrowUpIcon weight="bold" className="size-5 md:size-6 group-hover:-translate-y-1 transition-transform" />
                <span className="translate-y-[0.5px]">Обрати файл</span>
              </button>
              <input id="welcomeFileInput" type="file" multiple hidden onChange={(e) => onSelect(e.target.files)} />
            </div>
          )}

          <div className='flex items-center gap-2 max-w-70 md:max-w-xl text-center justify-center'>
            <InfoIcon size={20} className="text-slate-400 shrink-0 hidden sm:block" />
            <p className="text-[10px] font-medium tracking-widest text-slate-500 leading-relaxed uppercase">
              Перетягніть підписаний файл в будь яку частину екрану або завантажте з носія
            </p>
          </div>
        </div>

        <div className="mt-auto w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-8 border-t border-slate-100">
           <FeatureItem 
              icon={<ShieldStarIcon size={20} weight="bold" className="text-emerald-500" />}
              title="Приватність"
              desc="Файли не залишають пристрій"
           />
           <FeatureItem 
              icon={<MagnifyingGlassIcon size={20} weight="bold" className="text-slate-500" />}
              title="Деталі підпису"
              desc="Перевірка сертифікатів та ПІБ"
           />
           <FeatureItem 
              icon={<FileZipIcon size={20} weight="bold" className="text-amber-500" />}
              title="Розпаковка"
              desc="Вилучення вмісту з контейнерів"
           />
           <FeatureItem 
              icon={<LightningIcon size={20} weight="bold" className="text-yellow-400" />}
              title="Швидкість"
              desc="Миттєвий перегляд вмісту"
           />
        </div>
      </div>
    </div>
  );
}

function FormatHint({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <span className="text-[8px] md:text-[9px] font-black tracking-widest">{label}</span>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center space-y-1.5 md:space-y-2 group">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-wider">{title}</h4>
      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase leading-tight tracking-tight px-1">{desc}</p>
    </div>
  );
}