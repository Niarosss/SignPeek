import { 
  FileArrowUpIcon, 
  ShieldCheckIcon,
  FilePdfIcon,
  FileDocIcon,
  FileZipIcon,
  CertificateIcon,
  EyeIcon,
  InfoIcon 
} from '@phosphor-icons/react';
import FormatHint from '../ui/FormatHint';
import Footer from './Footer';

export default function WelcomeScreen({ onSelect }) {
  return (
    <div className="w-full relative">
      
      <section className="relative min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center px-6 bg-[#F8FAFC] z-20 shadow-2xl shrink-0 border-b border-slate-100 p-2 md:p-4">
      
        <div className="max-w-3xl w-full text-center flex flex-col items-center">
          
          <div className="relative group mb-10">
            <div className="size-20 md:size-24 bg-white rounded-4xl shadow-2xl shadow-indigo-100 flex items-center justify-center border border-white transition-transform hover:scale-105 duration-500">
              <EyeIcon weight="duotone" className="size-10 md:size-12 text-slate-600 group-hover:rotate-4" />
            </div>
            <div className="absolute -right-1 -bottom-1 size-6 md:size-8 bg-emerald-500 rounded-full border-4 border-[#F8FAFC] flex items-center justify-center text-white shadow-lg">
              <ShieldCheckIcon weight="bold" className="size-3 md:size-4" />
            </div>
          </div>

          <div className="space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Sign
              <span className="text-slate-600">Peek</span>
            </h1>
            <p className="text-slate-700 text-base md:text-lg font-semibold max-w-sm mx-auto leading-tight opacity-80 px-4">
              Миттєвий та безпечний перегляд підписаних документів прямо у вашому браузері
            </p>

          </div>

          <div className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-40 select-none mb-6 md:mb-12">
              <FormatHint icon={FilePdfIcon} label="PDF" />
              <FormatHint icon={FileDocIcon} label="DOCX" />
              <FormatHint icon={FileZipIcon} label="ASIC-E" />
              <FormatHint icon={CertificateIcon} label="P7S" />
            </div>

            {onSelect && (
              <button
                onClick={() => document.getElementById('welcomeFileInput').click()}
                className="inline-flex items-center gap-4 bg-slate-700 hover:bg-slate-800 text-white px-8 md:px-12 py-4 md:py-5 rounded-3xl font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-slate-200 active:scale-95 cursor-pointer group"
              >
                <FileArrowUpIcon weight="bold" className="size-4 md:size-5 group-hover:-translate-y-1 transition-transform" />
                <span className="translate-y-[0.5px]">Обрати файл</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-slate-500/80 select-none px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Перетягніть
              </span>
              
              <span className="opacity-20 font-light text-lg">/</span>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                  Вставте
                </span>
                <span className="text-[9px] font-mono bg-slate-200/60 h-4.5 text-slate-500 px-1.5 py-0.5 rounded border border-slate-300/30 lowercase tracking-normal">
                  ctrl+v
                </span>
              </div>

              <span className="opacity-20 font-light text-lg">/</span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Оберіть файл
              </span>
            </div>

            <input id="welcomeFileInput" type="file" multiple hidden onChange={(e) => onSelect(e.target.files)} />

          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20 animate-bounce hidden md:block">
          <div className="w-px h-8  bg-slate-900" />
        </div>
      </section>

      <div
        className="relative h-125"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
        }}
      >
        <div className="fixed bottom-0 left-0 z-0 w-full h-125">
          <Footer />
        </div>
      </div>
    </div>
  );
}