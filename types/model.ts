export type MetricType = 'accuracy' | 'latency' | 'perplexity' | 'toxicity' | 'safety';

export interface Model {
  id: string;
  name: string;
  version: string;
  description: string;
  createdAt: string;
}

export interface Metric {
  id: string;
  modelId: string;
  type: MetricType;
  value: number;
  timestamp: string;
}

export interface MetricSummary {
  type: MetricType;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ModelWithMetrics extends Model {
  metrics: Metric[];
  summary: Record<MetricType, MetricSummary>;
}