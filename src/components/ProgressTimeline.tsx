import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Circle, type LucideIcon } from 'lucide-react';
import { PipelineStage } from '@/types';

interface ProgressTimelineProps {
  stages: PipelineStage[];
}

const statusIcon = {
  done: Check,
  active: Loader2,
  pending: Circle,
};

export default function ProgressTimeline({ stages }: ProgressTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
      <motion.div
        className="absolute left-[19px] top-2 w-0.5 bg-gradient-to-b from-brand-500 to-accent-500"
        animate={{
          height: `${(stages.filter((s) => s.status === 'done').length / stages.length) * 100}%`,
        }}
        transition={{ duration: 0.5 }}
        style={{ maxHeight: 'calc(100% - 16px)' }}
      />
      <ul className="space-y-5">
        {stages.map((stage, i) => {
          const Icon = statusIcon[stage.status];
          const done = stage.status === 'done';
          const active = stage.status === 'active';
          return (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex items-start gap-4"
            >
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full shrink-0 ring-4 ring-white dark:ring-slate-900 transition-colors ${
                  done
                    ? 'bg-accent-500 text-white'
                    : active
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                <Icon size={18} className={active ? 'animate-spin' : ''} />
                {active && <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm font-semibold ${done || active ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {stage.label}
                  </p>
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="chip bg-brand-100 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300"
                      >
                        {Math.round(stage.progress)}%
                      </motion.span>
                    )}
                    {done && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="chip bg-accent-100 dark:bg-accent-600/20 text-accent-700 dark:text-accent-300">
                        Done
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{stage.description}</p>
                {active && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
                      animate={{ width: `${stage.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export type { LucideIcon };
