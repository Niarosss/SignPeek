// Жодних важких статичних імпортів вгорі!

export async function processIncomingFile(file, parentId = null, depth = 0) {
  const buffer = file.buffer || await file.arrayBuffer();
  const name = file.name;
  const extension = name.split('.').pop().toLowerCase();

  let results = [];

  const containerExtensions = ['asice', 'asics', 'edoc', 'zip'];
  const documentExtensions = ['docx', 'xlsx', 'pptx', 'odt', 'ods'];

  if (containerExtensions.includes(extension) && !documentExtensions.includes(extension)) {
    const containerId = crypto.randomUUID();
    let zip;
    
    try {
      const mod = await import('jszip');
      const JSZip = mod.default || mod;
      zip = await JSZip.loadAsync(buffer);
    } catch (e) {
      return [await createFileData(name, buffer, parentId, depth)];
    }
    
    let commonSignatureInfo = null;

    const sigFileName = Object.keys(zip.files).find(p => {
      const up = p.toUpperCase();
      return up.includes('META-INF/') && 
             (up.endsWith('.P7S') || up.endsWith('.XML')) && 
             !up.includes('MANIFEST');
    });

    if (sigFileName) {
      const isXml = sigFileName.toUpperCase().endsWith('.XML');
      const sigBuf = await zip.files[sigFileName].async('arraybuffer');

      const { extractSignatureMetadata } = await import('./cryptoParser');
      const sigData = await extractSignatureMetadata(sigBuf, isXml);
      
      if (sigData.success && sigData.signers?.length > 0) {
        commonSignatureInfo = sigData.signers;
      }
    }

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

    for (const [path, entry] of Object.entries(zip.files)) {
      if (
        entry.dir || 
        path.toUpperCase().includes('META-INF/') || 
        path.toLowerCase() === 'mimetype'
      ) continue;

      const b = await entry.async('arraybuffer');
      const childName = path.split('/').pop();
      
      const children = await processIncomingFile({ name: childName, buffer: b }, containerId, depth + 1);
      results = [...results, ...children];
    }
    return results;
  }

  // 2. ОБРОБКА ПІДПИСІВ (P7S / P7M) ЯК КОНТЕЙНЕРІВ
  if (['p7s', 'p7m'].includes(extension)) {
    const containerId = crypto.randomUUID();

    const { extractSignatureMetadata } = await import('./cryptoParser');
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

    if (sigData.success && sigData.type === 'attached' && sigData.content) {
      const cleanName = name.replace(/\.p7s$|\.p7m$/i, '');
      const children = await processIncomingFile({ name: cleanName, buffer: sigData.content }, containerId, depth + 1);
      results = [...results, ...children];
    }
    return results;
  }

  return [await createFileData(name, buffer, parentId, depth)];
}

async function createFileData(name, buffer, parentId, depth) {
  const { fileTypeFromBuffer } = await import('file-type');
  const typeInfo = await fileTypeFromBuffer(buffer);
  
  let ext = typeInfo?.ext || name.split('.').pop().toLowerCase();
  const mimeType = typeInfo?.mime || 'application/octet-stream';

  if (ext === 'cfb') {
    if (name.toLowerCase().endsWith('.doc')) ext = 'doc';
    else if (name.toLowerCase().endsWith('.xls')) ext = 'xls';
    else ext = 'doc';
  }

  let finalName = name;
  if (!finalName.toLowerCase().endsWith('.' + ext)) {
    finalName += '.' + ext;
  }
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