import { create } from 'zustand';
import { MODELS_WITH_METRICS, getModelById, getMetricsByModelId } from '@/mocks/models';
import { MetricType, ModelWithMetrics, Metric } from '@/types/model';

interface ModelState {
  models: ModelWithMetrics[];
  selectedModelId: string | null;
  selectedModel: ModelWithMetrics | null;
  selectedMetricType: MetricType | null;
  filteredMetrics: Metric[];
  isLoading: boolean;
  error: string | null;
  chartType: 'line' | 'bar' | 'radar';
  
  // Actions
  setSelectedModelId: (id: string | null) => void;
  setSelectedMetricType: (type: MetricType | null) => void;
  setChartType: (type: 'line' | 'bar' | 'radar') => void;
  fetchModels: () => Promise<void>;
  fetchMetrics: (modelId: string, type?: MetricType) => Promise<void>;
  
  // Simulated real-time update
  updateMetric: (metric: Metric) => void;
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: [],
  selectedModelId: null,
  selectedModel: null,
  selectedMetricType: null,
  filteredMetrics: [],
  isLoading: false,
  error: null,
  chartType: 'line',
  
  setSelectedModelId: (id: string | null) => {
    set({ selectedModelId: id, selectedModel: id ? getModelById(id) : null });
    if (id) {
      get().fetchMetrics(id, get().selectedMetricType || undefined);
    } else {
      set({ filteredMetrics: [] });
    }
  },
  
  setSelectedMetricType: (type: MetricType | null) => {
    set({ selectedMetricType: type });
    const { selectedModelId } = get();
    if (selectedModelId) {
      get().fetchMetrics(selectedModelId, type || undefined);
    }
  },
  
  setChartType: (type: 'line' | 'bar' | 'radar') => {
    set({ chartType: type });
  },
  
  fetchModels: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ models: MODELS_WITH_METRICS, isLoading: false });
      
      // Auto-select first model if none selected
      const { selectedModelId } = get();
      if (!selectedModelId && MODELS_WITH_METRICS.length > 0) {
        get().setSelectedModelId(MODELS_WITH_METRICS[0].id);
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch models' 
      });
    }
  },
  
  fetchMetrics: async (modelId: string, type?: MetricType) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const metrics = getMetricsByModelId(modelId, type);
      set({ filteredMetrics: metrics, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch metrics' 
      });
    }
  },
  
  updateMetric: (metric: Metric) => {
    set(state => {
      // Update the models list
      const updatedModels = state.models.map(model => {
        if (model.id === metric.modelId) {
          // Replace the metric if it exists, otherwise add it
          const existingIndex = model.metrics.findIndex(
            m => m.type === metric.type && m.timestamp === metric.timestamp
          );
          
          const updatedMetrics = [...model.metrics];
          if (existingIndex >= 0) {
            updatedMetrics[existingIndex] = metric;
          } else {
            updatedMetrics.push(metric);
          }
          
          // Recalculate summary
          const typeMetrics = updatedMetrics.filter(m => m.type === metric.type);
          typeMetrics.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          const current = typeMetrics[0]?.value || 0;
          const previous = typeMetrics[1]?.value || current;
          const change = current - previous;
          
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (metric.type === 'accuracy' || metric.type === 'safety') {
            trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
          } else {
            trend = change < 0 ? 'up' : change > 0 ? 'down' : 'stable';
          }
          
          const updatedSummary = {
            ...model.summary,
            [metric.type]: {
              type: metric.type,
              value: current,
              change: Math.abs(change),
              trend,
            }
          };
          
          return {
            ...model,
            metrics: updatedMetrics,
            summary: updatedSummary,
          };
        }
        return model;
      });
      
      // Update filtered metrics if this metric matches current filters
      let updatedFilteredMetrics = [...state.filteredMetrics];
      if (
        state.selectedModelId === metric.modelId && 
        (!state.selectedMetricType || state.selectedMetricType === metric.type)
      ) {
        const existingIndex = updatedFilteredMetrics.findIndex(
          m => m.type === metric.type && m.timestamp === metric.timestamp
        );
        
        if (existingIndex >= 0) {
          updatedFilteredMetrics[existingIndex] = metric;
        } else {
          updatedFilteredMetrics.push(metric);
        }
      }
      
      // Update selected model if needed
      let updatedSelectedModel = state.selectedModel;
      if (state.selectedModel?.id === metric.modelId) {
        updatedSelectedModel = updatedModels.find(m => m.id === metric.modelId) || null;
      }
      
      return {
        models: updatedModels,
        filteredMetrics: updatedFilteredMetrics,
        selectedModel: updatedSelectedModel,
      };
    });
  },
}));