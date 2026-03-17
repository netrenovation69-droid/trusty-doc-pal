import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tools } from '@/constants/tools';
import { toolConfigs } from '@/lib/pdf/tool-config';
import { processors } from '@/lib/pdf/processors';
import { ChevronLeft, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileUploadZone } from '@/components/docusur/FileUploadZone';
import { ToolOptions } from '@/components/docusur/ToolOptions';
import { ProcessingView } from '@/components/docusur/ProcessingView';
import type { ProcessedResult, ToolOption } from '@/lib/pdf/types';

type Stage = 'upload' | 'processing' | 'done' | 'error';

const ToolPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tool = tools.find((t) => t.id === id);
  const config = id ? toolConfigs[id] : undefined;

  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string | number>>({});
  const [stage, setStage] = useState<Stage>('upload');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize default option values
  useEffect(() => {
    if (config?.options) {
      const defaults: Record<string, string | number> = {};
      config.options.forEach((opt) => {
        if (opt.defaultValue !== undefined) defaults[opt.key] = opt.defaultValue;
      });
      setOptions(defaults);
    }
  }, [config]);

  const canProcess = useCallback(() => {
    if (!config || !files.length) return false;
    if (config.minFiles && files.length < config.minFiles) return false;
    if (config.options) {
      const missing = config.options.filter(o => o.required && !options[o.key]);
      if (missing.length > 0) return false;
    }
    return true;
  }, [config, files, options]);

  const handleProcess = async () => {
    if (!id || !processors[id]) return;
    setStage('processing');
    setProgress(0);
    setStatus('Initialisation…');
    setResult(null);
    setError(null);

    try {
      const res = await processors[id](files, (p, s) => {
        setProgress(p);
        if (s) setStatus(s);
      }, options);
      setResult(res);
      setStage('done');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setStage('error');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStage('upload');
    setProgress(0);
    setStatus('');
    setResult(null);
    setError(null);
  };

  if (!tool || !config) {
    return <div className="p-20 text-center text-muted-foreground">Outil non trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-8 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-10"
        >
          <div className={`p-4 rounded-2xl bg-card shadow-lg border border-border ${tool.color}`}>
            <tool.icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </motion.div>

        {/* Coming Soon — Glassmorphism card */}
        {!config.available ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-border p-10 text-center space-y-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Animated glow */}
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, hsl(var(--trust-blue)) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(var(--emerald)) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="relative z-10 space-y-6">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto border border-border/50"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-10 h-10 text-trust-blue" />
              </motion.div>

              <div>
                <div className="inline-flex items-center gap-2 bg-trust-blue/10 text-trust-blue px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-trust-blue"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Architecture Privacy-First en cours
                </div>
                <p className="text-xl font-bold text-primary mb-2">Bientôt disponible</p>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">{config.comingSoonMessage}</p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald" />
                  Zéro serveur
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-trust-blue" />
                  100% WebAssembly
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary" />
                  Traitement RAM
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Upload & Options */}
            {stage === 'upload' && (
              <div className="space-y-6">
                <FileUploadZone config={config} files={files} onFilesChange={setFiles} />

                {config.options && files.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ToolOptions options={config.options} values={options} onChange={setOptions} />
                  </motion.div>
                )}

                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={handleProcess}
                      disabled={!canProcess()}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Lancer le traitement
                    </button>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Traitement 100% local — vos fichiers restent dans la RAM de votre navigateur
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Processing / Done / Error */}
            {(stage === 'processing' || stage === 'done' || stage === 'error') && (
              <ProcessingView
                progress={progress}
                status={status}
                result={result}
                error={error}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ToolPage;
