import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Calendar, Hash, Layers, Type, Download, ChevronRight, Code } from 'lucide-react';
import { downloadBlob } from '@/lib/pdf/download';
import type { ProcessedResult } from '@/lib/pdf/types';

interface AnalysisData {
  metadata: Record<string, string>;
  sections: { title: string; page: number; level: number; wordCount: number }[];
  summary: { pages: number; words: number; characters: number; sectionsCount: number };
}

interface Props {
  result: ProcessedResult;
  onReset: () => void;
}

const metaIcons: Record<string, typeof FileText> = {
  'Titre': FileText, 'Auteur': User, 'Date de création': Calendar,
  'Dernière modification': Calendar, 'Nombre de pages': Hash,
  'Nombre de mots': Type, 'Sections détectées': Layers,
};

export const AnalysisResultView = ({ result, onReset }: Props) => {
  const [view, setView] = useState<'tree' | 'json'>('tree');

  const raw = result.message?.replace('__ANALYSIS_JSON__', '') || '{}';
  let data: AnalysisData;
  try { data = JSON.parse(raw); } catch { return null; }

  const statCards = [
    { label: 'Pages', value: data.summary.pages, color: 'text-trust-blue' },
    { label: 'Mots', value: data.summary.words.toLocaleString('fr-FR'), color: 'text-emerald' },
    { label: 'Caractères', value: data.summary.characters.toLocaleString('fr-FR'), color: 'text-primary' },
    { label: 'Sections', value: data.summary.sectionsCount, color: 'text-bright-red' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Metadata */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-trust-blue" /> Métadonnées
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(data.metadata).map(([key, val]) => {
            const Icon = metaIcons[key] || Hash;
            return (
              <div key={key} className="flex items-start gap-2 text-sm">
                <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{key} :</span>
                <span className="text-foreground font-medium truncate">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('tree')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${view === 'tree' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Layers className="w-3 h-3 inline mr-1" /> Arborescence
        </button>
        <button
          onClick={() => setView('json')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${view === 'json' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Code className="w-3 h-3 inline mr-1" /> JSON
        </button>
      </div>

      {/* Tree view */}
      {view === 'tree' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-1">
          {data.sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary/50 transition ${sec.level === 2 ? 'ml-6' : ''}`}
            >
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${sec.level === 1 ? 'text-trust-blue' : 'text-muted-foreground'}`} />
              <span className={`text-sm ${sec.level === 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {sec.title}
              </span>
              <span className="ml-auto text-xs text-muted-foreground shrink-0">
                p.{sec.page} · {sec.wordCount} mots
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* JSON view */}
      {view === 'json' && (
        <pre className="bg-card border border-border rounded-xl p-5 text-xs text-foreground overflow-auto max-h-96 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => result.files[0] && downloadBlob(result.files[0].blob, result.files[0].filename)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition text-sm"
        >
          <Download className="w-4 h-4" /> Télécharger le rapport JSON
        </button>
        <button onClick={onReset} className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition text-sm">
          Nouveau fichier
        </button>
      </div>
    </motion.div>
  );
};