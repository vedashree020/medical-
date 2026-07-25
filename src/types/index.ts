export type PageId =
  | 'landing'
  | 'upload'
  | 'processing'
  | 'results'
  | 'pipeline'
  | 'downloads';

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export type PipelineStageStatus = 'pending' | 'active' | 'done';

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: PipelineStageStatus;
  progress: number;
}

export interface PredictionResult {
  tumorDetected: boolean;
  confidence: number;
  processingTimeMs: number;
  tumorType: string;
  location: string;
  estimatedVolumeMm3: number;
}

export interface PerformanceMetrics {
  diceScore: number;
  iou: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  precision: number;
}

export interface DatasetInfo {
  name: string;
  format: string;
  slices: number;
  patients: number;
  modalities: string[];
}

export interface ModelInfo {
  architecture: string;
  framework: string;
  library: string;
  optimizer: string;
  lossFunction: string;
  parameters: string;
  trainingEpochs: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  modelLoaded: boolean;
  gpuAvailable: boolean;
  uptimeSeconds: number;
}

export interface MetricsHistoryPoint {
  epoch: number;
  dice: number;
  iou: number;
  loss: number;
  valLoss: number;
  accuracy: number;
}

export interface AnalysisReport {
  id: string;
  createdAt: string;
  fileName: string;
  prediction: PredictionResult;
  metrics: PerformanceMetrics;
}
