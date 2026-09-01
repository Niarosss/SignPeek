import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';

const OID_MAP = { 
  "2.5.4.3": "CN", "2.5.4.10": "O", "2.5.4.11": "OU", 
  "2.5.4.7": "L", "2.5.4.42": "GN", "2.5.4.4": "SN", 
  "1.2.840.113549.1.9.1": "E" 
};

function parseRDN(dn) { 
  const result = {}; 
  if (!dn || !dn.typesAndValues) return result; 
  for (const rdn of dn.typesAndValues) { 
    const type = OID_MAP[rdn.type] || rdn.type; 
    result[type] = rdn.value.valueBlock.value; 
  } 
  return result; 
}

function getMetadataFromCert(cert) { 
  const subject = parseRDN(cert.subject); 
  const issuer = parseRDN(cert.issuer); 
  return { 
    subject: subject.CN || `${subject.GN || ''} ${subject.SN || ''}`.trim() || "Підписувач", 
    organization: subject.O || "Фізична особа", 
    issuer: issuer.CN || issuer.O || "АЦСК", 
    validFrom: cert.notBefore.value, 
    validTo: cert.notAfter.value 
  }; 
}

export async function extractSignatureMetadata(buffer, isXml = false) {
  try {
    if (isXml) {
      const xmlText = new TextDecoder().decode(buffer);
      const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
      const certNodes = xmlDoc.getElementsByTagNameNS("*", "X509Certificate");
      const signers = [];
      for (let node of certNodes) {
        const certBase64 = node.textContent.replace(/\s/g, '');
        const binaryString = atob(certBase64);
        const certUint8 = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) certUint8[i] = binaryString.charCodeAt(i);
        const asn1 = asn1js.fromBER(certUint8.buffer);
        const cert = new pkijs.Certificate({ schema: asn1.result });
        signers.push(getMetadataFromCert(cert));
      }
      return { success: true, signers };
    }

    const uint8 = new Uint8Array(buffer);
    const asn1 = asn1js.fromBER(uint8.buffer);
    if (asn1.offset === -1) return { success: false, error: "Bad ASN.1" };

    const cmsContent = new pkijs.ContentInfo({ schema: asn1.result });
    if (cmsContent.contentType !== "1.2.840.113549.1.7.2") return { success: false, error: "Not SignedData" };

    const signedData = new pkijs.SignedData({ schema: cmsContent.content });
    const signers = (signedData.certificates || []).map(cert => getMetadataFromCert(cert));
    
    let content = null;
    let type = 'detached';
    if (signedData.encapContentInfo && signedData.encapContentInfo.eContent) {
      content = signedData.encapContentInfo.eContent.valueBlock.valueHex;
      type = 'attached';
    }

    return { success: true, type, content, signers };
  } catch (error) {
    return { success: false, error: error.message };
  }
}