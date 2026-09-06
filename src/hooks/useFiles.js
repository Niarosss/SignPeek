import { useState, useCallback } from 'react';
import { processIncomingFile } from '../utils/fileProcessor';

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSignatureInfo, setActiveSignatureInfo] = useState(null);

  const handleFiles = useCallback(async (rawFiles) => {
    const incoming = Array.from(rawFiles);
    let allNewExtracted = [];

    // Читаємо поточні файли без перезаписування замикання
    let currentFiles = [];
    setFiles(prev => {
      currentFiles = prev;
      return prev;
    });

    const existingMap = new Set(currentFiles.map(f => `${f.name}-${f.size}`));

    for (let f of incoming) {
      const fileKey = `${f.name}-${f.size}`;

      if (existingMap.has(fileKey)) {
        console.warn(`Файл ${f.name} вже є у списку.`);
        const found = currentFiles.find(ex => ex.name === f.name && ex.size === f.size);
        if (found) {
          const firstChild = currentFiles.find(child => child.parentId === found.id);
          setSelectedFile(firstChild || found);
        }
        continue;
      }

      try {
        const processed = await processIncomingFile(f);
        allNewExtracted = [...allNewExtracted, ...processed];
        existingMap.add(fileKey);
      } catch (err) {
        console.error("Помилка при обробці:", f.name, err);
      }
    }

    if (allNewExtracted.length > 0) {
      setFiles(prev => [...prev, ...allNewExtracted]);
      
      const firstRealFile = allNewExtracted.find(f => !f.isContainer);
      if (firstRealFile) setSelectedFile(firstRealFile);
    }
  }, []);

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

      let hasEmpty = true;
      while (hasEmpty) {
        const before = updated.length;
        updated = updated.filter(f => !f.isContainer || updated.some(c => c.parentId === f.id));
        if (updated.length === before) hasEmpty = false;
      }

      if (idsToRemove.includes(selectedFile?.id) || !updated.find(f => f.id === selectedFile?.id)) {
        const nextFile = updated.find(f => !f.isContainer);
        setSelectedFile(nextFile || null);
      }
      return updated;
    });
  };

  const exportFiles = async (id) => {
    const node = files.find(f => f.id === id);
    if (!node) return;

    const getAllChildFiles = (parentId) => {
      const children = files.filter(f => f.parentId === parentId);
      let results = children.filter(f => !f.isContainer);
      children.forEach(c => { results = [...results, ...getAllChildFiles(c.id)]; });
      return results;
    };

    const targetFiles = node.isContainer ? getAllChildFiles(id) : [node];
    if (targetFiles.length === 0) return;

    if (targetFiles.length === 1) {
      const f = targetFiles[0];
      const link = document.createElement('a');
      link.href = f.url; link.download = f.name; link.click();
    } else {
      const mod = await import('jszip');
      const JSZip = mod.default || mod;
      const zip = new JSZip();
      targetFiles.forEach(f => { zip.file(f.name, f.blob); });
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `extracted_from_${node.name.split('.')[0]}.zip`;
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