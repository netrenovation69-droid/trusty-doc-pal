import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, ShieldCheck, FileText } from 'lucide-react';
import { getRecentHistory, clearHistory, type HistoryEntry } from '@/lib/session-history';
import { tools } from '@/constants/tools';
import { formatFileSize } from '@/lib/pdf/download';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SessionHistory = ({ open, onClose }: Props) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setLoading(true);
      getRecentHistory().then(e => { setEntries(e); setLoading(false); });
    }
  }, [open]);

  const handleClear = async () => {
    await clearHistory();
    setEntries([]);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'À l\'instant';
    if (diff < 3_600_000) return `Il y a ${Math.floor(diff / 60_000)} min`;
    return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-trust-blue" />
                <h2 className="text-lg font-bold text-foreground">Historique Récent</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Privacy badge */}
            <div className="mx-5 mt-4 px-3 py-2 rounded-lg bg-emerald/5 border border-emerald/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />
              <p className="text-xs text-muted-foreground">
                Stocké localement dans votre navigateur. Aucune donnée transmise.
              </p>
            </div>

            {/* Entries */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-trust-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">Aucun fichier traité récemment.</p>
                  <p className="text-xs text-muted-foreground/70">L'historique conserve les fichiers de la dernière heure.</p>
                </div>
              ) : (
                entries.map((entry, i) => {
                  const tool = tools.find(t => t.id === entry.toolId);
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { navigate(`/outil/${entry.toolId}`); onClose(); }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 cursor-pointer transition group"
                    >
                      <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 ${tool?.color || 'text-primary'}`}>
                        {tool ? <tool.icon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{entry.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.toolName} · {formatFileSize(entry.fileSize)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{formatTime(entry.timestamp)}</span>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Clear button */}
            {entries.length > 0 && (
              <div className="p-5 border-t border-border">
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" /> Tout effacer
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};