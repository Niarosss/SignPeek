import { useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import JSZip from 'jszip';

export default function DocxViewer({ file }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.JSZip) {
      window.JSZip = JSZip;
    }

    const renderDocx = async () => {
      if (file.blob && containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          await renderAsync(file.blob, containerRef.current, null, {
            className: "docx",
            inWrapper: true,      
            ignoreWidth: false,   
            ignoreHeight: false,  
            breakPages: true,     
          });
        } catch (error) {
          console.error("Помилка рендерингу DOCX:", error);
        }
      }
    };

    renderDocx();
  }, [file]);

  return (
    <div className="w-full h-full overflow-auto bg-[#E2E8F0] custom-scrollbar">
      <style>{`
        /* Обгортка: нуль відступів від тулбару та боків */
        .docx-wrapper {
          background-color: transparent !important;
          padding: 0 !important; 
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 1px !important; /* Тонка лінія розділення між сторінками */
        }
        
        /* Сама сторінка */
        .docx-wrapper section.docx {
          background-color: white !important;
          box-shadow: none !important;
          margin: 0 !important;
          width: 816px !important; /* Чистий A4 */
          min-height: 1056px !important;
          
          /* ТІЛЬКИ ВНУТРІШНІ ВІДСТУПИ (Margins документа) */
          padding: 20mm !important; 
          
          box-sizing: border-box !important;
          position: relative !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .docx-wrapper p {
          margin-bottom: 0.1em !important;
        }
      `}</style>
      
      <div ref={containerRef} className="w-full" />
    </div>
  );
}