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
            ignoreHeight: true, // Завжди ігноруємо жорстку висоту сторінки
            breakPages: false,  // Вимикаємо жорсткі розриви, щоб контент ішов природно
          });

          // Пост-обробка: знаходимо параграфи з великим відступом зліва (шапка заяви)
          const sections = containerRef.current.querySelectorAll('section.docx');
          sections.forEach((section) => {
            const sectionWidth = section.clientWidth || 800;
            const paragraphs = section.querySelectorAll('p');

            paragraphs.forEach((p) => {
              const style = window.getComputedStyle(p);
              const marginLeft = parseFloat(style.marginLeft) || 0;

              // Якщо відступ зліва займає більше 30% ширини аркуша
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
    <div className="w-full h-full overflow-y-auto bg-[#E2E8F0] custom-scrollbar flex justify-center p-2 md:p-6 touch-pan-y">
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
    margin: 0 auto 32px auto !important;
    width: 100% !important; 
    max-width: 816px !important; 
    min-height: 100% !important;
    height: auto !important;
    box-sizing: border-box !important;
    position: relative !important;
    padding: 20px !important;
    overflow: visible !important;
  }

  @media (min-width: 768px) {
    .docx-wrapper section.docx {
      padding: 20mm !important;
    }
  }

  /* 
    ГАРМОНІЙНА ШАПКА ЗАЯВИ:
    Починається приблизно з середини аркуша (48-52%) і не прилипає впритул до правого краю.
  */
  .docx-wrapper p.docx-header-right {
    margin-left: clamp(140px, 46%, 52%) !important;
    margin-right: 12px !important;
    max-width: 52% !important;
    width: auto !important;
    text-align: left !important;
    line-height: 1.35 !important;
  }

  /* Захист тексту від схлопування в літери */
  .docx-wrapper section.docx p,
  .docx-wrapper section.docx span {
    word-break: normal !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
  }

  /* Для екранів менше 860px (планшети, вузьке вікно з сайдбаром) */
  @media (max-width: 860px) {
    .docx-wrapper section.docx {
      padding: 16px !important;
      height: auto !important;
      min-height: auto !important;
    }

    .docx-wrapper p.docx-header-right {
      /* На планшеті/мобілці даємо трохи більше свободи, але тримаємо праворуч */
      margin-left: clamp(80px, 38%, 46%) !important;
      margin-right: 8px !important;
      max-width: 60% !important;
    }

    .docx-wrapper .docx-tab {
      display: inline !important;
      width: auto !important;
      max-width: 12px !important;
    }
  }

  /* Для вузьких телефонів (< 480px) */
  @media (max-width: 480px) {
    .docx-wrapper p.docx-header-right {
      margin-left: 28% !important;
      margin-right: 4px !important;
      max-width: 70% !important;
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