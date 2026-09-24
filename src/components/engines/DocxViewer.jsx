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
            ignoreHeight: true, 
            breakPages: false,
            trimXmlDeclaration: true,
            useBase64URL: true,
          });

          // Пост-обробка: знімаємо будь-які інлайн-обмеження висоти та переповнення
          const sections = containerRef.current.querySelectorAll('section.docx');
          sections.forEach((section) => {
            section.style.removeProperty('height');
            section.style.removeProperty('min-height');
            section.style.removeProperty('max-height');
            section.style.removeProperty('overflow');

            const sectionWidth = section.clientWidth || 800;
            const paragraphs = section.querySelectorAll('p');

            paragraphs.forEach((p) => {
              const style = window.getComputedStyle(p);
              const marginLeft = parseFloat(style.marginLeft) || 0;

              if (marginLeft > sectionWidth * 0.3) {
                p.classList.add('docx-header-right');
              }
            });
          });
        } catch (error) {
          console.error("Помилка рендерингу DOCX:", error);
        }
      }
    };

    renderDocx();
  }, [file]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#E2E8F0] custom-scrollbar p-2 pb-24 md:p-6 md:pb-12">
      <style>{`
  .docx-wrapper {
    background-color: transparent !important;
    padding: 0 !important; 
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 16px !important;
    width: 100% !important;
    min-height: min-content !important;
    overflow: visible !important;
  }
  
  /* Аркуш повинен рости під контент без примусового зрізання */
  .docx-wrapper section.docx {
    background-color: white !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    margin: 0 auto 16px auto !important;
    width: 100% !important; 
    max-width: 816px !important; 
    height: auto !important;
    min-height: auto !important;
    box-sizing: border-box !important;
    position: relative !important;
    padding: 24px 16px !important;
    /* Дозволяємо контейнеру рости разом з контентом, не ховаючи його */
    overflow: visible !important;
    display: block !important;
  }

  @media (min-width: 768px) {
    .docx-wrapper section.docx {
      padding: 20mm !important;
      min-height: 297mm !important;
      margin-bottom: 32px !important;
    }
  }

  /* Шапка заяви */
  .docx-wrapper p.docx-header-right {
    margin-left: clamp(140px, 46%, 52%) !important;
    margin-right: 12px !important;
    max-width: 52% !important;
    width: auto !important;
    text-align: left !important;
    line-height: 1.35 !important;
  }

  /* Захист тексту від виходу за межі */
  .docx-wrapper section.docx p,
  .docx-wrapper section.docx span {
    word-break: normal !important;
    overflow-wrap: anywhere !important;
    white-space: normal !important;
  }

  @media (max-width: 860px) {
    .docx-wrapper section.docx {
      padding: 20px 14px !important;
      height: auto !important;
      min-height: auto !important;
    }

    .docx-wrapper p.docx-header-right {
      margin-left: clamp(70px, 36%, 44%) !important;
      margin-right: 6px !important;
      max-width: 64% !important;
    }

    .docx-wrapper .docx-tab {
      display: inline !important;
      width: auto !important;
      max-width: 10px !important;
    }
  }

  @media (max-width: 480px) {
    .docx-wrapper p.docx-header-right {
      margin-left: 24% !important;
      margin-right: 4px !important;
      max-width: 74% !important;
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
      
      <div ref={containerRef} className="w-full" />
    </div>
  );
}