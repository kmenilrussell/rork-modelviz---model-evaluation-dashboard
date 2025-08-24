import { Model, Metric, MetricType, ModelWithMetrics, MetricSummary } from '@/types/model';

// Generate random metrics for the past 30 days
const generateMetrics = (modelId: string, baseValues: Record<MetricType, number>): Metric[] => {
  const metrics: Metric[] = [];
  const metricTypes: MetricType[] = ['accuracy', 'latency', 'perplexity', 'toxicity', 'safety'];
  
  // Generate 30 days of data for each metric type
  for (let day = 30; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    metricTypes.forEach(type => {
      // Add some random variation to the base value
      let value = baseValues[type];
      
      // Add improvement trend over time
      if (type === 'accuracy' || type === 'safety') {
        // These metrics should increase over time (improvement)
        value += (30 - day) * 0.001;
      } else {
        // These metrics should decrease over time (improvement)
        value -= (30 - day) * 0.001;
      }
      
      // Add some random noise
      const noise = (Math.random() - 0.5) * 0.02;
      value += noise;
      
      // Ensure values stay within reasonable bounds
      if (type === 'accuracy' || type === 'safety') {
        value = Math.min(Math.max(value, 0), 1);
      } else if (type === 'latency') {
        value = Math.max(value, 10);
      } else if (type === 'perplexity') {
        value = Math.max(value, 1);
      } else if (type === 'toxicity') {
        value = Math.min(Math.max(value, 0), 1);
      }
      
      metrics.push({
        id: `${modelId}-${type}-${date.toISOString()}`,
        modelId,
        type,
        value,
        timestamp: date.toISOString(),
      });
    });
  }
  
  return metrics;
};

// Calculate summary metrics
const calculateSummary = (metrics: Metric[]): Record<MetricType, MetricSummary> => {
  const metricTypes: MetricType[] = ['accuracy', 'latency', 'perplexity', 'toxicity', 'safety'];
  const summary: Record<MetricType, MetricSummary> = {} as Record<MetricType, MetricSummary>;
  
  metricTypes.forEach(type => {
    const typeMetrics = metrics.filter(m => m.type === type);
    
    // Sort by timestamp (newest first)
    typeMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const current = typeMetrics[0]?.value || 0;
    const previous = typeMetrics[1]?.value || current;
    const change = current - previous;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    
    if (type === 'accuracy' || type === 'safety') {
      // For these metrics, up is good
      trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
    } else {
      // For these metrics, down is good
      trend = change < 0 ? 'up' : change > 0 ? 'down' : 'stable';
    }
    
    summary[type] = {
      type,
      value: current,
      change: Math.abs(change),
      trend,
    };
  });
  
  return summary;
};

// Base models
export const MODELS: Model[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    version: 'v1.0',
    description: 'Large language model with 1.8 trillion parameters',
    createdAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'claude3',
    name: 'Claude',
    version: 'v3.5',
    description: 'Anthropic\'s flagship conversational AI assistant',
    createdAt: '2025-07-15T00:00:00.000Z',
  },
  {
    id: 'llama2',
    name: 'Llama',
    version: 'v2.1',
    description: 'Open-source large language model by Meta',
    createdAt: '2025-05-20T00:00:00.000Z',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    version: 'v8.0',
    description: 'Specialized for code generation and technical tasks',
    createdAt: '2025-08-01T00:00:00.000Z',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    version: 'v2.0',
    description: 'Google\'s multimodal AI system',
    createdAt: '2025-07-01T00:00:00.000Z',
  },
];

// Base values for each model and metric type
const BASE_VALUES: Record<string, Record<MetricType, number>> = {
  gpt4: { accuracy: 0.92, latency: 250, perplexity: 3.2, toxicity: 0.03, safety: 0.97 },
  claude3: { accuracy: 0.91, latency: 220, perplexity: 3.4, toxicity: 0.02, safety: 0.98 },
  llama2: { accuracy: 0.89, latency: 180, perplexity: 3.7, toxicity: 0.04, safety: 0.95 },
  mistral: { accuracy: 0.90, latency: 200, perplexity: 3.5, toxicity: 0.03, safety: 0.96 },
  gemini: { accuracy: 0.93, latency: 270, perplexity: 3.1, toxicity: 0.02, safety: 0.97 },
};

// Generate full models with metrics
export const MODELS_WITH_METRICS: ModelWithMetrics[] = MODELS.map(model => {
  const metrics = generateMetrics(model.id, BASE_VALUES[model.id]);
  return {
    ...model,
    metrics,
    summary: calculateSummary(metrics),
  };
});

// Helper function to get a model by ID
export const getModelById = (id: string): ModelWithMetrics | undefined => {
  return MODELS_WITH_METRICS.find(model => model.id === id);
};

// Helper function to get metrics for a model filtered by type
export const getMetricsByModelId = (
  modelId: string, 
  type?: MetricType
): Metric[] => {
  const model = getModelById(modelId);
  if (!model) return [];
  
  if (type) {
    return model.metrics.filter(metric => metric.type === type);
  }
  
  return model.metrics;
};