import { motion } from 'framer-motion';
import { Download, FileImage, FileJson, FileText, Check } from 'lucide-react';
import { useState } from 'react';

interface DownloadButtonProps {
  label: string;
  description: string;
  icon: typeof Download;
  tone?: 'brand' | 'accent' | 'amber';
  fileName: string;
  content: string;
  mime?: string;
  delay?: number;
}

const tones = {
  brand: 'from-brand-500 to-brand-700 shadow-glow',
  accent: 'from-accent-500 to-accent-700 shadow-glow-emerald',
  amber: 'from-amber-500 to-orange-600 shadow-[0_0_24px_rgba(245,158,11,0.35)]',
};

export function DownloadButton({ label, description, icon: Icon, tone = 'brand', fileName, content, mime = 'application/json', delay = 0 }: DownloadButtonProps) {
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      onClick={handleDownload}
      className="glass-card rounded-2xl p-5 text-left w-full flex items-center gap-4 group hover:ring-2 hover:ring-brand-300 dark:hover:ring-brand-500/40 transition-all"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]} text-white shrink-0`}>
        {done ? <Check size={22} /> : <Icon size={22} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>
        <p className="mt-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">{fileName}</p>
      </div>
      <Download size={16} className="text-slate-300 group-hover:text-brand-500 transition-colors shrink-0" />
    </motion.button>
  );
}

export const downloadIcons = { FileImage, FileJson, FileText };
