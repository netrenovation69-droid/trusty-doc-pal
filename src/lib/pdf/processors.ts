import type { ProcessorFn, ProcessedResult, ProgressCallback } from './types';

// Helper to create PDF blob from Uint8Array (fixes TS Uint8Array/BlobPart compat)
const pdfBlob = (bytes: Uint8Array) => new Blob([bytes.buffer], { type: 'application/pdf' });

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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'fusionné.pdf' }] };
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
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
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
    files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'compressé.pdf' }],
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'pivoté.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'organisé.pdf' }] };
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
    files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'réparé.pdf' }],
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'numéroté.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'filigrané.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'modifié.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'signé.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'rogné.pdf' }] };
};

// ==================== SECURITY ====================

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
    files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'purgé.pdf' }],
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

  // Use pdfjs to find text positions
  const pdfjsLib = await loadPdfJs();
  const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const pages = doc.getPages();

  for (let i = 0; i < pdfJsDoc.numPages; i++) {
    const pdfJsPage = await pdfJsDoc.getPage(i + 1);
    const textContent = await pdfJsPage.getTextContent();
    const viewport = pdfJsPage.getViewport({ scale: 1 });
    const page = pages[i];

    textContent.items.forEach((item: any) => {
      if (item.str && item.str.toLowerCase().includes(searchText.toLowerCase())) {
        const tx = item.transform;
        page.drawRectangle({
          x: tx[4] - 2,
          y: tx[5] - 2,
          width: item.width + 4,
          height: item.height + 4,
          color: rgb(0, 0, 0),
        });
      }
    });
    onProgress(30 + ((i + 1) / pdfJsDoc.numPages) * 60);
  }

  const result = await doc.save();
  onProgress(100, 'Terminé !');
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'censuré.pdf' }] };
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
  return { files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'images.pdf' }] };
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
    files: [{ blob: new Blob([result], { type: 'application/pdf' }), filename: 'archive_pdfa.pdf' }],
    message: 'Métadonnées d\'archivage appliquées. Note : la conformité PDF/A complète nécessite une validation par un outil certifié.'
  };
};

const scanToPdf: ProcessorFn = async (files, onProgress) => {
  // Same as jpgToPdf but with "scan" branding
  return jpgToPdf(files, onProgress);
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
      report += `--- Différence ligne ${i + 1} ---\n`;
      report += `  Fichier 1: ${l1.trim()}\n`;
      report += `  Fichier 2: ${l2.trim()}\n\n`;
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
  'purge-adn': purgeDna,
  'pdf-a': pdfToA,
  'pdf-jpg': pdfToJpg,
  'jpg-pdf': jpgToPdf,
  numeriser: scanToPdf,
  ocr: ocrPdf,
  comparer: comparePdfs,
};
