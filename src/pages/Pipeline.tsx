import { motion } from 'framer-motion';
import { Workflow, ArrowRight, Cpu, Database } from 'lucide-react';
import { PageId } from '@/types';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import PageHeader from '@/components/PageHeader';
import { api } from '@/services/api';

interface PipelineProps {
  onNavigate: (page: PageId) => void;
}

const stageDetails = [
  { name: 'BraTS Dataset', detail: 'Multimodal MRI scans from the Brain Tumor Segmentation 2020 challenge.', metric: '369 patients · 4 modalities' },
  { name: 'Load HDF5 Images', detail: 'Volumes deserialized from a single HDF5 store for fast batch loading.', metric: '57,195 slices' },
  { name: 'Normalization', detail: 'Z-score intensity normalization per modality to stabilize training.', metric: 'μ=0, σ=1' },
  { name: 'CLAHE Contrast Enhancement', detail: 'Contrast-Limited Adaptive Histogram Equalization reveals faint lesions.', metric: 'clip=2.0, tile=8×8' },
  { name: 'Noise Removal', detail: 'Median + Gaussian filtering removes acquisition artifacts.', metric: 'σ=0.6' },
  { name: 'Deep Learning (U-Net)', detail: 'Encoder-decoder with skip segments tumor regions at pixel level.', metric: '31.2M params' },
  { name: 'Tumor Segmentation', detail: 'Sigmoid output thresholded into a binary tumor mask.', metric: 'thr=0.5' },
  { name: 'Evaluation Metrics', detail: 'Dice, IoU, accuracy, sensitivity & specificity computed on val set.', metric: 'Dice=0.912' },
  { name: 'Prediction Report', detail: 'Tumor type, location, volume & confidence compiled into a report.', metric: 'JSON + PNG' },
];

export default function Pipeline({ onNavigate }: PipelineProps) {
  const dataset = api.getDatasetInfo();
  const model = api.getModelInfo();

  return (
    <div className="section-pad py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Architecture"
        title="Pipeline Workflow"
        icon={Workflow}
        description="The end-to-end flow from raw BraTS dataset to a clinician-ready prediction report. Each stage feeds the next in a deterministic sequence."
        action={
          <button onClick={() => onNavigate('upload')} className="btn-secondary text-sm">
            Run pipeline <ArrowRight size={15} />
          </button>
        }
      />

      {/* Summary chips */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-600/15 text-brand-600 dark:text-brand-400">
            <Database size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Dataset</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{dataset.name} · {dataset.format}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-600/15 text-violet-600 dark:text-violet-400">
            <Cpu size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Model</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{model.architecture} · {model.framework}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-600/15 text-accent-600 dark:text-accent-400">
            <Workflow size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Stages</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">9 sequential steps</p>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <WorkflowDiagram />
        </div>
        <div className="lg:sticky lg:top-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-2">Stage Reference</p>
          {stageDetails.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-xl p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{s.name}</p>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-8">{s.detail}</p>
              <p className="mt-1 text-[10px] font-mono text-brand-600 dark:text-brand-400 pl-8">{s.metric}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
