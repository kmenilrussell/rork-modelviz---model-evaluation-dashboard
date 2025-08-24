import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useModelStore } from "@/hooks/use-model-store";
import { useWebSocket } from "@/hooks/use-websocket";
import ModelSelector from "@/components/ModelSelector";
import MetricCard from "@/components/MetricCard";
import ChartTypeSelector from "@/components/ChartTypeSelector";
import MetricsChart from "@/components/MetricsChart";
import ConnectionStatus from "@/components/ConnectionStatus";
import { MetricType } from "@/types/model";

export default function DashboardScreen() {
  const { 
    models, 
    selectedModelId, 
    selectedModel,
    selectedMetricType,
    filteredMetrics,
    isLoading, 
    error,
    chartType,
    setSelectedModelId,
    setSelectedMetricType,
    setChartType,
    fetchModels,
    fetchMetrics,
  } = useModelStore();
  
  const { isConnected, isConnecting } = useWebSocket();
  
  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);
  
  // Handle refresh
  const handleRefresh = () => {
    fetchModels();
    if (selectedModelId) {
      fetchMetrics(selectedModelId, selectedMetricType || undefined);
    }
  };
  
  // Handle metric card press
  const handleMetricCardPress = (type: MetricType) => {
    setSelectedMetricType(selectedMetricType === type ? null : type);
  };
  
  // Render metric cards
  const renderMetricCards = () => {
    if (!selectedModel) return null;
    
    const metricTypes: MetricType[] = ['accuracy', 'latency', 'perplexity', 'toxicity', 'safety'];
    
    return (
      <FlatList
        data={metricTypes}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <MetricCard
            metric={selectedModel.summary[item]}
            onPress={() => handleMetricCardPress(item)}
            isSelected={selectedMetricType === item}
          />
        )}
        keyExtractor={item => item}
        contentContainerStyle={styles.metricCardsContainer}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>ModelViz</Text>
          <ConnectionStatus isConnected={isConnected} isConnecting={isConnecting} />
        </View>
        
        <ModelSelector
          models={models}
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
        />
        
        {isLoading && !selectedModel ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading models...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : selectedModel ? (
          <>
            <Text style={styles.sectionTitle}>Metrics Overview</Text>
            {renderMetricCards()}
            
            <Text style={styles.sectionTitle}>Visualization</Text>
            <ChartTypeSelector
              selectedType={chartType}
              onSelectType={setChartType}
            />
            
            <MetricsChart
              metrics={filteredMetrics}
              chartType={chartType}
              selectedMetricType={selectedMetricType}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Select a model to view metrics</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  metricCardsContainer: {
    paddingRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginVertical: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
  },
});