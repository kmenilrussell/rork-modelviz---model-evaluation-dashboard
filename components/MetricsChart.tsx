import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Metric, MetricType } from '@/types/model';

// Simple line chart implementation
const LineChart: React.FC<{
  data: { x: string; y: number }[];
  color: string;
  label: string;
}> = ({ data, color, label }) => {
  if (data.length === 0) return null;
  
  const width = Dimensions.get('window').width - 48;
  const height = 200;
  const padding = 20;
  
  // Find min and max values for chart scaling
  const yValues = data.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartLabel}>{label}</Text>
      <View style={styles.chartContent}>
        <View style={{ width, height }}>
          {/* Y-axis labels */}
          <Text style={[styles.axisLabel, { position: 'absolute', top: padding - 10, left: 0 }]}>
            {maxY.toFixed(2)}
          </Text>
          <Text style={[styles.axisLabel, { position: 'absolute', bottom: padding - 10, left: 0 }]}>
            {minY.toFixed(2)}
          </Text>
          
          {/* X-axis labels */}
          <Text style={[styles.axisLabel, { position: 'absolute', bottom: 0, left: padding }]}>
            {new Date(data[0].x).toLocaleDateString()}
          </Text>
          <Text style={[styles.axisLabel, { position: 'absolute', bottom: 0, right: padding }]}>
            {new Date(data[data.length - 1].x).toLocaleDateString()}
          </Text>
          
          {/* Chart line */}
          <View style={styles.chartLine}>
            <View style={[styles.line, { backgroundColor: color }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Simple bar chart implementation
const BarChart: React.FC<{
  data: { label: string; value: number; color: string }[];
}> = ({ data }) => {
  if (data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <View style={styles.barChartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barItem}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color 
                }
              ]} 
            />
            <Text style={styles.barValue}>{item.value.toFixed(2)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Simple radar chart placeholder
const RadarChart: React.FC<{
  data: { label: string; value: number; color: string }[];
}> = ({ data }) => {
  return (
    <View style={styles.radarContainer}>
      <Text style={styles.radarText}>
        Radar Chart Visualization
      </Text>
      <View style={styles.radarLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}: {item.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface MetricsChartProps {
  metrics: Metric[];
  chartType: 'line' | 'bar' | 'radar';
  selectedMetricType: MetricType | null;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ 
  metrics, 
  chartType,
  selectedMetricType,
}) => {
  // Get color for metric type
  const getColorForMetricType = (type: MetricType): string => {
    switch (type) {
      case 'accuracy':
        return COLORS.accuracy;
      case 'latency':
        return COLORS.latency;
      case 'perplexity':
        return COLORS.perplexity;
      case 'toxicity':
        return COLORS.toxicity;
      case 'safety':
        return COLORS.safety;
      default:
        return COLORS.primary;
    }
  };
  
  // Format metric type for display
  const formatMetricType = (type: MetricType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Process data for charts
  const chartData = useMemo(() => {
    if (metrics.length === 0) return {};
    
    // Group metrics by type
    const groupedMetrics: Record<string, Metric[]> = {};
    metrics.forEach(metric => {
      if (!groupedMetrics[metric.type]) {
        groupedMetrics[metric.type] = [];
      }
      groupedMetrics[metric.type].push(metric);
    });
    
    // Sort metrics by timestamp
    Object.keys(groupedMetrics).forEach(type => {
      groupedMetrics[type].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    
    // Format data for line chart
    const lineData: Record<string, { x: string; y: number }[]> = {};
    Object.keys(groupedMetrics).forEach(type => {
      lineData[type] = groupedMetrics[type].map(metric => ({
        x: metric.timestamp,
        y: metric.value,
      }));
    });
    
    // Format data for bar chart
    const barData = Object.keys(groupedMetrics).map(type => {
      const latestMetric = groupedMetrics[type][groupedMetrics[type].length - 1];
      return {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: latestMetric.value,
        color: getColorForMetricType(type as MetricType),
      };
    });
    
    // Format data for radar chart (same as bar chart for now)
    const radarData = barData;
    
    return { lineData, barData, radarData };
  }, [metrics]);
  

  
  if (metrics.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No metrics available</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {chartType === 'line' && (
        <View>
          {selectedMetricType ? (
            // Show only selected metric type
            chartData.lineData?.[selectedMetricType] && (
              <LineChart 
                data={chartData.lineData[selectedMetricType]} 
                color={getColorForMetricType(selectedMetricType)}
                label={formatMetricType(selectedMetricType)}
              />
            )
          ) : (
            // Show all metric types
            Object.keys(chartData.lineData || {}).map((type) => (
              <LineChart 
                key={type}
                data={chartData.lineData![type]} 
                color={getColorForMetricType(type as MetricType)}
                label={formatMetricType(type as MetricType)}
              />
            ))
          )}
        </View>
      )}
      
      {chartType === 'bar' && (
        <BarChart 
          data={selectedMetricType 
            ? chartData.barData?.filter(d => d.label.toLowerCase() === selectedMetricType) || []
            : chartData.barData || []
          } 
        />
      )}
      
      {chartType === 'radar' && (
        <RadarChart 
          data={selectedMetricType 
            ? chartData.radarData?.filter(d => d.label.toLowerCase() === selectedMetricType) || []
            : chartData.radarData || []
          } 
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chartContent: {
    alignItems: 'center',
  },
  axisLabel: {
    fontSize: 10,
    color: COLORS.text,
    opacity: 0.6,
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  line: {
    height: 2,
    width: '100%',
  },
  barChartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  barItem: {
    marginBottom: 16,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  barContainer: {
    height: 24,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: '100%',
  },
  barValue: {
    position: 'absolute',
    right: 8,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  radarContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  radarText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  radarLegend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
});

export default MetricsChart;