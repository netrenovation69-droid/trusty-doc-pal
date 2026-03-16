export interface ProcessedFile {
  blob: Blob;
  filename: string;
  preview?: string; // data URL for image previews
}

export interface ProcessedResult {
  files: ProcessedFile[];
  message?: string;
}

export type ProgressCallback = (progress: number, status?: string) => void;

export type ProcessorFn = (
  files: File[],
  onProgress: ProgressCallback,
  options?: Record<string, string | number>
) => Promise<ProcessedResult>;

export interface ToolOption {
  type: 'select' | 'text' | 'password' | 'number';
  key: string;
  label: string;
  placeholder?: string;
  choices?: { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: string | number;
  required?: boolean;
}

export interface ToolConfig {
  accept: string;
  multiple: boolean;
  minFiles?: number;
  maxFiles?: number;
  available: boolean;
  comingSoonMessage?: string;
  options?: ToolOption[];
}
