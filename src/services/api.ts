import {
  HealthStatus,
  MetricsHistoryPoint,
  ModelInfo,
  PerformanceMetrics,
  PredictionResult,
  DatasetInfo,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function jitter(base: number, range = 0.02) {
  return Math.min(1, Math.max(0, base + (Math.random() - 0.5) * range));
}

export const api = {
  async getHealth(): Promise<HealthStatus> {
    await delay(400);
    return {
      status: 'healthy',
      version: '2.4.1',
      modelLoaded: true,
      gpuAvailable: true,
      uptimeSeconds: 184320,
    };
  },

  async getMetrics(): Promise<PerformanceMetrics> {
    await delay(600);
    return this.getMetricsSync();
  },

  getMetricsSync(): PerformanceMetrics {
    return {
      diceScore: 0.9123,
      iou: 0.8456,
      accuracy: 0.9634,
      sensitivity: 0.9281,
      specificity: 0.9789,
      precision: 0.9012,
    };
  },

  async predict(file: { name: string; size: number }): Promise<PredictionResult> {
    await delay(1800);
    const detected = Math.random() > 0.18;
    return {
      tumorDetected: detected,
      confidence: detected ? +(0.86 + Math.random() * 0.11).toFixed(4) : +(0.92 + Math.random() * 0.06).toFixed(4),
      processingTimeMs: 1400 + Math.floor(Math.random() * 900),
      tumorType: detected ? ['Glioma', 'Meningioma', 'Pituitary'][Math.floor(Math.random() * 3)] : 'No tumor',
      location: detected ? 'Fronto-temporal lobe (right hemisphere)' : 'N/A',
      estimatedVolumeMm3: detected ? Math.floor(5200 + Math.random() * 9800) : 0,
    };
  },

  async getMetricsHistory(): Promise<MetricsHistoryPoint[]> {
    await delay(300);
    const epochs = 40;
    const data: MetricsHistoryPoint[] = [];
    for (let e = 1; e <= epochs; e++) {
      const t = e / epochs;
      data.push({
        epoch: e,
        dice: +jitter(0.72 + 0.2 * t, 0.03).toFixed(4),
        iou: +jitter(0.6 + 0.25 * t, 0.03).toFixed(4),
        loss: +(0.7 * Math.exp(-2.4 * t) + 0.02).toFixed(4),
        valLoss: +(0.74 * Math.exp(-2.2 * t) + 0.035).toFixed(4),
        accuracy: +jitter(0.82 + 0.15 * t, 0.02).toFixed(4),
      });
    }
    return data;
  },

  getDatasetInfo(): DatasetInfo {
    return {
      name: 'BraTS 2020',
      format: 'HDF5',
      slices: 57195,
      patients: 369,
      modalities: ['T1', 'T1ce', 'T2', 'FLAIR'],
    };
  },

  getModelInfo(): ModelInfo {
    return {
      architecture: 'U-Net',
      framework: 'PyTorch',
      library: 'MONAI',
      optimizer: 'Adam',
      lossFunction: 'BCEWithLogitsLoss',
      parameters: '31.2M',
      trainingEpochs: 120,
    };
  },
};

export const endpoints = {
  health: 'GET /health',
  predict: 'POST /predict',
  metrics: 'GET /metrics',
};
