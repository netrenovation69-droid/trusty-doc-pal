import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize } from '@/lib/pdf/download';
import type { ToolConfig } from '@/lib/pdf/types';

interface FileUploadZoneProps {
  config: ToolConfig;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploadZone = ({ config, files, onFilesChange }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const max = config.maxFiles || 50;
    const merged = config.multiple ? [...files, ...arr].slice(0, max) : arr.slice(0, 1);
    onFilesChange(merged);
  }, [files, config, onFilesChange]);

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const isImage = (f: File) => f.type.startsWith('image/');

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer bg-card p-10 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center gap-5 ${
          isDragging ? 'border-trust-blue bg-trust-blue/5 scale-[1.01]' : 'border-border hover:border-trust-blue/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          multiple={config.multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <motion.div
          animate={{ y: isDragging ? -12 : [0, -6, 0] }}
          transition={isDragging ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <div>
          <p className="text-xl font-bold text-primary mb-1">
            {isDragging ? 'Lâchez vos fichiers ici' : 'Déposez vos fichiers ici'}
          </p>
          <p className="text-muted-foreground text-sm">
            ou cliquez pour parcourir • {config.accept.replace(/\./g, '').toUpperCase()}
            {config.multiple && config.minFiles && ` • Min. ${config.minFiles} fichiers`}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {isImage(file) ? <Image className="w-5 h-5 text-trust-blue" /> : <FileText className="w-5 h-5 text-trust-blue" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
