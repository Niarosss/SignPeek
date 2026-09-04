import { 
  FileArrowUpIcon, 
  ShieldCheckIcon,
  FilePdfIcon,
  FileDocIcon,
  FileZipIcon,
  CertificateIcon,
  EyeIcon 
} from '@phosphor-icons/react';
import FormatHint from '../ui/FormatHint';
import Footer from './Footer';

export default function WelcomeScreen({ onSelect }) {
  return (
    <div className="w-full relative">
      
      <section className="relative min-h-[calc(100dvh-64px)] w-full flex flex-col items-center justify-center px-4 py-8 xl:[@media(min-height:850px)]:py-16 bg-[#F8FAFC] z-20 shadow-2xl shrink-0 border-b border-slate-100">
      
        <div className="max-w-3xl w-full text-center flex flex-col items-center gap-8 xl:[@media(min-height:850px)]:gap-16">

          <div className="relative group shrink-0">
            <div className="size-18 xl:[@media(min-height:850px)]:size-24 bg-white rounded-3xl xl:[@media(min-height:850px)]:rounded-4xl shadow-xl shadow-slate-200/60 flex items-center justify-center border border-white transition-transform hover:scale-105 duration-500">
              <EyeIcon weight="duotone" className="size-9 xl:[@media(min-height:850px)]:size-12 text-slate-600 group-hover:rotate-4" />
            </div>
            <div className="absolute -right-1 -bottom-1 size-6 xl:[@media(min-height:850px)]:size-8 bg-emerald-500 rounded-full border-2 xl:[@media(min-height:850px)]:border-4 border-[#F8FAFC] flex items-center justify-center text-white shadow-md">
              <ShieldCheckIcon weight="bold" className="size-3 xl:[@media(min-height:850px)]:size-4" />
            </div>
          </div>

          <div className="space-y-2 xl:[@media(min-height:850px)]:space-y-4 max-w-xl shrink-0">
            <h1 className="text-4xl xl:[@media(min-height:850px)]:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Sign<span className="text-slate-600">Peek</span>
            </h1>
            <p className="max-w-md text-slate-600 text-sm xl:[@media(min-height:850px)]:text-lg font-semibold leading-snug px-4">
              Миттєвий та безпечний перегляд підписаних документів прямо у вашому браузері
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-5 xl:[@media(min-height:850px)]:gap-8">
            
            <div className="flex flex-wrap justify-center items-center gap-5 xl:[@media(min-height:850px)]:gap-10 opacity-40 select-none">
              <FormatHint icon={FilePdfIcon} label="PDF" />
              <FormatHint icon={FileDocIcon} label="DOCX" />
              <FormatHint icon={FileZipIcon} label="ASIC-E" />
              <FormatHint icon={CertificateIcon} label="P7S" />
            </div>

            {onSelect && (
              <button
                onClick={() => document.getElementById('welcomeFileInput').click()}
                className="inline-flex items-center gap-3.5 bg-slate-700 hover:bg-slate-800 text-white px-8 xl:[@media(min-height:850px)]:px-12 py-4 xl:[@media(min-height:850px)]:py-5 rounded-2xl xl:[@media(min-height:850px)]:rounded-3xl font-bold text-xs xl:[@media(min-height:850px)]:text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-slate-300 active:scale-95 cursor-pointer group"
              >
                <FileArrowUpIcon weight="bold" className="size-4.5 xl:[@media(min-height:850px)]:size-5 group-hover:-translate-y-1 transition-transform" />
                <span className="translate-y-[0.5px]">Обрати файл</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-slate-500/80 select-none px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Перетягніть
              </span>
              
              <span className="opacity-20 font-light text-base">/</span>
              
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                  Вставте
                </span>
                <span className="text-[9px] font-mono bg-slate-200/70 h-4 text-slate-500 px-1 rounded border border-slate-300/40 lowercase tracking-normal flex items-center">
                  ctrl+v
                </span>
              </div>

              <span className="opacity-20 font-light text-base">/</span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Оберіть файл
              </span>
            </div>

            <input 
              id="welcomeFileInput" 
              type="file" 
              multiple 
              hidden 
              onChange={(e) => {
                if (e.target.files?.length > 0) {
                  onSelect(e.target.files);
                  e.target.value = '';
                }
              }} 
            />

          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 animate-bounce hidden [@media(min-height:800px)]:block">
          <div className="w-px h-8 bg-slate-900" />
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