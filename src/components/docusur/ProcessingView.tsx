import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { downloadBlob, formatFileSize } from '@/lib/pdf/download';
import type { ProcessedResult } from '@/lib/pdf/types';

interface ProcessingViewProps {
  progress: number;
  status: string;
  result: ProcessedResult | null;
  error: string | null;
  onReset: () => void;
}

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{
      left: `${x}%`,
      top: '40%',
      background: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{
      opacity: [1, 1, 0],
      y: [0, -60 - Math.random() * 40, 80 + Math.random() * 40],
      x: [0, (Math.random() - 0.5) * 100],
      scale: [1, 1.2, 0.3],
      rotate: [0, Math.random() * 360],
    }}
    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
  />
);

export const ProcessingView = ({ progress, status, result, error, onReset }: ProcessingViewProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isProcessing = !result && !error;

  useEffect(() => {
    if (result && !error) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result, error]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-8 rounded-2xl border border-destructive/30 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">Erreur</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <button onClick={onReset} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition text-sm">
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-8 rounded-2xl border border-border text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full bg-trust-blue/10 flex items-center justify-center mx-auto"
        >
          <Loader2 className="w-8 h-8 text-trust-blue" />
        </motion.div>
        <div className="space-y-3 max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" />
          Traitement 100% local — vos fichiers ne quittent jamais votre appareil
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-card p-8 rounded-2xl border border-emerald/30 space-y-6 overflow-hidden"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} x={10 + (i * 4)} />
          ))}
        </div>
      )}

      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center mx-auto relative"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald" />
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald/40"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald" />
          <p className="text-lg font-bold text-foreground">Traitement terminé !</p>
        </motion.div>
        {result?.message && !result.message.startsWith('__') && (
          <p className="text-sm text-muted-foreground">{result.message}</p>
        )}
      </div>

      <div className="space-y-2">
        {result?.files.map((file, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border"
          >
            {file.preview && (
              <img src={file.preview} alt="" className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.blob.size)}</p>
            </div>
            <motion.button
              onClick={() => downloadBlob(file.blob, file.filename)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <Download className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Télécharger</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {result && result.files.length > 1 && (
        <button
          onClick={() => result.files.forEach((f, i) => setTimeout(() => downloadBlob(f.blob, f.filename), i * 300))}
          className="w-full bg-trust-blue text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition text-sm"
        >
          Tout télécharger ({result.files.length} fichiers)
        </button>
      )}

      <button onClick={onReset} className="w-full text-muted-foreground hover:text-foreground py-2 text-sm transition">
        Traiter d'autres fichiers
      </button>
    </motion.div>
  );
};