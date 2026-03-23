import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, User, Calendar, Hash, Layers, Type, Download,
  ChevronRight, Code, ShieldAlert, ShieldCheck, AlertTriangle,
  Fingerprint, Eye, FileWarning, Gauge
} from 'lucide-react';
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

interface ComplianceCheck {
  label: string;
  status: 'ok' | 'warning' | 'danger';
  message: string;
  icon: typeof ShieldCheck;
  action?: { label: string; route: string };
}

function computeCompliance(data: AnalysisData): { score: number; checks: ComplianceCheck[] } {
  const checks: ComplianceCheck[] = [];
  let score = 100;

  // Check author metadata
  const author = data.metadata['Auteur'];
  if (author && author.trim()) {
    checks.push({
      label: 'Auteur exposé',
      status: 'danger',
      message: `Le champ auteur contient "${author}". Risque de fuite d'identité.`,
      icon: User,
      action: { label: 'Purger les métadonnées', route: '/outil/purge-adn' },
    });
    score -= 25;
  } else {
    checks.push({ label: 'Auteur', status: 'ok', message: 'Aucun auteur identifiable.', icon: User });
  }

  // Check creator software
  const creator = data.metadata['Créé avec'];
  if (creator && creator.trim()) {
    checks.push({
      label: 'Logiciel source visible',
      status: 'warning',
      message: `Créé avec "${creator}". Peut révéler votre environnement de travail.`,
      icon: FileWarning,
      action: { label: 'Purger les métadonnées', route: '/outil/purge-adn' },
    });
    score -= 15;
  } else {
    checks.push({ label: 'Logiciel source', status: 'ok', message: 'Non détecté.', icon: FileWarning });
  }

  // Check producer
  const producer = data.metadata['Producteur'];
  if (producer && producer.trim() && producer !== 'DocuSûr') {
    checks.push({
      label: 'Producteur exposé',
      status: 'warning',
      message: `Producteur : "${producer}".`,
      icon: Fingerprint,
      action: { label: 'Purger les métadonnées', route: '/outil/purge-adn' },
    });
    score -= 10;
  } else {
    checks.push({ label: 'Producteur', status: 'ok', message: 'Propre ou absent.', icon: Fingerprint });
  }

  // Check file size (weight optimization)
  const pages = data.summary.pages;
  const words = data.summary.words;
  const wordsPerPage = pages > 0 ? words / pages : 0;
  if (wordsPerPage < 50 && pages > 3) {
    checks.push({
      label: 'Poids suspect',
      status: 'warning',
      message: 'Peu de texte par page. Le PDF pourrait contenir des images lourdes non optimisées.',
      icon: Gauge,
      action: { label: 'Compresser le PDF', route: '/outil/compresser' },
    });
    score -= 10;
  } else {
    checks.push({ label: 'Optimisation poids', status: 'ok', message: 'Ratio texte/pages correct.', icon: Gauge });
  }

  // Check accessibility (basic heuristic: if sections detected, somewhat accessible)
  if (data.summary.sectionsCount <= 1 && pages > 5) {
    checks.push({
      label: 'Accessibilité',
      status: 'warning',
      message: 'Aucune structure de titres détectée. Le document peut être difficile à naviguer pour les lecteurs d\'écran.',
      icon: Eye,
    });
    score -= 15;
  } else {
    checks.push({ label: 'Accessibilité', status: 'ok', message: 'Structure de titres détectée.', icon: Eye });
  }

  // Check dates
  const creationDate = data.metadata['Date de création'];
  if (creationDate && creationDate !== '01/01/1970') {
    checks.push({
      label: 'Date de création exposée',
      status: 'warning',
      message: `Date visible : ${creationDate}.`,
      icon: Calendar,
      action: { label: 'Purger les métadonnées', route: '/outil/purge-adn' },
    });
    score -= 5;
  } else {
    checks.push({ label: 'Dates', status: 'ok', message: 'Non exposées.', icon: Calendar });
  }

  return { score: Math.max(0, score), checks };
}

const statusColors = {
  ok: 'text-emerald',
  warning: 'text-amber-500',
  danger: 'text-bright-red',
};

const statusBg = {
  ok: 'bg-emerald/10',
  warning: 'bg-amber-500/10',
  danger: 'bg-bright-red/10',
};

export const AnalysisResultView = ({ result, onReset }: Props) => {
  const [view, setView] = useState<'tree' | 'json' | 'security'>('tree');
  const navigate = useNavigate();

  const raw = result.message?.replace('__ANALYSIS_JSON__', '') || '{}';
  let data: AnalysisData;
  try { data = JSON.parse(raw); } catch { return null; }

  const { score, checks } = computeCompliance(data);

  const statCards = [
    { label: 'Pages', value: data.summary.pages, color: 'text-trust-blue' },
    { label: 'Mots', value: data.summary.words.toLocaleString('fr-FR'), color: 'text-emerald' },
    { label: 'Caractères', value: data.summary.characters.toLocaleString('fr-FR'), color: 'text-primary' },
    { label: 'Score Santé', value: `${score}%`, color: score >= 80 ? 'text-emerald' : score >= 50 ? 'text-amber-500' : 'text-bright-red' },
  ];

  const scoreColor = score >= 80 ? 'text-emerald' : score >= 50 ? 'text-amber-500' : 'text-bright-red';
  const scoreBg = score >= 80 ? 'from-emerald/20 to-emerald/5' : score >= 50 ? 'from-amber-500/20 to-amber-500/5' : 'from-bright-red/20 to-bright-red/5';

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
          onClick={() => setView('security')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${view === 'security' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <ShieldAlert className="w-3 h-3 inline mr-1" /> Conseils de Sécurité
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

      {/* Security view */}
      {view === 'security' && (
        <div className="space-y-4">
          {/* Score gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${scoreBg} border border-border rounded-xl p-6 text-center space-y-3`}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score de Santé du Document</p>
            <motion.p
              className={`text-5xl font-black ${scoreColor}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {score}%
            </motion.p>
            <p className="text-sm text-muted-foreground">
              {score >= 80 ? 'Excellent — votre document est bien protégé.' :
               score >= 50 ? 'Attention — quelques traces numériques détectées.' :
               'Alerte — ce document contient des données sensibles exposées.'}
            </p>
          </motion.div>

          {/* Checks list */}
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {checks.map((check, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-lg ${statusBg[check.status]} flex items-center justify-center shrink-0 mt-0.5`}>
                  {check.status === 'ok' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-bright-red" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${statusColors[check.status]}`}>{check.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{check.message}</p>
                </div>
                {check.action && (
                  <button
                    onClick={() => navigate(check.action!.route)}
                    className="shrink-0 text-xs font-semibold text-trust-blue hover:underline"
                  >
                    {check.action.label} →
                  </button>
                )}
              </motion.div>
            ))}
          </div>
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