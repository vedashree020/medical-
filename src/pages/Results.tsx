import { motion } from 'framer-motion';
import {
  BarChart3,
  Dices,
  Crosshair,
  Target,
  Database,
  Cpu,
  Layers,
  Users,
  Boxes,
  Settings2,
  TrendingUp,
  Activity,
  Eye,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { PageId } from '@/types';
import ImageViewer from '@/components/ImageViewer';
import ComparisonSlider from '@/components/ComparisonSlider';
import ResultCard from '@/components/ResultCard';
import MetricCard from '@/components/MetricCard';
import InfoCard from '@/components/InfoCard';
import PageHeader from '@/components/PageHeader';
import { LossChart, MetricsChart } from '@/components/Charts';
import { LoadingState, ErrorState, EmptyState } from '@/components/StateViews';
import { useMetrics, useMetricsHistory } from '@/hooks/useApi';
import { api } from '@/services/api';
import { PredictionResult } from '@/types';

interface ResultsProps {
  onNavigate: (page: PageId) => void;
  prediction: PredictionResult | null;
  fileName?: string;
  theme: 'light' | 'dark';
}

export default function Results({ onNavigate, prediction, fileName, theme }: ResultsProps) {
  const { data: metrics, loading, error, refetch } = useMetrics();
  const { data: history } = useMetricsHistory();
  const dataset = api.getDatasetInfo();
  const model = api.getModelInfo();

  if (!prediction) {
    return (
      <div className="section-pad py-8 max-w-7xl mx-auto">
        <PageHeader eyebrow="Dashboard" title="Results" icon={BarChart3} />
        <EmptyState
          icon={BarChart3}
          title="No analysis yet"
          description="Upload an MRI scan and run the pipeline to see enhancement, segmentation, and performance metrics here."
          action={<button onClick={() => onNavigate('upload')} className="btn-primary">Upload a scan</button>}
        />
      </div>
    );
  }

  return (
    <div className="section-pad py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Step 3 · Output"
        title="Results Dashboard"
        icon={BarChart3}
        description="Side-by-side MRI comparison, AI prediction summary, model performance metrics, and training telemetry."
        action={
          <button onClick={() => onNavigate('downloads')} className="btn-secondary text-sm">
            Export results
          </button>
        }
      />

      {/* Images */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <ImageViewer variant="original" title="Original MRI" subtitle="Raw input slice" seed={11} />
        <ImageViewer variant="enhanced" title="Enhanced MRI" subtitle="CLAHE + denoised" seed={11} scan />
        <div className="md:col-span-2 lg:col-span-1">
          <ImageViewer variant="segmentation" title="Segmentation Overlay" subtitle="U-Net tumor mask" seed={11} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2">
          <ComparisonSlider seed={11} />
        </div>
        <ResultCard result={prediction} fileName={fileName} />
      </div>

      {/* Performance metrics */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performance Metrics</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">from /metrics endpoint</span>
      </div>
      {loading ? (
        <LoadingState label="Fetching metrics…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : metrics ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <MetricCard label="Dice Score" value={metrics.diceScore} icon={Dices} tone="accent" description="Region overlap quality" delay={0} />
          <MetricCard label="IoU" value={metrics.iou} icon={Crosshair} tone="brand" description="Intersection over union" delay={0.05} />
          <MetricCard label="Accuracy" value={metrics.accuracy} suffix="%" icon={Target} tone="amber" description="Pixel-wise correctness" delay={0.1} />
          <MetricCard label="Sensitivity" value={metrics.sensitivity} suffix="%" icon={Eye} tone="brand" description="True positive rate" delay={0.15} />
          <MetricCard label="Specificity" value={metrics.specificity} suffix="%" icon={ShieldCheck} tone="accent" description="True negative rate" delay={0.2} />
          <MetricCard label="Precision" value={metrics.precision} suffix="%" icon={Zap} tone="violet" description="Positive predictive value" delay={0.25} />
        </div>
      ) : null}

      {/* Charts */}
      {history && (
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-500" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Training & Validation Loss</p>
              </div>
              <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">120 epochs</span>
            </div>
            <LossChart data={history} dark={theme === 'dark'} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-accent-500" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Segmentation Metrics over Epochs</p>
              </div>
              <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">U-Net</span>
            </div>
            <MetricsChart data={history} dark={theme === 'dark'} />
          </motion.div>
        </div>
      )}

      {/* Dataset & Model cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <InfoCard
          title="Dataset"
          icon={Database}
          tone="brand"
          delay={0}
          rows={[
            { label: 'Name', value: dataset.name },
            { label: 'Format', value: dataset.format },
            { label: 'Slices', value: dataset.slices.toLocaleString() },
            { label: 'Patients', value: dataset.patients.toString() },
            { label: 'Modalities', value: dataset.modalities.join(', ') },
          ]}
        />
        <InfoCard
          title="AI Model"
          icon={Cpu}
          tone="violet"
          delay={0.08}
          rows={[
            { label: 'Architecture', value: model.architecture },
            { label: 'Framework', value: model.framework },
            { label: 'Library', value: model.library },
            { label: 'Optimizer', value: model.optimizer },
            { label: 'Loss', value: model.lossFunction },
            { label: 'Parameters', value: model.parameters },
            { label: 'Epochs', value: model.trainingEpochs.toString() },
          ]}
        />
        <InfoCard
          title="Compute"
          icon={Layers}
          tone="accent"
          delay={0.16}
          rows={[
            { label: 'GPU', value: 'NVIDIA A100' },
            { label: 'Precision', value: 'FP16 mixed' },
            { label: 'Batch size', value: '16' },
            { label: 'Inference', value: '~1.8s / vol' },
            { label: 'Backend', value: 'FastAPI + Uvicorn' },
          ]}
        />
      </div>

      <div className="mt-8 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
        <Users size={13} /> <Boxes size={13} /> <Settings2 size={13} />
        <span>All metrics are mock values representative of a BraTS 2020 U-Net baseline.</span>
      </div>
    </div>
  );
}

