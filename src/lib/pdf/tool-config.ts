import type { ToolConfig } from './types';

export const toolConfigs: Record<string, ToolConfig> = {
  fusionner: { accept: '.pdf', multiple: true, minFiles: 2, maxFiles: 20, available: true },
  diviser: { accept: '.pdf', multiple: false, available: true },
  compresser: { accept: '.pdf', multiple: false, available: true },
  pivoter: {
    accept: '.pdf', multiple: false, available: true,
    options: [{ type: 'select', key: 'angle', label: 'Angle de rotation', choices: [
      { value: '90', label: '90° horaire' }, { value: '180', label: '180°' }, { value: '270', label: '270° (90° anti-horaire)' }
    ], defaultValue: '90' }]
  },
  organiser: { accept: '.pdf', multiple: false, available: true,
    options: [{ type: 'text', key: 'order', label: 'Ordre des pages', placeholder: 'Ex: 3,1,2,5,4 (numéros séparés par des virgules)' }]
  },
  reparer: { accept: '.pdf', multiple: false, available: true },
  numeros: {
    accept: '.pdf', multiple: false, available: true,
    options: [{ type: 'select', key: 'position', label: 'Position', choices: [
      { value: 'bottom-center', label: 'Bas centre' }, { value: 'bottom-right', label: 'Bas droite' }, { value: 'bottom-left', label: 'Bas gauche' }
    ], defaultValue: 'bottom-center' }]
  },
  filigrane: {
    accept: '.pdf', multiple: false, available: true,
    options: [
      { type: 'text', key: 'text', label: 'Texte du filigrane', placeholder: 'CONFIDENTIEL', required: true },
      { type: 'number', key: 'opacity', label: 'Opacité (%)', min: 5, max: 80, defaultValue: 30 }
    ]
  },
  modifier: {
    accept: '.pdf', multiple: false, available: true,
    options: [
      { type: 'text', key: 'text', label: 'Texte à ajouter', placeholder: 'Votre texte ici', required: true },
      { type: 'number', key: 'page', label: 'Page (1 = première)', min: 1, max: 9999, defaultValue: 1 },
      { type: 'number', key: 'x', label: 'Position X (pt)', min: 0, max: 1000, defaultValue: 50 },
      { type: 'number', key: 'y', label: 'Position Y (pt)', min: 0, max: 1000, defaultValue: 50 }
    ]
  },
  signer: {
    accept: '.pdf', multiple: false, available: true,
    options: [
      { type: 'text', key: 'name', label: 'Nom du signataire', placeholder: 'Jean Dupont', required: true },
      { type: 'number', key: 'page', label: 'Page', min: 1, max: 9999, defaultValue: 1 }
    ]
  },
  rogner: {
    accept: '.pdf', multiple: false, available: true,
    options: [{ type: 'number', key: 'margin', label: 'Marge à rogner (pt)', min: 0, max: 200, defaultValue: 50 }]
  },
  censurer: {
    accept: '.pdf', multiple: false, available: true,
    options: [
      { type: 'text', key: 'searchText', label: 'Texte à censurer', placeholder: 'Texte sensible à masquer', required: true }
    ]
  },
  proteger: {
    accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'Le chiffrement PDF nécessite des algorithmes cryptographiques avancés. Une version WebAssembly est en cours de développement pour garantir un chiffrement AES-256 100% local.'
  },
  deverrouiller: {
    accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'Le déchiffrement PDF côté client est en cours d\'intégration via WebAssembly pour respecter notre philosophie Zéro Serveur.'
  },
  'purge-adn': { accept: '.pdf', multiple: false, available: true },
  'pdf-a': { accept: '.pdf', multiple: false, available: true },
  'pdf-jpg': { accept: '.pdf', multiple: false, available: true },
  'jpg-pdf': { accept: '.jpg,.jpeg,.png,.webp,.bmp', multiple: true, minFiles: 1, maxFiles: 50, available: true },
  'pdf-word': { accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'La conversion PDF → Word avec mise en page fidèle nécessite un moteur de rendu avancé. Intégration WebAssembly en cours.'
  },
  'pdf-ppt': { accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'Conversion PDF → PowerPoint en cours de développement via WebAssembly.'
  },
  'pdf-excel': { accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'Extraction de tableaux PDF → Excel en cours d\'intégration.'
  },
  'word-pdf': { accept: '.docx,.doc', multiple: false, available: false,
    comingSoonMessage: 'Conversion Word → PDF locale en cours de développement via WebAssembly.'
  },
  'ppt-pdf': { accept: '.pptx,.ppt', multiple: false, available: false,
    comingSoonMessage: 'Conversion PowerPoint → PDF locale en cours de développement.'
  },
  'excel-pdf': { accept: '.xlsx,.xls,.csv', multiple: false, available: false,
    comingSoonMessage: 'Conversion Excel → PDF locale en cours de développement.'
  },
  'html-pdf': { accept: '.html,.htm', multiple: false, available: false,
    comingSoonMessage: 'Conversion HTML → PDF avec rendu fidèle en cours de développement.'
  },
  ocr: { accept: '.pdf,.jpg,.jpeg,.png', multiple: false, available: true },
  comparer: { accept: '.pdf', multiple: true, minFiles: 2, maxFiles: 2, available: true },
  traduire: { accept: '.pdf', multiple: false, available: false,
    comingSoonMessage: 'La traduction locale nécessite des modèles d\'IA embarqués. Intégration WebAssembly avec des modèles de traduction locale en cours.'
  },
  numeriser: { accept: '.jpg,.jpeg,.png,.webp', multiple: true, minFiles: 1, maxFiles: 20, available: true },
  workflow: { accept: '.pdf', multiple: true, available: false,
    comingSoonMessage: 'L\'éditeur de flux de travail visuel est en cours de développement. Il permettra d\'enchaîner automatiquement les outils DocuSûr.'
  },
};
