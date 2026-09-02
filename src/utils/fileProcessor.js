import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';
import { extractSignatureMetadata } from './cryptoParser';

export async function processIncomingFile(file, parentId = null, depth = 0) {
  // Обробка вхідних даних (File або Buffer з рекурсії)
  const buffer = file.buffer || await file.arrayBuffer();
  const name = file.name;
  const extension = name.split('.').pop().toLowerCase();

  let results = [];

  // Перелік розширень, які ми вважаємо контейнерами
  const containerExtensions = ['asice', 'asics', 'edoc', 'zip'];
  // Перелік розширень, які НЕ ТРЕБА розпаковувати (навіть якщо це ZIP всередині)
  const documentExtensions = ['docx', 'xlsx', 'pptx', 'odt', 'ods'];

  // 1. ОБРОБКА КОНТЕЙНЕРІВ (ASiC-E, ZIP)
  if (containerExtensions.includes(extension) && !documentExtensions.includes(extension)) {
    const containerId = crypto.randomUUID();
    let zip;
    
    try {
      zip = await JSZip.loadAsync(buffer);
    } catch (e) {
      return [await createFileData(name, buffer, parentId, depth)];
    }
    
    let commonSignatureInfo = null;

    // Пошук файлу підпису (CAdES .p7s або XAdES .xml) у папці META-INF
    const sigFileName = Object.keys(zip.files).find(p => {
      const up = p.toUpperCase();
      return up.includes('META-INF/') && 
             (up.endsWith('.P7S') || up.endsWith('.XML')) && 
             !up.includes('MANIFEST');
    });

    if (sigFileName) {
      const isXml = sigFileName.toUpperCase().endsWith('.XML');
      const sigBuf = await zip.files[sigFileName].async('arraybuffer');
      const sigData = await extractSignatureMetadata(sigBuf, isXml);
      
      if (sigData.success && sigData.signers?.length > 0) {
        commonSignatureInfo = sigData.signers;
      }
    }

    // Додаємо вузол контейнера (Джерело)
    results.push({
      id: containerId,
      parentId,
      name,
      isContainer: true,
      isSigned: !!commonSignatureInfo,
      signatureInfo: commonSignatureInfo,
      size: buffer.byteLength,
      extension,
      depth
    });

    // Рекурсивна обробка вмісту контейнера
    for (const [path, entry] of Object.entries(zip.files)) {
      if (
        entry.dir || 
        path.toUpperCase().includes('META-INF/') || 
        path.toLowerCase() === 'mimetype'
      ) continue;

      const b = await entry.async('arraybuffer');
      const childName = path.split('/').pop();
      
      // Викликаємо саму себе для кожного файлу всередині
      const children = await processIncomingFile({ name: childName, buffer: b }, containerId, depth + 1);
      results = [...results, ...children];
    }
    return results;
  }

  // 2. ОБРОБКА ПІДПИСІВ (P7S / P7M) ЯК КОНТЕЙНЕРІВ
  if (['p7s', 'p7m'].includes(extension)) {
    const containerId = crypto.randomUUID();
    const sigData = await extractSignatureMetadata(buffer, false);

    results.push({
      id: containerId,
      parentId,
      name,
      isContainer: true,
      isSigned: sigData.success && sigData.signers?.length > 0,
      signatureInfo: sigData.signers,
      size: buffer.byteLength,
      extension,
      depth
    });

    // Якщо всередині підпису є файл (attached), розпаковуємо його рекурсивно
    if (sigData.success && sigData.type === 'attached' && sigData.content) {
      const cleanName = name.replace(/\.p7s$|\.p7m$/i, '');
      const children = await processIncomingFile({ name: cleanName, buffer: sigData.content }, containerId, depth + 1);
      results = [...results, ...children];
    }
    return results;
  }

  // 3. КІНЦЕВИЙ ФАЙЛ (Звичайний документ або зображення)
  return [await createFileData(name, buffer, parentId, depth)];
}

/**
 * Допоміжна функція для створення об'єкта файлу з валідацією типів та імен
 */
async function createFileData(name, buffer, parentId, depth) {
  const typeInfo = await fileTypeFromBuffer(buffer);
  let ext = typeInfo?.ext || name.split('.').pop().toLowerCase();
  const mimeType = typeInfo?.mime || 'application/octet-stream';

  // Корекція для застарілих форматів Microsoft Office (CFB контейнери)
  if (ext === 'cfb') {
    if (name.toLowerCase().endsWith('.doc')) ext = 'doc';
    else if (name.toLowerCase().endsWith('.xls')) ext = 'xls';
    else ext = 'doc';
  }

  // Формування чистого імені без дублювання розширень
  let finalName = name;
  if (!finalName.toLowerCase().endsWith('.' + ext)) {
    finalName += '.' + ext;
  }
  // Очищення артефактів типу .doc.cfb або .doc.doc
  finalName = finalName.replace(/\.doc\.cfb$/i, '.doc').replace(/\.doc\.doc$/i, '.doc');

  const blob = new Blob([buffer], { type: mimeType });
  
  return {
    id: crypto.randomUUID(),
    parentId,
    name: finalName,
    blob,
    url: URL.createObjectURL(blob),
    mimeType,
    extension: ext,
    size: buffer.byteLength,
    depth
  };
}