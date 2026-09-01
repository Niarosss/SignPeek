import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import heic2any from 'heic2any';
import UTIF from 'utif';
import { 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon, 
  ArrowClockwiseIcon, 
  CircleNotchIcon
} from '@phosphor-icons/react';
import ToolbarButton from '../ui/ToolbarButton';

export default function ImageViewer({ file }) {
  const [displayUrl, setDisplayUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let objectUrl = null;

    const processImage = async () => {
      setLoading(true);
      try {
        if (['heic', 'heif'].includes(file.extension)) {
          const convertedBlob = await heic2any({
            blob: file.blob,
            toType: 'image/jpeg',
            quality: 0.8
          });
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          objectUrl = URL.createObjectURL(blob);
        } 
        else if (['tif', 'tiff'].includes(file.extension)) {
          const buffer = await file.blob.arrayBuffer();
          const ifds = UTIF.decode(buffer);
          UTIF.decodeImage(buffer, ifds[0]);
          const rgba = UTIF.toRGBA8(ifds[0]);
          
          const canvas = document.createElement('canvas');
          canvas.width = ifds[0].width;
          canvas.height = ifds[0].height;
          const ctx = canvas.getContext('2d');
          const imgData = ctx.createImageData(canvas.width, canvas.height);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);
          
          objectUrl = canvas.toDataURL('image/jpeg');
        } 
        else {
          objectUrl = URL.createObjectURL(file.blob);
        }
        
        setDisplayUrl(objectUrl);
      } catch (err) {
        console.error("Image processing error:", err);
      } finally {
        setLoading(false);
      }
    };

    processImage();

    return () => {
      if (objectUrl && !objectUrl.startsWith('data:')) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircleNotchIcon size={48} weight="bold" className="text-slate-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm">Обробка зображення...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100">
       <TransformWrapper
        initialScale={1}
        minScale={0.6}
        maxScale={2}
        centerOnInit={true}
        centerZoomedOut={true}
        limitToBounds={true}
        smooth={true}
        wheel={{ 
          step: 0.002,
          activationKeys: [],
          touchPadDisabled: false
        }}
        zoomAnimation={{
          animationTime: 250,
          animationType: "easeOut"
        }}
        panning={{
          velocityDisabled: true
        }}
        doubleClick={{ mode: "reset" }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur shadow-2xl border border-slate-200 rounded-2xl p-1.5">
              <ToolbarButton 
                onClick={() => zoomOut()} 
                icon={<MagnifyingGlassMinusIcon size={20} weight="bold" />} 
                title="Зменшити" 
              />
              
              <div 
                className="px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => resetTransform()}
                title="Скинути зум"
              >
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 tabular-nums">
                  100%
                </span>
              </div>

              <ToolbarButton 
                onClick={() => zoomIn()} 
                icon={<MagnifyingGlassPlusIcon size={20} weight="bold" />} 
                title="Збільшити" 
              />
              
              <div className="w-px h-4 bg-slate-200 mx-1" />
              
              <ToolbarButton 
                onClick={() => setRotation(r => r + 90)} 
                icon={<ArrowClockwiseIcon size={20} weight="bold" />} 
                title="Повернути" 
              />
            </div>

            <TransformComponent wrapperClass="!w-full !h-full">
              <div 
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
                className="flex items-center justify-center"
              >
                <img 
                  src={displayUrl} 
                  alt={file.name} 
                  className="max-h-[90vh] max-w-full object-contain shadow-2xl pointer-events-none"
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}