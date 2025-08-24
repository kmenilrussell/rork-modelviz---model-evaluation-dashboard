import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart, LineChart, Radar } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface ChartTypeSelectorProps {
  selectedType: 'line' | 'bar' | 'radar';
  onSelectType: (type: 'line' | 'bar' | 'radar') => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ 
  selectedType, 
  onSelectType 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          selectedType === 'line' && styles.selectedOption
        ]}
        onPress={() => onSelectType('line')}
        testID="chart-type-line"
      >
        <LineChart 
          size={20} 
          color={selectedType === 'line' ? COLORS.primary : COLORS.text} 
        />
        <Text 
          style={[
            styles.optionText,
            selectedType === 'line' && styles.selectedOptionText
          ]}
        >
          Trends
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          selectedType === 'bar' && styles.selectedOption
        ]}
        onPress={() => onSelectType('bar')}
        testID="chart-type-bar"
      >
        <BarChart 
          size={20} 
          color={selectedType === 'bar' ? COLORS.primary : COLORS.text} 
        />
        <Text 
          style={[
            styles.optionText,
            selectedType === 'bar' && styles.selectedOptionText
          ]}
        >
          Comparison
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          selectedType === 'radar' && styles.selectedOption
        ]}
        onPress={() => onSelectType('radar')}
        testID="chart-type-radar"
      >
        <Radar 
          size={20} 
          color={selectedType === 'radar' ? COLORS.primary : COLORS.text} 
        />
        <Text 
          style={[
            styles.optionText,
            selectedType === 'radar' && styles.selectedOptionText
          ]}
        >
          Radar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '20', // 20% opacity
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ChartTypeSelector;