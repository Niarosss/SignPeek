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
      if (file?.blob && containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          await renderAsync(file.blob, containerRef.current, null, {
            className: "docx",
            inWrapper: true,      
            ignoreWidth: false,   
            ignoreHeight: false,  
            breakPages: true,     
          });

          const paragraphs = containerRef.current.querySelectorAll('section.docx p');
          paragraphs.forEach((p) => {
            const marginLeft = parseFloat(window.getComputedStyle(p).marginLeft);
            if (marginLeft > 180) {
              p.classList.add('docx-header-right');
            }
          });
        } catch (error) {
          console.error("Помилка рендерингу DOCX:", error);
        }
      }
    };

    renderDocx();
  }, [file]);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#E2E8F0] custom-scrollbar flex justify-center p-0 md:p-6 touch-pan-y">
      <style>{`
        .docx-wrapper {
          background-color: transparent !important;
          padding: 0 !important; 
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 16px !important;
          width: 100% !important;
          overflow: visible !important;
        }
        
        .docx-wrapper section.docx {
          background-color: white !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
          margin: 0 auto !important;
          width: 100% !important; 
          max-width: 816px !important; 
          box-sizing: border-box !important;
          position: relative !important;
          padding: 16px !important;
          overflow: visible !important;
        }

        @media (min-width: 768px) {
          .docx-wrapper section.docx {
            padding: 20mm !important;
          }
        }

        @media (max-width: 767px) {
          .docx-wrapper p.docx-header-right {
            margin-left: auto !important;
            margin-right: 0 !important;
            width: fit-content !important;
            max-width: 75% !important;
            text-align: left !important;
          }

          .docx-wrapper section.docx p,
          .docx-wrapper section.docx span {
            word-break: normal !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
          }

          .docx-wrapper .docx-tab {
            display: none !important;
          }
        }

        .docx-wrapper table {
          max-width: 100% !important;
          width: 100% !important;
          table-layout: auto !important;
        }

        .docx-wrapper img {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
      
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}