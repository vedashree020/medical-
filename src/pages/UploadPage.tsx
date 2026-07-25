import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileArchive, Code2, CheckCircle2, Terminal, ArrowRight } from 'lucide-react';
import { PageId, UploadedFile } from '@/types';
import Upload from '@/components/Upload';
import PageHeader from '@/components/PageHeader';
import { endpoints } from '@/services/api';

interface UploadPageProps {
  onNavigate: (page: PageId) => void;
  onFileSelected: (file: UploadedFile) => void;
  selectedFile: UploadedFile | null;
  onStartAnalysis: () => void;
}

const accepted = [
  { ext: '.h5', desc: 'HDF5 dataset archive', icon: FileArchive },
  { ext: '.nii / .nii.gz', desc: 'NIfTI volumetric format', icon: FileArchive },
  { ext: '.png / .jpg', desc: '2D slice images', icon: FileArchive },
];

const apiSnippet = `POST /predict
Content-Type: multipart/form-data

file: <mri-scan.h5>`;

export default function UploadPage({ onNavigate, onFileSelected, selectedFile, onStartAnalysis }: UploadPageProps) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!selectedFile?.name) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onStartAnalysis();
      onNavigate('processing');
    }, 400);
  };

  return (
    <div className="section-pad py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Step 1 · Ingest"
        title="Upload MRI Scan"
        icon={UploadCloud}
        description="Drop a DICOM, NIfTI, HDF5 volume or a 2D slice image. Files are processed locally and never leave your browser until you run inference."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Upload onFileSelected={onFileSelected} selectedFile={selectedFile} onAnalyze={handleAnalyze} analyzing={analyzing} />

          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Accepted formats</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {accepted.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.ext} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50 p-3">
                    <Icon size={16} className="text-brand-500 mb-2" />
                    <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">{a.ext}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedFile?.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between glass-card rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={16} className="text-accent-500" />
                Ready to process. The pipeline will take ~5–8 seconds.
              </div>
              <button onClick={() => onNavigate('processing')} className="btn-primary text-sm">
                Continue <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={16} className="text-brand-500" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">API Endpoint</p>
            </div>
            <pre className="rounded-xl bg-slate-950 text-slate-200 p-4 text-[11px] font-mono leading-relaxed overflow-x-auto">
{apiSnippet}
            </pre>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <Code2 size={13} />
              <span>Placeholder · backend not connected</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Endpoints</p>
            <ul className="space-y-2">
              {[endpoints.health, endpoints.predict, endpoints.metrics].map((e) => (
                <li key={e} className="flex items-center gap-2 text-xs font-mono">
                  <span className="chip bg-brand-100 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300">{e.split(' ')[0]}</span>
                  <span className="text-slate-600 dark:text-slate-300">{e.split(' ')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
