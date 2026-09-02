import Sidebar from './Sidebar';
import ViewerToolbar from './ViewerToolbar';
import ViewerHost from './ViewerHost';
import CertificateModal from '../ui/CertificateModal';

export default function Workspace({ 
  files, 
  selectedFile, 
  setSelectedFile, 
  removeFile, 
  exportFiles, 
  activeSignatureInfo, 
  setActiveSignatureInfo,
  getFileIcon 
}) {
  return (
    <div className="flex-1 flex overflow-hidden relative">
      <Sidebar 
        files={files} 
        selectedFile={selectedFile} 
        onSelect={setSelectedFile} 
        onRemove={removeFile}
        onCheckSignature={setActiveSignatureInfo}
        getFileIcon={getFileIcon}
        onExport={exportFiles}
      />

      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedFile && !selectedFile.isContainer && (
          <ViewerToolbar file={selectedFile} onRemove={removeFile} />
        )}
        
        <div className="flex-1 relative bg-slate-50/50 overflow-hidden flex items-center justify-center">
          <ViewerHost file={selectedFile} />
        </div>
      </main>

      <CertificateModal 
        isOpen={!!activeSignatureInfo} 
        onClose={() => setActiveSignatureInfo(null)} 
        info={activeSignatureInfo} 
      />
    </div>
  );
}