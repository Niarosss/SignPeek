import { useState } from 'react';
import { processIncomingFile } from '../utils/fileProcessor';
import JSZip from 'jszip';

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSignatureInfo, setActiveSignatureInfo] = useState(null);

  const handleFiles = async (rawFiles) => {
    let allExtracted = [];
    for (let f of rawFiles) {
      const processed = await processIncomingFile(f);
      allExtracted = [...allExtracted, ...processed];
    }
    setFiles(prev => [...prev, ...allExtracted]);
    if (allExtracted.length > 0) {
      const firstRealFile = allExtracted.find(f => !f.isContainer);
      setSelectedFile(firstRealFile || allExtracted[0]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const getChildIds = (parentId) => {
        const children = prev.filter(f => f.parentId === parentId);
        let ids = children.map(c => c.id);
        children.forEach(c => { ids = [...ids, ...getChildIds(c.id)]; });
        return ids;
      };

      const idsToRemove = [id, ...getChildIds(id)];
      prev.forEach(f => { if (idsToRemove.includes(f.id) && f.url) URL.revokeObjectURL(f.url); });

      let updated = prev.filter(f => !idsToRemove.includes(f.id));

      // Очищення порожніх контейнерів
      let hasEmpty = true;
      while (hasEmpty) {
        const before = updated.length;
        updated = updated.filter(f => !f.isContainer || updated.some(c => c.parentId === f.id));
        if (updated.length === before) hasEmpty = false;
      }

      if (idsToRemove.includes(selectedFile?.id) || !updated.find(f => f.id === selectedFile?.id)) {
        setSelectedFile(updated.find(f => !f.isContainer) || null);
      }
      return updated;
    });
  };

  const exportFiles = async (id) => {
    const node = files.find(f => f.id === id);
    if (!node) return;

    // 1. Рекурсивно знаходимо всі файли (НЕ контейнери), що належать цьому вузлу
    const getAllChildFiles = (parentId) => {
      const children = files.filter(f => f.parentId === parentId);
      let results = children.filter(f => !f.isContainer);
      
      children.forEach(c => {
        results = [...results, ...getAllChildFiles(c.id)];
      });
      return results;
    };

    const targetFiles = node.isContainer ? getAllChildFiles(id) : [node];

    if (targetFiles.length === 0) return;

    // 2. Логіка завантаження
    if (targetFiles.length === 1) {
      const f = targetFiles[0];
      const link = document.createElement('a');
      link.href = f.url;
      link.download = f.name;
      link.click();
    } else {
      // Багато файлів: пакуємо в ZIP
      const zip = new JSZip();
      targetFiles.forEach(f => {
        zip.file(f.name, f.blob);
      });

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipContent);
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `вилучено_з_${node.name.split('.')[0]}.zip`;
      link.click();
      
      URL.revokeObjectURL(zipUrl);
    }
  };

  return {
    files, setFiles,
    selectedFile, setSelectedFile,
    isDragging, setIsDragging,
    activeSignatureInfo, setActiveSignatureInfo,
    handleFiles, removeFile, exportFiles
  };
}