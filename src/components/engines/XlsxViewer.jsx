import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function XlsxViewer({ file }) {
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { 
          type: 'array', 
          cellNF: true, 
          cellText: true, 
          cellDates: false 
        });
        
        const sheetData = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          
          if (worksheet['!ref']) {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            let lastDataRow = range.s.r;
            let lastDataCol = range.s.c;

            for (let R = range.s.r; R <= range.e.r; ++R) {
              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell && cell.v !== undefined && cell.v !== null && String(cell.v).trim() !== '') {
                  if (R > lastDataRow) lastDataRow = R;
                  if (C > lastDataCol) lastDataCol = C;
                }
              }
            }

            range.e.r = Math.min(lastDataRow + 1, range.e.r);
            range.e.c = Math.min(lastDataCol + 1, range.e.c);
        
            worksheet['!ref'] = XLSX.utils.encode_range(range);
          }

          const html = XLSX.utils.sheet_to_html(worksheet);
          return { name, html };
        });

        setSheets(sheetData);
      } catch (err) {
        console.error("Excel parse error:", err);
      }
      setLoading(false);
    };
    reader.readAsArrayBuffer(file.blob);
  }, [file]);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-400 text-[10px] font-black uppercase tracking-widest">
      Обробка таблиці...
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      <div className="flex bg-[#F1F3F4] border-b border-[#dadce0] overflow-x-auto shrink-0 px-4 pt-2 gap-0.5 no-scrollbar">
        {sheets.map((sheet, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSheet(idx)}
            className={`px-4 py-1.5 text-sm font-medium transition-all rounded-t-md border-x border-t ${
              activeSheet === idx 
                ? 'bg-white border-[#dadce0] text-[#1a73e8] z-10' 
                : 'bg-transparent border-transparent text-[#5f6368] hover:bg-[#e8eaed]'
            }`}
          >
            {sheet.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-0">
        <div className="inline-block min-w-full bg-white">
          <div 
            className="xlsx-render"
            dangerouslySetInnerHTML={{ __html: sheets[activeSheet]?.html }}
          />
        </div>
      </div>

      <style>{`
        .xlsx-render table {
          border-collapse: collapse;
          table-layout: auto;
          font-family: Arial, sans-serif;
          font-size: 13px;
          color: #3c4043;
          background: white;
        }

        .xlsx-render td {
          border: 1px solid #e0e2e4;
          padding: 4px 10px;
          min-width: 85px;
          height: 24px;
          white-space: nowrap;
          vertical-align: middle;
        }

        .xlsx-render tr:first-child td {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #5f6368;
          text-align: center;
        }

        .xlsx-render tr:hover td {
          background-color: #f1f3f4;
        }

        .xlsx-render td:empty::after {
          content: "\\00a0";
        }
      `}</style>
    </div>
  );
}