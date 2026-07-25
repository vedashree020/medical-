import { motion } from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  Cpu,
  Scissors,
  BrainCircuit,
  Download,
  ArrowRight,
  Activity,
  ShieldCheck,
  Layers,
  Zap,
  Stethoscope,
} from 'lucide-react';
import { PageId } from '@/types';
import MockMRI from '@/components/MockMRI';
import { useHealth } from '@/hooks/useApi';

interface LandingProps {
  onNavigate: (page: PageId) => void;
}

const features = [
  { icon: Sparkles, title: 'MRI Enhancement', desc: 'CLAHE contrast & noise reduction bring out subtle tissue detail in low-contrast scans.', tone: 'brand' as const },
  { icon: Scissors, title: 'Tumor Segmentation', desc: 'U-Net produces pixel-precise tumor masks with bounding contours in real time.', tone: 'accent' as const },
  { icon: BrainCircuit, title: 'AI Analysis', desc: 'Deep-learning inference classifies tumor type, location & estimated volume.', tone: 'violet' as const },
  { icon: Download, title: 'Download Reports', desc: 'Export enhanced MRI, segmentation masks & full JSON analysis reports.', tone: 'amber' as const },
];

const stats = [
  { value: '57,195', label: 'BraTS Slices', icon: Layers },
  { value: '0.91', label: 'Dice Score', icon: Activity },
  { value: '31.2M', label: 'Model Params', icon: Cpu },
  { value: '120', label: 'Training Epochs', icon: Zap },
];

const toneClasses = {
  brand: 'bg-brand-50 dark:bg-brand-600/15 text-brand-600 dark:text-brand-400 ring-brand-200 dark:ring-brand-500/30',
  accent: 'bg-accent-50 dark:bg-accent-600/15 text-accent-600 dark:text-accent-400 ring-accent-200 dark:ring-accent-500/30',
  violet: 'bg-violet-50 dark:bg-violet-600/15 text-violet-600 dark:text-violet-400 ring-violet-200 dark:ring-violet-500/30',
  amber: 'bg-amber-50 dark:bg-amber-600/15 text-amber-600 dark:text-amber-400 ring-amber-200 dark:ring-amber-500/30',
};

export default function Landing({ onNavigate }: LandingProps) {
  const { data: health } = useHealth();

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-light dark:bg-grid-dark mask-fade-b opacity-60" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="relative section-pad pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 chip bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-500/30 mb-5">
                <Stethoscope size={13} />
                AI Radiology Workstation
                {health?.status === 'healthy' && (
                  <span className="ml-1 flex items-center gap-1 text-accent-600 dark:text-accent-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" /> live
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                AI-Powered Brain Tumor{' '}
                <span className="text-gradient dark:text-gradient-dark">Enhancement & Segmentation</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                MedhaDrishti AI enhances MRI scans and segments brain tumors using a deep-learning
                U-Net pipeline trained on the BraTS 2020 dataset — delivering clinician-grade
                insights in seconds.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('upload')} className="btn-primary">
                  <UploadCloud size={18} /> Upload MRI Scan
                </button>
                <button onClick={() => onNavigate('processing')} className="btn-secondary">
                  <Cpu size={18} /> Start Analysis
                </button>
              </div>

              <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="glass-card rounded-xl p-3"
                    >
                      <Icon size={15} className="text-brand-500 mb-1.5" />
                      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-2xl" />
                <div className="relative glass-card rounded-3xl p-3 h-full">
                  <MockMRI variant="enhanced" seed={11} scan className="h-full w-full rounded-2xl" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-glass-lg"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-accent-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">HIPAA-aware</span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -top-4 -right-4 glass-card rounded-2xl px-4 py-3 shadow-glass-lg"
                >
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-brand-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">91.2% Dice</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 mb-2">Capabilities</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Everything in one radiology suite</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">From raw MRI upload to clinician-ready report — each stage is powered by the same trained U-Net model.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.button
                key={f.title}
                onClick={() => onNavigate(i === 3 ? 'downloads' : 'results')}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 text-left group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${toneClasses[f.tone]} mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={13} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0 bg-grid bg-grid-dark opacity-20" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to analyze a scan?</h2>
            <p className="mt-2 text-white/80 max-w-xl mx-auto">Upload an MRI file and watch the full enhancement & segmentation pipeline run end-to-end.</p>
            <button onClick={() => onNavigate('upload')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-brand-700 px-6 py-3 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
              <UploadCloud size={18} /> Upload MRI Scan <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
