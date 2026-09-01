import ViewerToolbar from './ViewerToolbar';
import ViewerHost from './ViewerHost';
import WelcomeScreen from './WelcomeScreen';

export default function ViewerArea({ selectedFile, onRemove }) {
  if (!selectedFile) return <WelcomeScreen />;

  return (
    <main className="flex-1 flex flex-col bg-white overflow-hidden">
      {!selectedFile.isContainer && (
        <ViewerToolbar file={selectedFile} onRemove={onRemove} />
      )}
      <div className="flex-1 relative bg-slate-50/50 overflow-hidden flex items-center justify-center">
        <ViewerHost file={selectedFile} />
      </div>
    </main>
  );
}