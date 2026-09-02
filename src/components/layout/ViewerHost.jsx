import PdfViewer from '../engines/PdfViewer';
import DocxViewer from '../engines/DocxViewer';
import XlsxViewer from '../engines/XlsxViewer';
import ImageViewer from '../engines/ImageViewer';
import { 
  FileArchiveIcon, 
  DownloadSimpleIcon, 
  FileDocIcon, 
  WarningCircleIcon, 
  CertificateIcon,
  MagnifyingGlassIcon
} from '@phosphor-icons/react';

export default function ViewerHost({ file }) {
  if (!file) return null;
  
  // Обробка контейнерів
  if (file.isContainer) {
    return <ContainerInfo file={file} />;
  }

  const mime = file.mimeType || "";
  const ext = file.extension?.toLowerCase();

  // 1. Обробка зображень
  if (mime.startsWith('image/') || ['heic', 'heif', 'tiff', 'tif'].includes(ext)) {
    return <ImageViewer file={file} />;
  }

  // 2. PDF
  if (mime === 'application/pdf' || ext === 'pdf') {
    return <PdfViewer file={file} />;
  }

  // 3. Word (.docx)
  if (ext === 'docx') {
    return <DocxViewer file={file} />;
  }

  // 4. Ексель
  if (['xlsx', 'xls', 'csv'].includes(ext)) {
    return <XlsxViewer file={file} />;
  }

  // 5. ЗАГЛУШКА ДЛЯ СТАРОГО WORD (.doc або .cfb)
  if (ext === 'doc' || ext === 'cfb' || mime === 'application/msword') {
    return (
      <div className="text-center p-12 max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-50 rounded-4xl flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-100 shadow-sm">
           <FileDocIcon size={48} weight="duotone" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight text-center uppercase">Формат .DOC не підтримується</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
          Цей файл створено у застарілій версії Word. Прямий перегляд бінарних .doc файлів у браузері неможливий з міркувань безпеки та приватності.
        </p>
        <a 
          href={file.url} 
          download={file.name}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 cursor-pointer"
        >
          <DownloadSimpleIcon size={20} weight="bold" />
          <span>Завантажити файл</span>
        </a>
      </div>
    );
  }

  // 6. Загальний Fallback
  return (
    <div className="text-center p-20 animate-in fade-in">
      <WarningCircleIcon size={48} weight="thin" className="mx-auto mb-4 text-slate-300" />
      <h3 className="text-lg font-bold text-slate-700">{file.name}</h3>
      <p className="text-slate-400 mb-6 text-sm">Перегляд цього формату недоступний</p>
      <a href={file.url} download={file.name} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl font-semibold text-xs uppercase tracking-wide hover:bg-slate-300 transition-colors">
        Завантажити
      </a>
    </div>
  );
}

function ContainerInfo({ file }) {
  const isDetached = file.extension === 'p7s' || file.extension === 'p7m';

  return (
    <div className="text-center p-12 max-w-md mx-auto animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-white rounded-4xl flex items-center justify-center mx-auto mb-8 text-slate-300 border border-slate-100 shadow-xl shadow-slate-200/50 relative">
         {isDetached ? (
           <CertificateIcon size={48} weight="duotone" className="text-indigo-500" />
         ) : (
           <FileArchiveIcon size={48} weight="duotone" className="text-slate-400" />
         )}
         
         {file.isSigned && (
           <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
             <MagnifyingGlassIcon size={16} weight="bold" />
           </div>
         )}
      </div>

      <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-3 px-4">
        {file.name}
      </h3>

      {isDetached ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Це <span className="text-slate-900 font-bold">від'єднаний цифровий підпис</span>. Він містить лише криптографічні дані та сертифікат підписувача.
          </p>
          <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-4xl text-[11px] text-indigo-600 font-bold uppercase tracking-wider leading-normal">
            Для перегляду змісту завантажте оригінальний файл документа окремо
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
          Це джерело вкладених файлів. Оберіть конкретний документ у списку ліворуч для перегляду.
        </p>
      )}
    </div>
  );
}