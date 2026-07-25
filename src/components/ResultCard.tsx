import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Activity, MapPin, Box } from 'lucide-react';
import { PredictionResult } from '@/types';

interface ResultCardProps {
  result: PredictionResult;
  fileName?: string;
}

export default function ResultCard({ result, fileName }: ResultCardProps) {
  const detected = result.tumorDetected;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden ${detected ? 'ring-1 ring-amber-300/50 dark:ring-amber-500/30' : 'ring-1 ring-accent-300/50 dark:ring-accent-500/30'}`}
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${detected ? 'bg-amber-400/20' : 'bg-accent-400/20'}`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${detected ? 'bg-amber-100 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400' : 'bg-accent-100 dark:bg-accent-600/20 text-accent-600 dark:text-accent-400'}`}>
              {detected ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Prediction Summary</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {detected ? 'Tumor Detected' : 'No Tumor Detected'}
              </p>
            </div>
          </div>
          <span className={`chip ${detected ? 'bg-amber-100 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300' : 'bg-accent-100 dark:bg-accent-600/20 text-accent-700 dark:text-accent-300'}`}>
            {detected ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
            {detected ? 'Positive' : 'Negative'}
          </span>
        </div>

        {fileName && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 font-mono truncate">Source: {fileName}</p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={Activity} label="Confidence" value={`${(result.confidence * 100).toFixed(2)}%`} tone="brand" />
          <Stat icon={Clock} label="Processing Time" value={`${(result.processingTimeMs / 1000).toFixed(2)}s`} tone="accent" />
          <Stat icon={MapPin} label="Location" value={result.location} tone="amber" />
          <Stat icon={Box} label="Est. Volume" value={detected ? `${result.estimatedVolumeMm3.toLocaleString()} mm³` : '—'} tone="violet" />
        </div>

        {detected && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 px-4 py-3">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Predicted tumor type</span>
            <span className="text-sm font-bold text-amber-800 dark:text-amber-200">{result.tumorType}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: 'brand' | 'accent' | 'amber' | 'violet' }) {
  const tones = {
    brand: 'text-brand-600 dark:text-brand-400',
    accent: 'text-accent-600 dark:text-accent-400',
    amber: 'text-amber-600 dark:text-amber-400',
    violet: 'text-violet-600 dark:text-violet-400',
  };
  return (
    <div className="rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon size={13} className={tones[tone]} />
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{value}</p>
    </div>
  );
}
