import { motion } from 'framer-motion';
import {
  Database,
  FileArchive,
  SlidersHorizontal,
  Contrast,
  Sparkles,
  BrainCircuit,
  Scissors,
  Gauge,
  FileText,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react';

interface WorkflowStage {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: 'brand' | 'accent' | 'amber' | 'violet';
}

const stages: WorkflowStage[] = [
  { id: 's1', label: 'BraTS Dataset', icon: Database, tone: 'brand' },
  { id: 's2', label: 'Load HDF5 Images', icon: FileArchive, tone: 'brand' },
  { id: 's3', label: 'Normalization', icon: SlidersHorizontal, tone: 'accent' },
  { id: 's4', label: 'CLAHE Contrast Enhancement', icon: Contrast, tone: 'accent' },
  { id: 's5', label: 'Noise Removal', icon: Sparkles, tone: 'accent' },
  { id: 's6', label: 'Deep Learning (U-Net)', icon: BrainCircuit, tone: 'violet' },
  { id: 's7', label: 'Tumor Segmentation', icon: Scissors, tone: 'violet' },
  { id: 's8', label: 'Evaluation Metrics', icon: Gauge, tone: 'amber' },
  { id: 's9', label: 'Prediction Report', icon: FileText, tone: 'amber' },
];

const tones = {
  brand: 'from-brand-500 to-brand-700 shadow-glow',
  accent: 'from-accent-500 to-accent-700 shadow-glow-emerald',
  amber: 'from-amber-500 to-orange-600 shadow-[0_0_24px_rgba(245,158,11,0.35)]',
  violet: 'from-violet-500 to-fuchsia-600 shadow-[0_0_24px_rgba(139,92,246,0.35)]',
};

export default function WorkflowDiagram() {
  return (
    <div className="flex flex-col items-center">
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        const isLast = i === stages.length - 1;
        return (
          <div key={stage.id} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.04 }}
              className="relative group"
            >
              <div className="flex items-center gap-4 glass-card rounded-2xl px-5 py-4 min-w-[280px] sm:min-w-[340px]">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tones[stage.tone]} text-white shrink-0`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500">Step {i + 1}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{stage.label}</p>
                </div>
                <span className="text-2xl font-bold text-slate-200 dark:text-slate-700 tabular-nums">{i + 1}</span>
              </div>
            </motion.div>
            {!isLast && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 'auto' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.1 }}
                className="flex flex-col items-center py-1"
              >
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="text-slate-300 dark:text-slate-600"
                >
                  <ArrowDown size={20} />
                </motion.div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
