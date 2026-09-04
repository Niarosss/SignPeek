import { useEffect, useState } from 'react';
import { useFiles } from './hooks/useFiles';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WelcomeScreen from './components/layout/WelcomeScreen';
import DropOverlay from './components/layout/DropOverlay';

import ViewerHost from './components/layout/ViewerHost';
import ViewerToolbar from './components/layout/ViewerToolbar';
import CertificateModal from './components/ui/CertificateModal';

import { ImageIcon, FileTextIcon, FileCodeIcon, WarningCircleIcon } from '@phosphor-icons/react';

function App() {
  const { 
    files, selectedFile, setSelectedFile, isDragging, setIsDragging,
    activeSignatureInfo, setActiveSignatureInfo, handleFiles, removeFile, exportFiles 
  } = useFiles();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Закриваємо сайдбар при виборі файлу
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [selectedFile]);


  // Вставка з буфера (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pasted = [];
      for (let item of items) {
        if (item.kind === 'file') pasted.push(item.getAsFile());
      }
      if (pasted.length > 0) handleFiles(pasted);
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const getFileIcon = (file) => {
    if (file.isDetached) return <WarningCircleIcon size={24} weight="duotone" className="text-amber-500" />;
    const mime = file.mimeType || "";
    if (mime.includes('image') || ['heic', 'tiff'].includes(file.extension)) return <ImageIcon size={24} weight="duotone" className="text-indigo-500" />;
    if (mime.includes('pdf')) return <FileTextIcon size={24} weight="duotone" className="text-red-500" />;
    return <FileCodeIcon size={24} weight="duotone" className="text-slate-400" />;
  };

  const hasFiles = files.length > 0;

  return (
    <div 
      className="h-dvh flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased tracking-tight relative"
      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} hasFiles={hasFiles} />

      <div className={`flex-1 flex relative ${hasFiles ? 'overflow-hidden' : ''}`}>
        
        {hasFiles ? (
          <>
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <Sidebar 
              files={files} 
              selectedFile={selectedFile} 
              onSelect={setSelectedFile}
              onAddFiles={handleFiles} 
              onRemove={removeFile}
              onCheckSignature={setActiveSignatureInfo}
              getFileIcon={getFileIcon}
              onExport={exportFiles}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
              {selectedFile && !selectedFile.isContainer && (
                <ViewerToolbar file={selectedFile} onRemove={removeFile} />
              )}
              <div className="flex-1 relative bg-slate-50/50 overflow-hidden flex items-center justify-center">
                <ViewerHost file={selectedFile} />
              </div>
            </main>
          </>
        ) : (
          <WelcomeScreen onSelect={handleFiles} />
        )}

        {isDragging && (
          <DropOverlay onLeave={() => setIsDragging(false)} onDrop={handleFiles} />
        )}
      </div>

      <CertificateModal 
        isOpen={!!activeSignatureInfo} 
        onClose={() => setActiveSignatureInfo(null)} 
        info={activeSignatureInfo} 
      />
    </div>
  );
}

export default App;