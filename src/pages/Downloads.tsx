import { Download, FileImage, FileJson, FileText, ArrowRight, FolderOpen } from 'lucide-react';
import { PageId, PredictionResult } from '@/types';
import { DownloadButton, downloadIcons } from '@/components/DownloadButton';
import PageHeader from '@/components/PageHeader';
import ImageViewer from '@/components/ImageViewer';
import { EmptyState } from '@/components/StateViews';
import { api } from '@/services/api';

interface DownloadsProps {
  onNavigate: (page: PageId) => void;
  prediction: PredictionResult | null;
  fileName?: string;
}

function buildReport(prediction: PredictionResult | null, fileName?: string) {
  const metrics = api.getMetricsSync();
  const dataset = api.getDatasetInfo();
  const model = api.getModelInfo();
  const report = {
    application: 'MedhaDrishti AI',
    version: '2.4.1',
    generatedAt: new Date().toISOString(),
    sourceFile: fileName || 'unknown',
    prediction: prediction || null,
    performanceMetrics: metrics,
    dataset,
    model,
    disclaimer: 'For research and educational use only. Not for clinical diagnosis.',
  };
  return JSON.stringify(report, null, 2);
}

function buildTextReport(prediction: PredictionResult | null, fileName?: string) {
  const m = api.getMetricsSync();
  const lines = [
    'MedhaDrishti AI — Analysis Report',
    '==================================',
    `Generated: ${new Date().toLocaleString()}`,
    `Source:   ${fileName || 'N/A'}`,
    '',
    'PREDICTION',
    '----------',
    prediction
      ? `  Tumor Detected : ${prediction.tumorDetected ? 'YES' : 'NO'}`
      : '  Tumor Detected : N/A',
    prediction ? `  Confidence      : ${(prediction.confidence * 100).toFixed(2)}%` : '',
    prediction ? `  Type            : ${prediction.tumorType}` : '',
    prediction ? `  Location        : ${prediction.location}` : '',
    prediction ? `  Est. Volume     : ${prediction.estimatedVolumeMm3.toLocaleString()} mm³` : '',
    prediction ? `  Processing Time : ${(prediction.processingTimeMs / 1000).toFixed(2)}s` : '',
    '',
    'PERFORMANCE METRICS',
    '-------------------',
    `  Dice Score     : ${m.diceScore.toFixed(4)}`,
    `  IoU            : ${m.iou.toFixed(4)}`,
    `  Accuracy       : ${(m.accuracy * 100).toFixed(2)}%`,
    `  Sensitivity    : ${(m.sensitivity * 100).toFixed(2)}%`,
    `  Specificity    : ${(m.specificity * 100).toFixed(2)}%`,
    `  Precision      : ${(m.precision * 100).toFixed(2)}%`,
    '',
    'MODEL',
    '-----',
    `  Architecture : ${api.getModelInfo().architecture}`,
    `  Framework    : ${api.getModelInfo().framework} / ${api.getModelInfo().library}`,
    `  Optimizer    : ${api.getModelInfo().optimizer}`,
    `  Loss         : ${api.getModelInfo().lossFunction}`,
    '',
    'DATASET',
    '-------',
    `  ${api.getDatasetInfo().name} (${api.getDatasetInfo().format})`,
    `  ${api.getDatasetInfo().slices.toLocaleString()} slices · ${api.getDatasetInfo().patients} patients`,
    '',
    'DISCLAIMER: For research & educational use only.',
  ].filter(Boolean);
  return lines.join('\n');
}

function buildSvgMask() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="512" height="512">
  <rect width="200" height="200" fill="#0f172a"/>
  <ellipse cx="100" cy="105" rx="78" ry="86" fill="#1e293b"/>
  <ellipse cx="108" cy="103" rx="24" ry="20" fill="#10b981" fill-opacity="0.6" stroke="#34d399" stroke-width="1.5"/>
  <ellipse cx="108" cy="103" rx="30" ry="25" fill="none" stroke="#6ee7b7" stroke-width="0.8" stroke-dasharray="3 3"/>
  <text x="10" y="190" fill="#64748b" font-size="8" font-family="monospace">MedhaDrishti AI — segmentation mask</text>
</svg>`;
}

export default function Downloads({ onNavigate, prediction, fileName }: DownloadsProps) {
  const reportJson = buildReport(prediction, fileName);
  const reportTxt = buildTextReport(prediction, fileName);
  const maskSvg = buildSvgMask();

  return (
    <div className="section-pad py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Step 4 · Export"
        title="Downloads"
        icon={Download}
        description="Export the enhanced MRI, segmentation mask, or a full analysis report. Reports are generated locally as JSON / text."
        action={
          !prediction ? (
            <button onClick={() => onNavigate('upload')} className="btn-primary text-sm">
              Upload a scan <ArrowRight size={15} />
            </button>
          ) : undefined
        }
      />

      {!prediction ? (
        <EmptyState
          icon={FolderOpen}
          title="Nothing to export yet"
          description="Run an analysis first — then your enhanced MRI, segmentation mask, and full report will be available for download here."
          action={<button onClick={() => onNavigate('upload')} className="btn-primary">Upload a scan</button>}
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Preview</p>
            <div className="grid grid-cols-2 gap-4">
              <ImageViewer variant="enhanced" title="Enhanced MRI" subtitle="Export-ready" seed={11} />
              <ImageViewer variant="segmentation" title="Segmentation Mask" subtitle="Export-ready" seed={11} />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Export files</p>
            <DownloadButton
              label="Download Enhanced MRI"
              description="CLAHE-enhanced scan (PNG preview)"
              icon={downloadIcons.FileImage}
              tone="brand"
              fileName="enhanced_mri.svg"
              mime="image/svg+xml"
              content={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="512" height="512"><rect width="200" height="200" fill="#0f172a"/><ellipse cx="100" cy="105" rx="78" ry="86" fill="#cbd5e1"/><ellipse cx="108" cy="103" rx="24" ry="20" fill="#fda4af" fill-opacity="0.6"/></svg>`}
            />
            <DownloadButton
              label="Download Segmentation Mask"
              description="U-Net binary tumor mask"
              icon={FileImage}
              tone="accent"
              fileName="segmentation_mask.svg"
              mime="image/svg+xml"
              content={maskSvg}
              delay={0.05}
            />
            <DownloadButton
              label="Download Analysis Report (JSON)"
              description="Full structured prediction & metrics"
              icon={downloadIcons.FileJson}
              tone="amber"
              fileName="analysis_report.json"
              content={reportJson}
              delay={0.1}
            />
            <DownloadButton
              label="Download Analysis Report (TXT)"
              description="Human-readable summary"
              icon={downloadIcons.FileText}
              tone="amber"
              fileName="analysis_report.txt"
              mime="text/plain"
              content={reportTxt}
              delay={0.15}
            />
          </div>
        </div>
      )}
    </div>
  );
}
