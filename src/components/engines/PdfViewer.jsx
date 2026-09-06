import { useState, useEffect, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import { 
  CircleNotchIcon, 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon, 
  ArrowsInLineHorizontalIcon 
} from '@phosphor-icons/react';
import ToolbarButton from '../ui/ToolbarButton';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(scrollContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setNumPages(null);
  }, [file.url]);

  const documentOptions = useMemo(() => ({
      cMapUrl: new URL('pdfjs-dist/cmaps/', import.meta.url).toString() + '/',
      cMapPacked: true,
      verbosity: 0,
    }), []);

  const pageWidth = containerWidth > 0 && containerWidth < 848 
    ? containerWidth - 32 
    : undefined;

  return (
    <div className="relative w-full h-full bg-slate-200/50 flex flex-col overflow-hidden">
      <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/70 backdrop-blur shadow-2xl border border-slate-200 rounded-2xl p-1 md:p-1.5">
        <ToolbarButton 
          onClick={() => setScale(s => Math.max(s - 0.2, 0.4))} 
          icon={<MagnifyingGlassMinusIcon size={20} weight="bold" />} 
          title="Зменшити" 
        />
        
        <div 
          className="px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => setScale(1.0)}
          title="Скинути масштаб"
        >
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 tabular-nums">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <ToolbarButton 
          onClick={() => setScale(s => Math.min(s + 0.2, 3.0))} 
          icon={<MagnifyingGlassPlusIcon size={20} weight="bold" />} 
          title="Збільшити" 
        />
        
        <div className="w-px h-4 bg-slate-200 mx-1" />
        
        <ToolbarButton 
          onClick={() => setScale(1.2)} 
          icon={<ArrowsInLineHorizontalIcon size={20} weight="bold" />} 
          title="По ширині" 
        />
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-4 md:p-6">
        <Document
          key={file.url}
          file={file.url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          options={documentOptions}
          loading={<LoadingSpinner />}
        >
          {numPages && Array.from(new Array(numPages), (_, index) => (
            <div key={`${file.id}-page-${index + 1}`} className="mb-8 flex justify-center">
              <div className="shadow-2xl bg-white relative">
                <Page 
                  pageNumber={index + 1} 
                  scale={scale}
                  width={pageWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  loading=""
                />
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <CircleNotchIcon size={40} className="animate-spin text-slate-500 mb-4" />
      <p className="text-slate-500 font-bold">Завантаження PDF...</p>
    </div>
  );
}