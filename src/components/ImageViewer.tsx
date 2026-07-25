import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import MockMRI from './MockMRI';

interface ImageViewerProps {
  variant: 'original' | 'enhanced' | 'segmentation';
  title: string;
  subtitle?: string;
  seed?: number;
  scan?: boolean;
}

export default function ImageViewer({ variant, title, subtitle, seed = 7, scan = false }: ImageViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/50">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        <Maximize2 size={15} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
      </div>
      <div className="relative aspect-square bg-slate-950">
        <MockMRI variant={variant} seed={seed} scan={scan} className="h-full w-full" />
      </div>
    </motion.div>
  );
}
