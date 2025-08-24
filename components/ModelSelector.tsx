import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { Model } from '@/types/model';

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string | null;
  onSelectModel: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  models, 
  selectedModelId, 
  onSelectModel 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedModel = models.find(model => model.id === selectedModelId);
  
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  
  const handleSelectModel = (modelId: string) => {
    onSelectModel(modelId);
    closeModal();
  };
  
  const renderModelItem = ({ item }: { item: Model }) => (
    <TouchableOpacity
      style={[
        styles.modelItem,
        selectedModelId === item.id && styles.selectedModelItem
      ]}
      onPress={() => handleSelectModel(item.id)}
      testID={`model-item-${item.id}`}
    >
      <View>
        <Text style={styles.modelName}>{item.name}</Text>
        <Text style={styles.modelVersion}>{item.version}</Text>
      </View>
      {selectedModelId === item.id && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={openModal}
        testID="model-selector-button"
      >
        <View style={styles.selectorContent}>
          <View>
            <Text style={styles.label}>Model</Text>
            <Text style={styles.selectedModel}>
              {selectedModel ? `${selectedModel.name} ${selectedModel.version}` : 'Select a model'}
            </Text>
          </View>
          <ChevronDown size={20} color={COLORS.text} />
        </View>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Model</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={models}
            renderItem={renderModelItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.modelList}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: 4,
  },
  selectedModel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modelList: {
    padding: 16,
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  selectedModelItem: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modelVersion: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
});

export default ModelSelector;