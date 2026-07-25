import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { PageId, PipelineStage } from '@/types';
import ProgressTimeline from '@/components/ProgressTimeline';
import PageHeader from '@/components/PageHeader';
import MockMRI from '@/components/MockMRI';

interface ProcessingProps {
  onNavigate: (page: PageId) => void;
  onComplete: () => void;
}

const initialStages: PipelineStage[] = [
  { id: 's1', label: 'Dataset Loaded', description: 'BraTS 2020 HDF5 volume mounted', status: 'pending', progress: 0 },
  { id: 's2', label: 'Image Preprocessing', description: 'Resampling & skull-stripping', status: 'pending', progress: 0 },
  { id: 's3', label: 'Image Enhancement', description: 'CLAHE contrast + noise removal', status: 'pending', progress: 0 },
  { id: 's4', label: 'U-Net Segmentation', description: 'Deep-learning tumor masking', status: 'pending', progress: 0 },
  { id: 's5', label: 'Generating Results', description: 'Metrics & report compilation', status: 'pending', progress: 0 },
];

export default function Processing({ onNavigate, onComplete }: ProcessingProps) {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let active = true;
    const timers: number[] = [];

    const runStage = (index: number, duration: number) => {
      // mark active
      timers.push(window.setTimeout(() => {
        if (!active) return;
        setStages((prev) => prev.map((s, i) => (i === index ? { ...s, status: 'active', progress: 0 } : s)));
        // progress increments
        const steps = 20;
        for (let k = 1; k <= steps; k++) {
          timers.push(window.setTimeout(() => {
            if (!active) return;
            setStages((prev) => prev.map((s, i) => (i === index ? { ...s, progress: (k / steps) * 100 } : s)));
          }, (duration / steps) * k));
        }
        // mark done
        timers.push(window.setTimeout(() => {
          if (!active) return;
          setStages((prev) => prev.map((s, i) => (i === index ? { ...s, status: 'done', progress: 100 } : s)));
        }, duration));
      }, index * duration));
    };

    const stageDuration = 1400;
    initialStages.forEach((_, i) => runStage(i, stageDuration));

    const totalDuration = initialStages.length * stageDuration + 400;
    timers.push(window.setTimeout(() => {
      if (!active) return;
      setComplete(true);
      onComplete();
    }, totalDuration));

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overall = Math.round((stages.filter((s) => s.status === 'done').length / stages.length) * 100);

  return (
    <div className="section-pad py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Step 2 · Inference"
        title="Processing Pipeline"
        icon={Cpu}
        description="Your MRI scan is moving through the enhancement & segmentation pipeline. Each stage runs sequentially on the U-Net model."
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Overall progress</p>
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400 tabular-nums">{overall}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500"
              animate={{ width: `${overall}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="mt-6">
            <ProgressTimeline stages={stages} />
          </div>

          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between rounded-xl bg-accent-50 dark:bg-accent-600/15 border border-accent-200 dark:border-accent-500/30 px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-accent-700 dark:text-accent-300">
                  <CheckCircle2 size={16} /> Pipeline complete
                </span>
                <button onClick={() => onNavigate('results')} className="btn-primary text-sm py-2">
                  View Results <ArrowRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/50 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Live Preview</p>
              <span className="chip bg-brand-100 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300">
                <Loader2 size={11} className="animate-spin" /> {complete ? 'Finalizing' : 'Enhancing'}
              </span>
            </div>
            <div className="relative aspect-square bg-slate-950">
              <MockMRI variant="enhanced" seed={11} scan={!complete} className="h-full w-full" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stages.slice(0, 3).map((s) => (
              <div key={s.id} className="glass-card rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 truncate">{s.label.split(' ')[0]}</p>
                <p className={`mt-1 text-sm font-bold ${s.status === 'done' ? 'text-accent-600 dark:text-accent-400' : s.status === 'active' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-300 dark:text-slate-600'}`}>
                  {Math.round(s.progress)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
