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
    accept: '.pdf', multiple: false, available: true,
    options: [
      { type: 'password', key: 'password', label: 'Mot de passe', placeholder: 'Mot de passe de protection', required: true }
    ]
  },
  deverrouiller: {
    accept: '.pdf,.enc', multiple: false, available: true,
    options: [
      { type: 'password', key: 'password', label: 'Mot de passe', placeholder: 'Mot de passe du fichier', required: true }
    ]
  },
  'purge-adn': { accept: '.pdf', multiple: false, available: true },
  'pdf-a': { accept: '.pdf', multiple: false, available: true },
  'pdf-jpg': { accept: '.pdf', multiple: false, available: true },
  'jpg-pdf': { accept: '.jpg,.jpeg,.png,.webp,.bmp', multiple: true, minFiles: 1, maxFiles: 50, available: true },
  'pdf-word': { accept: '.pdf', multiple: false, available: true },
  'pdf-ppt': { accept: '.pdf', multiple: false, available: true },
  'pdf-excel': { accept: '.pdf', multiple: false, available: true },
  'word-pdf': { accept: '.docx,.doc', multiple: false, available: true },
  'ppt-pdf': { accept: '.pptx,.ppt', multiple: false, available: true },
  'excel-pdf': { accept: '.xlsx,.xls,.csv', multiple: false, available: true },
  'html-pdf': { accept: '.html,.htm', multiple: false, available: true },
  ocr: { accept: '.pdf,.jpg,.jpeg,.png', multiple: false, available: true },
  comparer: { accept: '.pdf', multiple: true, minFiles: 2, maxFiles: 2, available: true },
  numeriser: { accept: '.jpg,.jpeg,.png,.webp', multiple: true, minFiles: 1, maxFiles: 20, available: true },
};
