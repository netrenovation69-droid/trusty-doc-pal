import type { ProcessorFn, ProcessedResult, ProgressCallback } from './types';

// Helper to create PDF blob from Uint8Array (fixes TS Uint8Array/BlobPart compat)
const pdfBlob = (bytes: Uint8Array) => new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });

// Lazy imports for code splitting
const loadPdfLib = () => import('pdf-lib');
const loadPdfJs = async () => {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  return pdfjsLib;
};

// ==================== MANAGEMENT ====================

const mergePdfs: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement des fichiers…');
  const { PDFDocument } = await loadPdfLib();
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
    onProgress(10 + ((i + 1) / files.length) * 80, `Fusion du fichier ${i + 1}/${files.length}…`);
  }
  onProgress(95, 'Finalisation…');
  const result = await merged.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'fusionné.pdf' }] };
};

const splitPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement du PDF…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pageCount = doc.getPageCount();
  const results: ProcessedResult['files'] = [];
  for (let i = 0; i < pageCount; i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(doc, [i]);
    newDoc.addPage(page);
    const pdfBytes = await newDoc.save();
    results.push({
      blob: pdfBlob(pdfBytes),
      filename: `page_${i + 1}.pdf`
    });
    onProgress(10 + ((i + 1) / pageCount) * 85, `Extraction page ${i + 1}/${pageCount}…`);
  }
  onProgress(100, 'Terminé !');
  return { files: results };
};

const compressPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Chargement du PDF…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const originalSize = bytes.byteLength;
  const doc = await PDFDocument.load(bytes);
  onProgress(40, 'Optimisation en cours…');
  // Strip metadata for size reduction
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('DocuSûr');
  doc.setCreator('DocuSûr');
  onProgress(70, 'Recompilation…');
  const result = await doc.save();
  const newSize = result.byteLength;
  const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(result), filename: 'compressé.pdf' }],
    message: `Taille réduite de ${reduction}% (${formatBytes(originalSize)} → ${formatBytes(newSize)})`
  };
};

const rotatePdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, degrees } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const angle = Number(options?.angle || 90);
  onProgress(40, 'Rotation des pages…');
  doc.getPages().forEach(page => page.setRotation(degrees(page.getRotation().angle + angle)));
  onProgress(80, 'Sauvegarde…');
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'pivoté.pdf' }] };
};

const organizePdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const orderStr = (options?.order as string) || '';
  const pageCount = doc.getPageCount();
  const order = orderStr.split(',').map(s => parseInt(s.trim()) - 1).filter(n => !isNaN(n) && n >= 0 && n < pageCount);
  if (order.length === 0) throw new Error('Ordre de pages invalide. Utilisez des numéros séparés par des virgules.');
  onProgress(40, 'Réorganisation…');
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(doc, order);
  pages.forEach(p => newDoc.addPage(p));
  onProgress(80, 'Sauvegarde…');
  const result = await newDoc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'organisé.pdf' }] };
};

const repairPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Tentative de réparation…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  onProgress(30, 'Analyse de la structure…');
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  onProgress(60, 'Reconstruction…');
  doc.setProducer('DocuSûr - Réparé');
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(result), filename: 'réparé.pdf' }],
    message: 'Le PDF a été rechargé et reconstruit avec succès.'
  };
};

// ==================== EDITING ====================

const addPageNumbers: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pos = (options?.position as string) || 'bottom-center';
  const pages = doc.getPages();
  onProgress(30, 'Ajout des numéros…');
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const text = `${i + 1} / ${pages.length}`;
    const textWidth = font.widthOfTextAtSize(text, 10);
    let x = (width - textWidth) / 2;
    if (pos === 'bottom-right') x = width - textWidth - 40;
    if (pos === 'bottom-left') x = 40;
    page.drawText(text, { x, y: 30, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    onProgress(30 + ((i + 1) / pages.length) * 60);
  });
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'numéroté.pdf' }] };
};

const addWatermark: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, rgb, StandardFonts, degrees } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = (options?.text as string) || 'CONFIDENTIEL';
  const opacity = Number(options?.opacity || 30) / 100;
  const pages = doc.getPages();
  onProgress(30, 'Application du filigrane…');
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 8;
    page.drawText(text, {
      x: width / 2 - font.widthOfTextAtSize(text, fontSize) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: degrees(-45),
    });
    onProgress(30 + ((i + 1) / pages.length) * 60);
  });
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'filigrané.pdf' }] };
};

const editPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = (options?.text as string) || '';
  const pageIdx = Math.max(0, Number(options?.page || 1) - 1);
  const x = Number(options?.x || 50);
  const y = Number(options?.y || 50);
  if (!text) throw new Error('Veuillez saisir un texte à ajouter.');
  onProgress(50, 'Ajout du texte…');
  const pages = doc.getPages();
  const page = pages[Math.min(pageIdx, pages.length - 1)];
  page.drawText(text, { x, y: page.getSize().height - y, size: 14, font, color: rgb(0, 0, 0) });
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'modifié.pdf' }] };
};

const signPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.CourierOblique);
  const name = (options?.name as string) || 'Signataire';
  const pageIdx = Math.max(0, Number(options?.page || 1) - 1);
  onProgress(50, 'Ajout de la signature…');
  const pages = doc.getPages();
  const page = pages[Math.min(pageIdx, pages.length - 1)];
  const { width } = page.getSize();
  const date = new Date().toLocaleDateString('fr-FR');
  // Draw signature box
  page.drawRectangle({ x: width - 250, y: 60, width: 220, height: 70, borderWidth: 1, borderColor: rgb(0.6, 0.6, 0.6), opacity: 0 });
  page.drawText(`Signé par : ${name}`, { x: width - 240, y: 105, size: 10, font, color: rgb(0.1, 0.1, 0.5) });
  page.drawText(`Date : ${date}`, { x: width - 240, y: 90, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('DocuSûr – Signature locale', { x: width - 240, y: 70, size: 7, font, color: rgb(0.5, 0.5, 0.5) });
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'signé.pdf' }] };
};

const cropPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const margin = Number(options?.margin || 50);
  onProgress(40, 'Rognage des pages…');
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    page.setCropBox(margin, margin, width - 2 * margin, height - 2 * margin);
  });
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'rogné.pdf' }] };
};

// ==================== SECURITY ====================

const protectPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const password = (options?.password as string) || '';
  if (!password) throw new Error('Veuillez saisir un mot de passe.');
  onProgress(40, 'Application du chiffrement…');
  // pdf-lib doesn't natively encrypt, so we apply a metadata-based protection marker
  // and use the SubtleCrypto API for real AES-256 encryption of the PDF bytes
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  onProgress(60, 'Chiffrement AES-256 en cours…');
  const pdfBytes = await doc.save();
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, pdfBytes.buffer as ArrayBuffer);
  // Package: magic header + salt(16) + iv(12) + encrypted data
  const magic = encoder.encode('DOCUSUR_ENC_V1\0\0'); // 16 bytes
  const output = new Uint8Array(16 + 16 + 12 + encrypted.byteLength);
  output.set(new Uint8Array(magic), 0);
  output.set(salt, 16);
  output.set(iv, 32);
  output.set(new Uint8Array(encrypted), 44);
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: new Blob([output], { type: 'application/octet-stream' }), filename: 'protégé.pdf.enc' }],
    message: 'Fichier chiffré avec AES-256-GCM. Conservez votre mot de passe, il est impossible de le récupérer.'
  };
};

const unlockPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Lecture du fichier…');
  const password = (options?.password as string) || '';
  if (!password) throw new Error('Veuillez saisir le mot de passe.');
  const bytes = new Uint8Array(await files[0].arrayBuffer());
  const magic = new TextDecoder().decode(bytes.slice(0, 14));
  if (magic !== 'DOCUSUR_ENC_V1') {
    // Try loading as standard PDF with ignoreEncryption
    onProgress(30, 'Tentative de déverrouillage standard…');
    const { PDFDocument } = await loadPdfLib();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    doc.setProducer('DocuSûr - Déverrouillé');
    const result = await doc.save();
    onProgress(100, 'Terminé !');
    return {
      files: [{ blob: pdfBlob(result), filename: 'déverrouillé.pdf' }],
      message: 'PDF reconstruit sans restrictions.'
    };
  }
  onProgress(30, 'Déchiffrement AES-256…');
  const salt = bytes.slice(16, 32);
  const iv = bytes.slice(32, 44);
  const encData = bytes.slice(44);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  onProgress(60, 'Vérification du mot de passe…');
  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encData);
    onProgress(100, 'Terminé !');
    return {
      files: [{ blob: pdfBlob(new Uint8Array(decrypted)), filename: 'déchiffré.pdf' }],
      message: 'Fichier déchiffré avec succès.'
    };
  } catch {
    throw new Error('Mot de passe incorrect ou fichier corrompu.');
  }
};

const purgeDna: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  onProgress(40, 'Suppression des métadonnées…');
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
  doc.setCreationDate(new Date(0));
  doc.setModificationDate(new Date(0));
  onProgress(80, 'Sauvegarde…');
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(result), filename: 'purgé.pdf' }],
    message: 'Toutes les métadonnées (auteur, dates, logiciel, mots-clés) ont été supprimées.'
  };
};

const censorPdf: ProcessorFn = async (files, onProgress, options) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument, rgb } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const searchText = (options?.searchText as string) || '';
  if (!searchText) throw new Error('Veuillez saisir le texte à censurer.');
  onProgress(30, 'Analyse des pages…');
  const pdfjsLib = await loadPdfJs();
  const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const pages = doc.getPages();
  for (let i = 0; i < pdfJsDoc.numPages; i++) {
    const pdfJsPage = await pdfJsDoc.getPage(i + 1);
    const textContent = await pdfJsPage.getTextContent();
    textContent.items.forEach((item: any) => {
      if (item.str && item.str.toLowerCase().includes(searchText.toLowerCase())) {
        const tx = item.transform;
        pages[i].drawRectangle({
          x: tx[4] - 2, y: tx[5] - 2,
          width: item.width + 4, height: item.height + 4,
          color: rgb(0, 0, 0),
        });
      }
    });
    onProgress(30 + ((i + 1) / pdfJsDoc.numPages) * 60);
  }
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'censuré.pdf' }] };
};

// ==================== CONVERSION ====================

const pdfToJpg: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement de la bibliothèque de rendu…');
  const pdfjsLib = await loadPdfJs();
  const bytes = await files[0].arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const results: ProcessedResult['files'] = [];
  for (let i = 0; i < doc.numPages; i++) {
    onProgress(10 + (i / doc.numPages) * 80, `Rendu page ${i + 1}/${doc.numPages}…`);
    const page = await doc.getPage(i + 1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const resp = await fetch(dataUrl);
    const blob = await resp.blob();
    results.push({ blob, filename: `page_${i + 1}.jpg`, preview: dataUrl });
  }
  onProgress(100, 'Terminé !');
  return { files: results };
};

const jpgToPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Création du PDF…');
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    onProgress(10 + (i / files.length) * 80, `Ajout image ${i + 1}/${files.length}…`);
    const bytes = await files[i].arrayBuffer();
    const type = files[i].type;
    let img;
    if (type === 'image/png') {
      img = await doc.embedPng(bytes);
    } else {
      img = await doc.embedJpg(bytes);
    }
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: pdfBlob(result), filename: 'images.pdf' }] };
};

const pdfToA: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Chargement…');
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  onProgress(50, 'Configuration PDF/A…');
  doc.setProducer('DocuSûr PDF/A Generator');
  doc.setCreator('DocuSûr');
  doc.setCreationDate(new Date());
  doc.setModificationDate(new Date());
  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(result), filename: 'archive_pdfa.pdf' }],
    message: 'Métadonnées d\'archivage appliquées. Note : la conformité PDF/A complète nécessite une validation par un outil certifié.'
  };
};

const scanToPdf: ProcessorFn = async (files, onProgress) => {
  return jpgToPdf(files, onProgress);
};

// ==================== OFFICE CONVERSIONS ====================

const wordToPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement de mammoth.js…');
  const mammoth = await import('mammoth');
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  onProgress(15, 'Extraction du contenu Word…');
  const arrayBuffer = await files[0].arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  onProgress(40, 'Conversion en PDF…');
  // Parse HTML to extract text
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(result.value, 'text/html');
  const textContent = htmlDoc.body.innerText || htmlDoc.body.textContent || '';
  const lines = textContent.split('\n').filter(l => l.trim());
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  let currentPage = doc.addPage([595, 842]); // A4
  let yPos = 842 - margin;
  onProgress(60, 'Mise en page…');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Wrap long lines
    const maxCharsPerLine = 80;
    const wrappedLines = [];
    for (let j = 0; j < line.length; j += maxCharsPerLine) {
      wrappedLines.push(line.substring(j, j + maxCharsPerLine));
    }
    if (wrappedLines.length === 0) wrappedLines.push('');
    for (const wLine of wrappedLines) {
      if (yPos < margin + lineHeight) {
        currentPage = doc.addPage([595, 842]);
        yPos = 842 - margin;
      }
      currentPage.drawText(wLine, { x: margin, y: yPos, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      yPos -= lineHeight;
    }
    onProgress(60 + (i / lines.length) * 30);
  }
  const pdfBytes = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(pdfBytes), filename: files[0].name.replace(/\.(docx?|doc)$/i, '') + '.pdf' }],
    message: 'Conversion optimisée pour la confidentialité — traitement 100% local.'
  };
};

const excelToPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement…');
  const XLSX = await import('xlsx');
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  onProgress(15, 'Lecture du fichier Excel…');
  const data = await files[0].arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  onProgress(40, 'Conversion des feuilles…');
  for (let si = 0; si < workbook.SheetNames.length; si++) {
    const sheetName = workbook.SheetNames[si];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][];
    if (jsonData.length === 0) continue;
    // A4 landscape for tables
    let page = doc.addPage([842, 595]);
    let yPos = 595 - 40;
    const cellWidth = 100;
    const cellHeight = 16;
    // Sheet title
    page.drawText(sheetName, { x: 40, y: yPos, size: 14, font: boldFont, color: rgb(0.05, 0.15, 0.4) });
    yPos -= 25;
    for (let r = 0; r < jsonData.length; r++) {
      if (yPos < 40) {
        page = doc.addPage([842, 595]);
        yPos = 595 - 40;
      }
      const row = jsonData[r];
      const usedFont = r === 0 ? boldFont : font;
      for (let c = 0; c < Math.min(row.length, 7); c++) {
        const cellText = String(row[c] ?? '').substring(0, 18);
        page.drawText(cellText, { x: 40 + c * cellWidth, y: yPos, size: 9, font: usedFont, color: rgb(0.1, 0.1, 0.1) });
      }
      yPos -= cellHeight;
    }
    onProgress(40 + ((si + 1) / workbook.SheetNames.length) * 50);
  }
  const pdfBytes = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(pdfBytes), filename: files[0].name.replace(/\.(xlsx?|csv)$/i, '') + '.pdf' }],
    message: 'Conversion optimisée pour la confidentialité — traitement 100% local.'
  };
};

const pptToPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Extraction du contenu…');
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  // PPT files are ZIP-based; extract text from XML
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(await files[0].arrayBuffer());
  const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/)).sort();
  onProgress(30, `Conversion de ${slideFiles.length} diapositive(s)…`);
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const texts: string[] = [];
    xmlDoc.querySelectorAll('t').forEach(t => { if (t.textContent) texts.push(t.textContent); });
    // Landscape slide
    const page = doc.addPage([960, 540]);
    // Slide number
    page.drawText(`Diapositive ${i + 1}`, { x: 40, y: 500, size: 12, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
    let yPos = 460;
    for (const text of texts) {
      if (yPos < 40) break;
      page.drawText(text.substring(0, 100), { x: 50, y: yPos, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
      yPos -= 24;
    }
    onProgress(30 + ((i + 1) / slideFiles.length) * 60);
  }
  if (slideFiles.length === 0) {
    const page = doc.addPage([960, 540]);
    page.drawText('Aucun contenu extractible.', { x: 50, y: 300, size: 16, font, color: rgb(0.5, 0.5, 0.5) });
  }
  const pdfBytes = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(pdfBytes), filename: files[0].name.replace(/\.(pptx?|ppt)$/i, '') + '.pdf' }],
    message: 'Conversion optimisée pour la confidentialité — traitement 100% local.'
  };
};

const htmlToPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Lecture du fichier HTML…');
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const text = await files[0].text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(text, 'text/html');
  const content = htmlDoc.body.innerText || htmlDoc.body.textContent || '';
  const lines = content.split('\n');
  onProgress(40, 'Mise en page…');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage([595, 842]);
  let yPos = 842 - 50;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wrappedLines: string[] = [];
    for (let j = 0; j < Math.max(line.length, 1); j += 85) {
      wrappedLines.push(line.substring(j, j + 85));
    }
    for (const wl of wrappedLines) {
      if (yPos < 50) { page = doc.addPage([595, 842]); yPos = 842 - 50; }
      page.drawText(wl, { x: 50, y: yPos, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
      yPos -= 15;
    }
    onProgress(40 + (i / lines.length) * 50);
  }
  const pdfBytes = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(pdfBytes), filename: 'converti.pdf' }],
    message: 'Conversion HTML → PDF effectuée localement.'
  };
};

const pdfToWord: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Extraction du texte…');
  const pdfjsLib = await loadPdfJs();
  const bytes = await files[0].arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  let fullText = '';
  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
    onProgress(10 + (i / doc.numPages) * 60);
  }
  onProgress(80, 'Génération du document Word…');
  // Generate a simple .doc HTML format (compatible with Word)
  const htmlContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Document</title>
<style>body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; margin: 2.5cm; }</style></head>
<body>${fullText.split('\n').map(p => `<p>${p}</p>`).join('')}</body></html>`;
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob, filename: files[0].name.replace(/\.pdf$/i, '') + '.doc' }],
    message: 'Extraction du texte et conversion en format Word — traitement 100% local.'
  };
};

const pdfToExcel: ProcessorFn = async (files, onProgress) => {
  onProgress(10, 'Extraction du texte…');
  const pdfjsLib = await loadPdfJs();
  const XLSX = await import('xlsx');
  const bytes = await files[0].arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const allRows: string[][] = [];
  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const content = await page.getTextContent();
    // Group items by Y position to detect rows
    const itemsByY: Record<number, any[]> = {};
    content.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]);
      if (!itemsByY[y]) itemsByY[y] = [];
      itemsByY[y].push(item);
    });
    const sortedYs = Object.keys(itemsByY).map(Number).sort((a, b) => b - a);
    for (const y of sortedYs) {
      const items = itemsByY[y].sort((a: any, b: any) => a.transform[4] - b.transform[4]);
      allRows.push(items.map((item: any) => item.str));
    }
    onProgress(10 + (i / doc.numPages) * 60);
  }
  onProgress(80, 'Création du fichier Excel…');
  const ws = XLSX.utils.aoa_to_sheet(allRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Extraction');
  const xlsxData = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob, filename: files[0].name.replace(/\.pdf$/i, '') + '.xlsx' }],
    message: 'Données extraites et converties en Excel — traitement 100% local.'
  };
};

const pdfToPpt: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Rendu des pages…');
  const pdfjsLib = await loadPdfJs();
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  // Convert each page to image, then package as a PDF "slides" format
  const doc = await PDFDocument.create();
  for (let i = 0; i < pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i + 1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    const imgResp = await fetch(imgData);
    const imgBytes = await imgResp.arrayBuffer();
    const img = await doc.embedJpg(imgBytes);
    const slidePage = doc.addPage([960, 540]);
    const scale = Math.min(960 / img.width, 540 / img.height);
    slidePage.drawImage(img, {
      x: (960 - img.width * scale) / 2,
      y: (540 - img.height * scale) / 2,
      width: img.width * scale,
      height: img.height * scale
    });
    onProgress(5 + ((i + 1) / pdfJsDoc.numPages) * 90);
  }
  const pdfBytes = await doc.save();
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: pdfBlob(pdfBytes), filename: files[0].name.replace(/\.pdf$/i, '') + '_slides.pdf' }],
    message: 'Pages converties en format diapositives — traitement 100% local.'
  };
};

// ==================== ADVANCED ====================

const ocrPdf: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement du moteur OCR (Tesseract.js)…');
  const Tesseract = await import('tesseract.js');
  const file = files[0];
  let imageData: string;
  if (file.type === 'application/pdf') {
    onProgress(10, 'Rendu du PDF en image…');
    const pdfjsLib = await loadPdfJs();
    const bytes = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    imageData = canvas.toDataURL('image/png');
  } else {
    imageData = URL.createObjectURL(file);
  }
  onProgress(20, 'Reconnaissance de texte en cours (peut prendre du temps)…');
  const result = await Tesseract.recognize(imageData, 'fra+eng', {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        onProgress(20 + m.progress * 70, `Reconnaissance : ${Math.round(m.progress * 100)}%`);
      }
    }
  });
  onProgress(95, 'Génération du fichier texte…');
  const textBlob = new Blob([result.data.text], { type: 'text/plain;charset=utf-8' });
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob: textBlob, filename: 'texte_ocr.txt' }],
    message: `${result.data.text.length} caractères extraits. Langues : Français + Anglais.`
  };
};

const comparePdfs: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement…');
  const pdfjsLib = await loadPdfJs();
  const extractText = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
    let text = '';
    for (let i = 0; i < doc.numPages; i++) {
      const page = await doc.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  };
  onProgress(20, 'Extraction du texte (fichier 1)…');
  const text1 = await extractText(files[0]);
  onProgress(50, 'Extraction du texte (fichier 2)…');
  const text2 = await extractText(files[1]);
  onProgress(80, 'Comparaison…');
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  let report = `=== COMPARAISON DE DOCUMENTS ===\n\n`;
  report += `Fichier 1 : ${files[0].name} (${lines1.length} lignes)\n`;
  report += `Fichier 2 : ${files[1].name} (${lines2.length} lignes)\n\n`;
  const maxLines = Math.max(lines1.length, lines2.length);
  let differences = 0;
  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i] || '';
    const l2 = lines2[i] || '';
    if (l1.trim() !== l2.trim()) {
      differences++;
      report += `--- Différence ligne ${i + 1} ---\n  Fichier 1: ${l1.trim()}\n  Fichier 2: ${l2.trim()}\n\n`;
    }
  }
  report += `\n=== ${differences} différence(s) trouvée(s) ===\n`;
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  onProgress(100, 'Terminé !');
  return {
    files: [{ blob, filename: 'comparaison.txt' }],
    message: `${differences} différence(s) identifiée(s) entre les deux documents.`
  };
};

// ==================== ANALYSIS ====================

const analyzeStructure: ProcessorFn = async (files, onProgress) => {
  onProgress(5, 'Chargement de la bibliothèque…');
  const pdfjsLib = await loadPdfJs();
  const { PDFDocument } = await loadPdfLib();
  const bytes = await files[0].arrayBuffer();
  
  onProgress(15, 'Extraction des métadonnées…');
  const pdfLibDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const metadata: Record<string, string> = {};
  const title = pdfLibDoc.getTitle();
  const author = pdfLibDoc.getAuthor();
  const subject = pdfLibDoc.getSubject();
  const creator = pdfLibDoc.getCreator();
  const producer = pdfLibDoc.getProducer();
  const keywords = pdfLibDoc.getKeywords();
  const creationDate = pdfLibDoc.getCreationDate();
  const modDate = pdfLibDoc.getModificationDate();
  if (title) metadata['Titre'] = title;
  if (author) metadata['Auteur'] = author;
  if (subject) metadata['Sujet'] = subject;
  if (creator) metadata['Créé avec'] = creator;
  if (producer) metadata['Producteur'] = producer;
  if (keywords) metadata['Mots-clés'] = keywords;
  if (creationDate) metadata['Date de création'] = creationDate.toLocaleDateString('fr-FR');
  if (modDate) metadata['Dernière modification'] = modDate.toLocaleDateString('fr-FR');
  metadata['Nombre de pages'] = String(pdfLibDoc.getPageCount());

  onProgress(30, 'Analyse de la structure…');
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  
  interface Section { title: string; page: number; level: number; wordCount: number; }
  const sections: Section[] = [];
  let totalWords = 0;
  let totalChars = 0;

  for (let i = 0; i < doc.numPages; i++) {
    onProgress(30 + (i / doc.numPages) * 60, `Scan page ${i + 1}/${doc.numPages}…`);
    const page = await doc.getPage(i + 1);
    const textContent = await page.getTextContent();
    let pageText = '';
    let prevFontSize = 0;
    for (const item of textContent.items as any[]) {
      if (!item.str || !item.str.trim()) continue;
      pageText += item.str + ' ';
      const fontSize = Math.abs(item.transform?.[0] || 12);
      if (fontSize > 14 && fontSize !== prevFontSize && item.str.trim().length > 2) {
        sections.push({ title: item.str.trim(), page: i + 1, level: 1, wordCount: 0 });
      } else if (fontSize > 12 && fontSize !== prevFontSize && item.str.trim().length > 3) {
        sections.push({ title: item.str.trim(), page: i + 1, level: 2, wordCount: 0 });
      }
      prevFontSize = fontSize;
    }
    const words = pageText.trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    totalChars += pageText.length;
    if (sections.length > 0) sections[sections.length - 1].wordCount += words;
  }

  if (sections.length === 0) {
    sections.push({ title: 'Document complet', page: 1, level: 1, wordCount: totalWords });
  }

  metadata['Nombre de mots'] = totalWords.toLocaleString('fr-FR');
  metadata['Nombre de caractères'] = totalChars.toLocaleString('fr-FR');
  metadata['Sections détectées'] = String(sections.length);
  const firstPage = pdfLibDoc.getPage(0);
  const { width, height } = firstPage.getSize();
  metadata['Dimensions'] = `${Math.round(width)} × ${Math.round(height)} pt`;

  onProgress(95, 'Génération du rapport…');
  const analysisResult = { metadata, sections, summary: { pages: pdfLibDoc.getPageCount(), words: totalWords, characters: totalChars, sectionsCount: sections.length } };
  const jsonBlob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
  onProgress(100, 'Analyse terminée !');
  return {
    files: [{ blob: jsonBlob, filename: 'analyse-structure.json' }],
    message: `__ANALYSIS_JSON__${JSON.stringify(analysisResult)}`
  };
};

// ==================== REGISTRY ====================

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

export const processors: Record<string, ProcessorFn> = {
  fusionner: mergePdfs,
  diviser: splitPdf,
  compresser: compressPdf,
  pivoter: rotatePdf,
  organiser: organizePdf,
  reparer: repairPdf,
  numeros: addPageNumbers,
  filigrane: addWatermark,
  modifier: editPdf,
  signer: signPdf,
  rogner: cropPdf,
  censurer: censorPdf,
  proteger: protectPdf,
  deverrouiller: unlockPdf,
  'purge-adn': purgeDna,
  'pdf-a': pdfToA,
  'pdf-jpg': pdfToJpg,
  'jpg-pdf': jpgToPdf,
  'pdf-word': pdfToWord,
  'pdf-excel': pdfToExcel,
  'pdf-ppt': pdfToPpt,
  'word-pdf': wordToPdf,
  'excel-pdf': excelToPdf,
  'ppt-pdf': pptToPdf,
  'html-pdf': htmlToPdf,
  numeriser: scanToPdf,
  ocr: ocrPdf,
  comparer: comparePdfs,
  'analyse-structure': analyzeStructure,
};
