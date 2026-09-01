import { useFiles } from './hooks/useFiles';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DropOverlay from './components/layout/DropOverlay';
import ViewerArea from './components/viewer/ViewerArea';
import WelcomeScreen from './components/viewer/WelcomeScreen';
import CertificateModal from './components/ui/CertificateModal';
import { ImageIcon, FileTextIcon, FileCodeIcon, WarningCircleIcon } from '@phosphor-icons/react';

function App() {
  const { 
    files, selectedFile, setSelectedFile, isDragging, setIsDragging,
    activeSignatureInfo, setActiveSignatureInfo, handleFiles, removeFile, exportFiles 
  } = useFiles();

  const getFileIcon = (file) => {
    if (file.isDetached) return <WarningCircleIcon size={24} weight="duotone" className="text-amber-500" />;
    if (file.mimeType?.includes('image')) return <ImageIcon size={24} weight="duotone" className="text-indigo-500" />;
    if (file.mimeType?.includes('pdf')) return <FileTextIcon size={24} weight="duotone" className="text-red-500" />;
    return <FileCodeIcon size={24} weight="duotone" className="text-slate-500" />;
  };

  const hasFiles = files.length > 0;

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-[14px]">
      <Header />

      <div 
        className="flex-1 flex overflow-hidden relative"
        onDragEnter={() => setIsDragging(true)}
      >
        {hasFiles ? (
          <>
            <Sidebar 
              files={files} 
              selectedFile={selectedFile} 
              onSelect={setSelectedFile} 
              onRemove={removeFile}
              onCheckSignature={setActiveSignatureInfo}
              getFileIcon={getFileIcon}
              onExport={exportFiles}
            />

            <ViewerArea 
              selectedFile={selectedFile} 
              onRemove={removeFile}
              onResolveDetached={handleFiles}
            />
          </>
        ) : (
          <WelcomeScreen onSelect={handleFiles} />
        )}

        {isDragging && (
          <DropOverlay 
            onLeave={() => setIsDragging(false)} 
            onDrop={handleFiles} 
          />
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