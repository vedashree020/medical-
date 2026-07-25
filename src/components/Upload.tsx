import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileImage, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '@/types';

interface UploadProps {
  onFileSelected: (file: UploadedFile) => void;
  selectedFile: UploadedFile | null;
  onAnalyze: () => void;
  analyzing?: boolean;
}

const ACCEPTED = ['.h5', '.nii', '.nii.gz', '.png', '.jpg', '.jpeg'];
const ACCEPT_ATTR = '.h5,.nii,.nii.gz,.png,.jpg,.jpeg,image/*';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function isImage(name: string) {
  return /\.(png|jpe?g)$/i.test(name);
}

export default function Upload({ onFileSelected, selectedFile, onAnalyze, analyzing }: UploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    const lower = file.name.toLowerCase();
    const ok = ACCEPTED.some((ext) => lower.endsWith(ext));
    if (!ok) return `Unsupported format. Accepted: ${ACCEPTED.join(', ')}`;
    if (file.size > 200 * 1024 * 1024) return 'File exceeds 200 MB limit.';
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      const previewUrl = isImage(file.name) ? URL.createObjectURL(file) : undefined;
      onFileSelected({ name: file.name, size: file.size, type: file.type || 'application/octet-stream', previewUrl });
    },
    [onFileSelected]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
          dragging
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-600/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-white/40 dark:bg-slate-900/30'
        }`}
      >
        <input ref={inputRef} type="file" accept={ACCEPT_ATTR} className="hidden" onChange={onChange} />
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <motion.div
            animate={dragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
            className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${
              dragging ? 'bg-brand-600 text-white shadow-glow' : 'bg-brand-50 dark:bg-brand-600/15 text-brand-600 dark:text-brand-400'
            }`}
          >
            <UploadCloud size={30} />
          </motion.div>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {dragging ? 'Release to upload' : 'Drag & drop your MRI scan'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            or <span className="text-brand-600 dark:text-brand-400 font-medium">browse files</span> from your computer
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {ACCEPTED.map((ext) => (
              <span key={ext} className="chip bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                {ext}
              </span>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
            {selectedFile.previewUrl ? (
              <img src={selectedFile.previewUrl} alt={selectedFile.name} className="h-full w-full object-cover" />
            ) : (
              <FileImage className="text-brand-400" size={30} />
            )}
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 size={16} className="text-accent-500 shrink-0" />
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{selectedFile.name}</p>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {formatSize(selectedFile.size)} · {selectedFile.type || 'binary'} · ready for analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedFile.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
                onFileSelected({ name: '', size: 0, type: '' });
                setError(null);
              }}
              className="btn-ghost"
            >
              <X size={16} /> Remove
            </button>
            <button onClick={(e) => { e.stopPropagation(); onAnalyze(); }} disabled={analyzing} className="btn-primary">
              {analyzing ? 'Analyzing…' : 'Analyze Scan'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
