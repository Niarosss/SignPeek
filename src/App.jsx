// src/App.jsx
import { useFiles } from './hooks/useFiles';
import Header from './components/layout/Header';
import WelcomeScreen from './components/layout/WelcomeScreen';
import Workspace from './components/layout/Workspace';
import DropOverlay from './components/layout/DropOverlay';
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
    <div 
      className="h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 text-[14px] relative"
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <Header />

      {hasFiles ? (
        <Workspace 
          files={files}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          removeFile={removeFile}
          exportFiles={exportFiles}
          activeSignatureInfo={activeSignatureInfo}
          setActiveSignatureInfo={setActiveSignatureInfo}
          getFileIcon={getFileIcon}
        />
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
  );
}

export default App;