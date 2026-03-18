import {
  FileText, FileArchive, FileSignature, FileType, FileCode,
  Scissors, RotateCw, Lock, Unlock, Scan, ScanText,
  GitCompare, Eraser, Crop, Fingerprint,
  type LucideIcon
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: string;
}

export const tools: Tool[] = [
  { id: "fusionner", name: "Fusionner PDF", description: "Combinez vos PDF rapidement.", icon: FileText, color: "text-trust-blue", category: "Gestion" },
  { id: "diviser", name: "Diviser PDF", description: "Séparez vos pages PDF.", icon: Scissors, color: "text-trust-blue", category: "Gestion" },
  { id: "compresser", name: "Compresser PDF", description: "Réduisez la taille de vos fichiers.", icon: FileArchive, color: "text-bright-red", category: "Gestion" },
  { id: "pdf-word", name: "PDF en Word", description: "Convertissez PDF vers Word.", icon: FileText, color: "text-trust-blue", category: "Conversion" },
  { id: "pdf-ppt", name: "PDF en PowerPoint", description: "Convertissez PDF vers PPT.", icon: FileText, color: "text-trust-blue", category: "Conversion" },
  { id: "pdf-excel", name: "PDF en Excel", description: "Convertissez PDF vers Excel.", icon: FileText, color: "text-emerald", category: "Conversion" },
  { id: "word-pdf", name: "Word en PDF", description: "Convertissez Word vers PDF.", icon: FileText, color: "text-trust-blue", category: "Conversion" },
  { id: "ppt-pdf", name: "PowerPoint en PDF", description: "Convertissez PPT vers PDF.", icon: FileText, color: "text-trust-blue", category: "Conversion" },
  { id: "excel-pdf", name: "Excel en PDF", description: "Convertissez Excel vers PDF.", icon: FileText, color: "text-emerald", category: "Conversion" },
  { id: "modifier", name: "Modifier PDF", description: "Ajoutez texte, images, formes.", icon: FileSignature, color: "text-trust-blue", category: "Édition" },
  { id: "pdf-jpg", name: "PDF en JPG", description: "Extrayez images ou pages.", icon: FileType, color: "text-bright-red", category: "Conversion" },
  { id: "jpg-pdf", name: "JPG en PDF", description: "Convertissez images vers PDF.", icon: FileType, color: "text-bright-red", category: "Conversion" },
  { id: "signer", name: "Signer PDF", description: "Signature électronique sécurisée.", icon: FileSignature, color: "text-bright-red", category: "Édition" },
  { id: "filigrane", name: "Filigrane", description: "Appliquez texte ou image.", icon: FileSignature, color: "text-slate-text", category: "Édition" },
  { id: "pivoter", name: "Faire pivoter PDF", description: "Tournez vos pages PDF.", icon: RotateCw, color: "text-trust-blue", category: "Gestion" },
  { id: "html-pdf", name: "HTML en PDF", description: "Convertissez pages web en PDF.", icon: FileCode, color: "text-trust-blue", category: "Conversion" },
  { id: "deverrouiller", name: "Déverrouiller PDF", description: "Retirez le mot de passe.", icon: Unlock, color: "text-emerald", category: "Sécurité" },
  { id: "proteger", name: "Protéger PDF", description: "Chiffrez vos documents.", icon: Lock, color: "text-bright-red", category: "Sécurité" },
  { id: "organiser", name: "Organiser PDF", description: "Triez vos pages PDF.", icon: FileArchive, color: "text-trust-blue", category: "Gestion" },
  { id: "pdf-a", name: "PDF en PDF/A", description: "Archivage long-terme.", icon: FileText, color: "text-slate-text", category: "Conversion" },
  { id: "reparer", name: "Réparer PDF", description: "Réparez PDF endommagés.", icon: FileArchive, color: "text-bright-red", category: "Gestion" },
  { id: "numeros", name: "Numéros de pages", description: "Insérez numéros de pages.", icon: FileText, color: "text-slate-text", category: "Édition" },
  { id: "numeriser", name: "Numériser au format PDF", description: "Numérisez avec votre mobile.", icon: Scan, color: "text-trust-blue", category: "Gestion" },
  { id: "ocr", name: "OCR PDF", description: "Convertissez PDF numérisés.", icon: ScanText, color: "text-trust-blue", category: "Avancé" },
  { id: "comparer", name: "Comparer PDF", description: "Comparez vos documents.", icon: GitCompare, color: "text-trust-blue", category: "Avancé" },
  { id: "censurer", name: "Censurer PDF", description: "Supprimez infos sensibles.", icon: Eraser, color: "text-bright-red", category: "Sécurité" },
  { id: "rogner", name: "Rogner PDF", description: "Réduisez les marges.", icon: Crop, color: "text-trust-blue", category: "Édition" },
  { id: "purge-adn", name: "Purge d'ADN numérique", description: "Supprimez les métadonnées invisibles.", icon: Fingerprint, color: "text-bright-red", category: "Sécurité" },
];
