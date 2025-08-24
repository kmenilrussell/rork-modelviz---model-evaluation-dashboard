import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Calendar } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useModelStore } from "@/hooks/use-model-store";
import { Model } from "@/types/model";

export default function ModelsScreen() {
  const router = useRouter();
  const { models, isLoading, error, fetchModels, setSelectedModelId } = useModelStore();
  
  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle model selection
  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    router.push('/');
  };
  
  // Render model item
  const renderModelItem = ({ item }: { item: Model }) => (
    <TouchableOpacity
      style={styles.modelCard}
      onPress={() => handleSelectModel(item.id)}
      testID={`model-list-item-${item.id}`}
    >
      <View style={styles.modelInfo}>
        <Text style={styles.modelName}>{item.name}</Text>
        <Text style={styles.modelVersion}>{item.version}</Text>
        <Text style={styles.modelDescription}>{item.description}</Text>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={COLORS.text} style={{ opacity: 0.6 }} />
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={COLORS.text} style={{ opacity: 0.4 }} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Models</Text>
      </View>
      
      {isLoading && models.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading models...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={models}
          renderItem={renderModelItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchModels} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No models available</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  modelCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modelVersion: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  modelDescription: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    marginLeft: 4,
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
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
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